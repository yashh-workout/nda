import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

window.auth.onAuthStateChanged(async (user) => {
  if (!user) return;
  const uid = user.uid;

  // NDA Progress
  const ndaSnap = await getDoc(doc(window.db, "ndaProgress", uid));
  const ndaData = ndaSnap.exists() ? ndaSnap.data().completed : {};
  const ndaPercent = Math.round((Object.values(ndaData).filter(Boolean).length / 3) * 100);
  document.getElementById("ndaProgress").textContent = `🛡️ NDA Progress: ${ndaPercent}%`;

  // JEE Progress
  const jeeSnap = await getDoc(doc(window.db, "jeeProgress", uid));
  const jeeData = jeeSnap.exists() ? jeeSnap.data().completed : {};
  const jeePercent = Math.round((Object.values(jeeData).filter(Boolean).length / 5) * 100);
  document.getElementById("jeeProgress").textContent = `⚛️ JEE Progress: ${jeePercent}%`;

  // Workout Stats
  const q = query(collection(window.db, "workouts"), where("uid", "==", uid));
  const workoutSnap = await getDocs(q);
  document.getElementById("workoutStats").textContent = `🏋️ Workouts Logged: ${workoutSnap.size}`;

  // Streak (placeholder for now)
  const streak = localStorage.getItem("studyx-streak") || 0;
  document.getElementById("streak").textContent = `🔥 Streak: ${streak} days`;
});
