"use client";

import { useState, useSyncExternalStore } from "react";

const format = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});
const subscribe = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

export function PriceEstimator({
  rate,
  sap,
  preview,
}: {
  rate: number;
  sap: boolean;
  preview: boolean;
}) {
  const [hours, setHours] = useState("2");
  const [frequency, setFrequency] = useState("1");
  const ready = useSyncExternalStore(subscribe, clientReady, serverReady);
  const duration = Number(hours);
  const valid =
    duration >= 1 && duration <= 24 && Number.isInteger(duration * 2);
  const total = Math.round(duration * Number(frequency) * rate * 100) / 100;

  return (
    <fieldset className="quote-form" disabled={!ready}>
      <legend>Estimation pour un ménage à domicile</legend>
      <p>
        {preview
          ? "Simulation de préproduction avec un tarif de travail à confirmer."
          : "Estimation indicative, hors frais éventuels précisés dans le devis."}
      </p>
      <div className="form-grid">
        <label>
          Heures par intervention
          <input
            type="number"
            min="1"
            max="24"
            step="0.5"
            value={hours}
            onInput={(event) => setHours(event.currentTarget.value)}
          />
        </label>
        <label>
          Fréquence
          <select
            value={frequency}
            onChange={(event) => setFrequency(event.target.value)}
          >
            <option value="1">Une intervention</option>
            <option value="2">
              Tous les quinze jours, sur quatre semaines
            </option>
            <option value="4">Chaque semaine, sur quatre semaines</option>
          </select>
        </label>
      </div>
      <output aria-live="polite">
        {valid
          ? `${format.format(total)} pour ${duration * Number(frequency)} h.`
          : "Saisissez de 1 à 24 heures par demi-heure."}
        {valid &&
          sap &&
          ` Reste estimé après crédit d’impôt : ${format.format(total / 2)}, sous réserve d’éligibilité et des plafonds applicables.`}
      </output>
    </fieldset>
  );
}
