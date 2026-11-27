"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/lib/content";
export function QuoteForm({
  contact = false,
  professional = false,
}: {
  contact?: boolean;
  professional?: boolean;
}) {
  const [intent, setIntent] = useState<"contact" | "rappel">("contact");
  const [client, setClient] = useState("particulier");
  const [state, setState] = useState<
    "idle" | "loading" | "success" | "error" | "test"
  >("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [startedAt, setStartedAt] = useState(() => Date.now());
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      ...Object.fromEntries(new FormData(form)),
      intent: contact ? intent : "devis",
      startedAt,
    };
    setState("loading");
    setErrors({});
    try {
      const { contactSchema, quoteSchema } = await import("@/lib/quote");
      const validated = (contact ? contactSchema : quoteSchema).safeParse(data);
      if (!validated.success) {
        setErrors(
          Object.fromEntries(
            validated.error.issues.map(({ path }) => [
              String(path[0]),
              "Vérifiez ce champ et son format.",
            ]),
          ),
        );
        setState("error");
        setMessage("Certains champs doivent être corrigés.");
        return;
      }
      const response = await fetch("/api/devis/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated.data),
      });
      const result = await response.json();
      if (!response.ok) {
        setErrors(result.errors || {});
        setState("error");
        setMessage(
          result.message ||
            "La demande n’a pas pu être transmise. Réessayez plus tard.",
        );
        return;
      }
      setState(result.test ? "test" : "success");
      setMessage(result.message);
      if (!result.test) {
        form.reset();
        setClient("particulier");
        setIntent("contact");
        setStartedAt(Date.now());
      }
    } catch {
      setState("error");
      setMessage(
        "La demande n’a pas pu être transmise. Vérifiez votre connexion et réessayez.",
      );
    }
  }
  const error = (name: string) =>
    errors[name] ? (
      <span className="field-error" id={`${name}-error`}>
        {errors[name]}
      </span>
    ) : null;
  const fieldState = (name: string) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });
  return (
    <form
      className="quote-form"
      onSubmit={submit}
      aria-busy={state === "loading"}
    >
      {contact ? (
        <label>
          Motif du contact
          <select
            value={intent}
            onChange={(event) =>
              setIntent(event.target.value === "rappel" ? "rappel" : "contact")
            }
          >
            <option value="contact">Envoyer un message</option>
            <option value="rappel">Être rappelé</option>
          </select>
        </label>
      ) : (
        <>
          <div className="form-section-label">Votre projet</div>
          <fieldset>
            <legend>Vous êtes</legend>
            <div className="client-choices">
              {[
                ["particulier", "Un particulier"],
                ["professionnel", "Un professionnel"],
                ["syndic", "Un syndic"],
              ]
                .filter(([value]) => professional || value === "particulier")
                .map(([v, l]) => (
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
              <input
                name="organization"
                required
                maxLength={160}
                {...fieldState("organization")}
              />
              {error("organization")}
            </label>
          )}
          <div className="form-grid">
            <label>
              Prestation souhaitée *
              <select
                name="service"
                key={client}
                required
                {...fieldState("service")}
              >
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
              <select name="frequency" required {...fieldState("frequency")}>
                <option value="a-definir">À définir ensemble</option>
                <option value="ponctuelle">Une intervention ponctuelle</option>
                <option value="hebdomadaire">Chaque semaine</option>
                <option value="bimensuelle">Tous les quinze jours</option>
              </select>
              {error("frequency")}
            </label>
            <label>
              Surface approximative (m²)
              <input
                name="surface"
                {...fieldState("surface")}
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
                {...fieldState("date")}
                type="date"
                min={new Date().toISOString().slice(0, 10)}
              />
              {error("date")}
            </label>
            <label>
              Ville d’intervention *
              <input
                name="city"
                {...fieldState("city")}
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
                {...fieldState("postalCode")}
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
        </>
      )}
      <label>
        {contact
          ? "Votre message *"
          : "Précisions sur l’intervention (facultatif)"}
        <textarea
          name="message"
          {...fieldState("message")}
          required={contact}
          minLength={contact ? 20 : undefined}
          maxLength={4000}
          rows={4}
          placeholder={
            contact
              ? "Décrivez votre demande en 20 caractères minimum."
              : "Les espaces à entretenir, vos priorités, les contraintes d’accès…"
          }
        />
        {error("message")}
      </label>
      <div className="form-section-label">Vos coordonnées</div>
      <div className="form-grid">
        <label>
          Prénom *
          <input
            name="firstName"
            {...fieldState("firstName")}
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
            {...fieldState("lastName")}
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
            {...fieldState("email")}
            type="email"
            required
            maxLength={200}
            autoComplete="email"
          />
          {error("email")}
        </label>
        <label>
          {contact && intent === "rappel"
            ? "Téléphone *"
            : "Téléphone (facultatif)"}
          <input
            name="phone"
            type="tel"
            maxLength={30}
            autoComplete="tel"
            required={contact && intent === "rappel"}
            {...fieldState("phone")}
          />
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
        demande et à vous répondre. Aucune inscription commerciale.{" "}
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
      {!contact && (
        <p className="form-note">
          Une demande de devis, sans engagement et sans paiement.
        </p>
      )}
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
