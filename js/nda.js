import {
  doc,
  setDoc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let userId = null;
const formulaLinks = document.getElementById("formulaLinks");
const completedTopics = new Set();

window.addEventListener("load", async () => {
  // Wait until user is logged in
  window.auth.onAuthStateChanged(async (user) => {
    if (!user) return;
    userId = user.uid;

    const ref = doc(window.db, "ndaProgress", userId);
    const snapshot = await getDoc(ref);

    if (snapshot.exists()) {
      const data = snapshot.data();
      for (let topic in data.completed || {}) {
        if (data.completed[topic]) {
          completedTopics.add(topic);
          unlockFormula(topic, false); // false to avoid double-save
          document.querySelector(`[data-topic="${topic}"]`).checked = true;
        }
      }
    }
  });
});

function unlockFormula(topic, shouldSave = true) {
  if (document.getElementById(`link-${topic}`)) return;

  const labelMap = {
    motion: ["📄 Motion Formula Sheet", "motion-sheet.pdf"],
    work: ["📄 Work & Energy Sheet", "work-energy-sheet.pdf"],
    thermo: ["📄 Thermodynamics Sheet", "thermo-sheet.pdf"]
  };

  const [label, file] = labelMap[topic] || [];
  if (!label) return;

  const link = document.createElement("a");
  link.href = `../assets/nda/${file}`;
  link.textContent = label;
  link.className = "download-btn";
  link.id = `link-${topic}`;
  link.download = file;

  formulaLinks.appendChild(link);
  completedTopics.add(topic);

  if (shouldSave && userId) {
    const ref = doc(window.db, "ndaProgress", userId);
    updateDoc(ref, {
      completed: Object.fromEntries([...completedTopics].map(t => [t, true]))
    }).catch(() =>
      setDoc(ref, { completed: Object.fromEntries([...completedTopics].map(t => [t, true])) })
    );
  }
}
