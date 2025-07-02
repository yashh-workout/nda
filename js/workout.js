import {
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let userId = null;
const form = document.getElementById("workoutForm");
const log = document.getElementById("workoutLog");

window.auth.onAuthStateChanged(async (user) => {
  if (!user) return;
  userId = user.uid;
  await loadWorkouts();
});

async function loadWorkouts() {
  log.innerHTML = "";
  const q = query(collection(window.db, "workouts"), where("uid", "==", userId));
  const snapshot = await getDocs(q);

  snapshot.forEach(doc => {
    const data = doc.data();
    const li = document.createElement("li");
    li.textContent = `${data.exercise} - ${data.sets}x${data.reps}`;
    log.appendChild(li);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const workout = {
    uid: userId,
    exercise: document.getElementById("exercise").value,
    reps: +document.getElementById("reps").value,
    sets: +document.getElementById("sets").value,
    timestamp: Date.now()
  };

  await addDoc(collection(window.db, "workouts"), workout);
  form.reset();
  await loadWorkouts();
});
