import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc, getDoc, setDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const uidProgress = {};
const subject = "physics";
const user = { uid: null };

// Define NDA Physics topics here or load from JSON
const topics = [
  "Thermodynamics",
  "Laws of Motion",
  "Optics"
];

// Populate UI
const list = document.getElementById("topicList");
topics.forEach(topic => {
  const li = document.createElement("li");
  li.innerHTML = `
    <label>
      <input type="checkbox" onchange="saveTopic('${topic}', this.checked)" />
      ${topic}
    </label>`;
  list.appendChild(li);
});

// Load user state
onAuthStateChanged(auth, async (userCred) => {
  if (!userCred) {
    alert("Please log in first");
    window.location.href = "login.html";
    return;
  }

  user.uid = userCred.uid;

  // Load saved progress
  const ref = doc(db, "users", user.uid, "ndaProgress", subject);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const data = snap.data();
    topics.forEach((topic, i) => {
      const checkbox = document.querySelectorAll("input[type='checkbox']")[i];
      if (data[topic]) {
        checkbox.checked = true;
        uidProgress[topic] = true;
      }
    });
    checkFormulaUnlock();
  }
});

// Save function
window.saveTopic = async function (topic, state) {
  uidProgress[topic] = state;
  const ref = doc(db, "users", user.uid, "ndaProgress", subject);
  await setDoc(ref, uidProgress, { merge: true });
  checkFormulaUnlock();
};

// Formula logic
function checkFormulaUnlock() {
  const allDone = topics.every(t => uidProgress[t]);
  document.getElementById("formulaSection").style.display = allDone ? "block" : "none";
}

window.viewFormula = function () {
  window.open("../assets/nda/physics-formula.pdf", "_blank");
};
