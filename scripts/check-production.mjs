import { productionIssues } from "../src/lib/readiness.ts";
const issues = productionIssues();
if (issues.length) {
  console.error(
    "Publication bloquée :\n" + issues.map((x) => `- ${x}`).join("\n"),
  );
  process.exitCode = 1;
} else
  console.log(
    "Contrôles de configuration satisfaits. Effectuer les validations humaines de DEPLOYMENT.md.",
  );
