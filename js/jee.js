import {
  doc,
  setDoc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let userId = null;
const topicList = document.getElementById("jeeTopics");
let completed = {};

window.addEventListener("load", () => {
  window.auth.onAuthStateChanged(async (user) => {
    if (!user) return;
    userId = user.uid;

    const ref = doc(window.db, "jeeProgress", userId);
    const snap = await getDoc(ref);
    completed = snap.exists() ? snap.data().completed || {} : {};

    // Restore checkboxes
    Object.entries(completed).forEach(([topic, isDone]) => {
      const cb = topicList.querySelector(`[data-topic='${topic}']`);
      if (cb) cb.checked = isDone;
    });
  });
});

topicList.addEventListener("change", async (e) => {
  if (e.target.type === "checkbox") {
    const topic = e.target.dataset.topic;
    completed[topic] = e.target.checked;

    const ref = doc(window.db, "jeeProgress", userId);
    try {
      await updateDoc(ref, { completed });
    } catch {
      await setDoc(ref, { completed });
    }
  }
});
