"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/lib/content";
export function QuoteForm() {
  const [client, setClient] = useState("particulier");
  const [state, setState] = useState<
    "idle" | "loading" | "success" | "error" | "test"
  >("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const started = useRef(Date.now());
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setState("loading");
    setErrors({});
    try {
      const response = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, startedAt: started.current }),
      });
      const result = await response.json();
      if (!response.ok) {
        setErrors(result.errors || {});
        throw new Error(
          result.message ||
            "La demande n’a pas pu être transmise. Réessayez plus tard.",
        );
      }
      setState(result.test ? "test" : "success");
      setMessage(result.message);
      if (!result.test) {
        form.reset();
        setClient("particulier");
        started.current = Date.now();
      }
    } catch (err) {
      setState("error");
      setMessage(
        err instanceof Error
          ? err.message
          : "Erreur réseau. Vérifiez votre connexion et réessayez.",
      );
    }
  }
  const error = (name: string) =>
    errors[name] ? (
      <span className="field-error" id={`${name}-error`}>
        {errors[name]}
      </span>
    ) : null;
  return (
    <form
      className="quote-form"
      onSubmit={submit}
      aria-busy={state === "loading"}
    >
      <div className="form-section-label">01 / VOTRE PROJET</div>
      <fieldset>
        <legend>Vous êtes</legend>
        <div className="client-choices">
          {[
            ["particulier", "Un particulier"],
            ["professionnel", "Un professionnel"],
            ["syndic", "Un syndic"],
          ].map(([v, l]) => (
            <label key={v}>
              <input
                type="radio"
                name="clientType"
                value={v}
                checked={client === v}
                onChange={() => setClient(v)}
              />
              <span>{l}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {client !== "particulier" && (
        <label>
          Entreprise ou copropriété *
          <input name="organization" required maxLength={160} />
          {error("organization")}
        </label>
      )}
      <div className="form-grid">
        <label>
          Prestation souhaitée *
          <select name="service" key={client} required>
            {services
              .filter(
                (s) =>
                  client !== "particulier" ||
                  !["nettoyage-bureaux", "nettoyage-coproprietes"].includes(
                    s.slug,
                  ),
              )
              .map((s) => (
                <option value={s.slug} key={s.slug}>
                  {s.title}
                </option>
              ))}
          </select>
          {error("service")}
        </label>
        <label>
          Fréquence *
          <select name="frequency" required>
            <option value="a-definir">À définir ensemble</option>
            <option value="ponctuelle">Une intervention ponctuelle</option>
            <option value="hebdomadaire">Chaque semaine</option>
            <option value="bimensuelle">Tous les quinze jours</option>
          </select>
        </label>
        <label>
          Surface approximative (m²)
          <input
            name="surface"
            type="number"
            min="1"
            max="999999"
            placeholder="Ex. 80"
          />
          {error("surface")}
        </label>
        <label>
          Date souhaitée
          <input
            name="date"
            type="date"
            min={new Date().toISOString().slice(0, 10)}
          />
          {error("date")}
        </label>
        <label>
          Ville d’intervention *
          <input
            name="city"
            required
            maxLength={100}
            autoComplete="address-level2"
            placeholder="Saint-Germain-en-Laye"
          />
          {error("city")}
        </label>
        <label>
          Code postal *
          <input
            name="postalCode"
            required
            pattern="[0-9]{5}"
            maxLength={5}
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="78100"
          />
          {error("postalCode")}
        </label>
      </div>
      <label>
        Parlez-nous de votre besoin *
        <textarea
          name="message"
          required
          minLength={20}
          maxLength={4000}
          rows={4}
          placeholder="Les espaces à entretenir, vos priorités, les contraintes d’accès… (20 caractères minimum)"
        />
        {error("message")}
      </label>
      <div className="form-section-label">02 / POUR VOUS RECONTACTER</div>
      <div className="form-grid">
        <label>
          Prénom *
          <input
            name="firstName"
            required
            maxLength={80}
            autoComplete="given-name"
          />
          {error("firstName")}
        </label>
        <label>
          Nom *
          <input
            name="lastName"
            required
            maxLength={80}
            autoComplete="family-name"
          />
          {error("lastName")}
        </label>
        <label>
          Email *
          <input
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
          />
          {error("email")}
        </label>
        <label>
          Téléphone (facultatif)
          <input name="phone" type="tel" maxLength={30} autoComplete="tel" />
          {error("phone")}
        </label>
      </div>
      <div className="honeypot" aria-hidden="true">
        <label>
          Votre site web
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <p className="privacy-note">
        * Champs obligatoires. Ces données servent uniquement à étudier votre
        demande et à vous répondre, au titre des mesures précontractuelles.
        Aucune inscription commerciale.{" "}
        <Link href="/politique-confidentialite/">
          En savoir plus sur vos données et vos droits.
        </Link>
      </p>
      <button className="button" disabled={state === "loading"} type="submit">
        {state === "loading"
          ? "Transmission en cours…"
          : "Transmettre ma demande"}{" "}
        <ArrowUpRight size={17} />
      </button>
      <p className="form-note">
        Une demande de devis, sans engagement et sans paiement.
      </p>
      {state !== "idle" && state !== "loading" && (
        <div
          className={`form-status ${state}`}
          role={state === "error" ? "alert" : "status"}
          tabIndex={-1}
        >
          {message}
        </div>
      )}
    </form>
  );
}
