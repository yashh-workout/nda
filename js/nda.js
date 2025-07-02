function unlockFormula(topic) {
  const formulaLinks = document.getElementById("formulaLinks");

  // Check if link already exists
  if (document.getElementById(`link-${topic}`)) return;

  let label, file;
  switch (topic) {
    case "motion":
      label = "📄 Motion Formula Sheet";
      file = "motion-sheet.pdf";
      break;
    case "work":
      label = "📄 Work & Energy Formula Sheet";
      file = "work-energy-sheet.pdf";
      break;
    case "thermo":
      label = "📄 Thermodynamics Formula Sheet";
      file = "thermo-sheet.pdf";
      break;
    default:
      return;
  }

  const link = document.createElement("a");
  link.href = `../assets/nda/${file}`;
  link.textContent = label;
  link.className = "download-btn";
  link.download = file;
  link.id = `link-${topic}`;

  formulaLinks.appendChild(link);
}
