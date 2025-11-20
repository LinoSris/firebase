import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  getDoc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// --- Firebase ---
const firebaseConfig = {
  apiKey: "AIzaSyBhd7oIl79GGEgo3B9YpLXwFudciddE-xM",
  authDomain: "loginsignup-6f695.firebaseapp.com",
  projectId: "loginsignup-6f695",
  storageBucket: "loginsignup-6f695.firebasestorage.app",
  messagingSenderId: "45063161138",
  appId: "145063161138web0e9b818462a0721589432b",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let tasks = [];

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "../LoginSignup/index.html";
    return;
  }
  await loadTodos(user.uid);
  updateTaskList();
});

async function loadTodos(uid) {
  tasks = [];
  const todosRef = collection(db, "users", uid, "todos");
  const snapshot = await getDocs(todosRef);
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    tasks.push({ id: docSnap.id, text: data.text, completed: data.completed });
  });
}

// Add a new task
async function addTask() {
  const taskInput = document.getElementById("taskInput");
  const text = taskInput.value.trim();

  console.log("Adding task:", text);

  if (text) {
    const user = auth.currentUser;
    const todosRef = collection(db, "users", user.uid, "todos");
    const docRef = await addDoc(todosRef, {
      text: text,
      completed: false,
    });
    tasks.push({ id: docRef.id, text: text, completed: false });
    taskInput.value = "";
    updateTaskList();
  }
}

// Update tasks in UI and bind events
function updateTaskList() {
  const taskList = document.querySelector(".task-list");
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const listItem = document.createElement("li");
    listItem.className = "task-listitem";
    listItem.innerHTML = `
      <div class="task-item">
        <div class="task-itemmain">
          <input type="checkbox" class="task-itemcheckbox" ${
            task.completed ? "checked" : ""
          } />
          <p class="task-itemtext" style="${
            task.completed ? "text-decoration: line-through;" : ""
          }">${task.text}</p>
        </div>
        <div class="task-itemicons">
          <img src="./images/bin.png" class="task-itemdelete" alt="Delete" style="cursor:pointer;">
        </div>
      </div>
    `;
    // Toggle complete
    listItem
      .querySelector(".task-itemcheckbox")
      .addEventListener("change", async () => {
        const user = auth.currentUser;
        const todoDoc = doc(db, "users", user.uid, "todos", task.id);
        await updateDoc(todoDoc, {
          completed: !task.completed,
        });
        tasks[index].completed = !task.completed;
        updateTaskList();
      });

    // Delete task
    listItem
      .querySelector(".task-itemdelete")
      .addEventListener("click", async () => {
        const user = auth.currentUser;
        const todoDoc = doc(db, "users", user.uid, "todos", task.id);
        await deleteDoc(todoDoc);
        tasks.splice(index, 1);
        updateTaskList();
      });

    taskList.appendChild(listItem);
  });

  // Update progress bar and circle
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  const progressBarFill = document.getElementById("progress");
  const progressNumber = document.getElementById("numbers");
  if (progressBarFill) progressBarFill.style.width = percentage + "%";
  if (progressNumber) progressNumber.textContent = `${completed}/${total}`;
}

document.getElementById("newTask").addEventListener("click", function (e) {
  e.preventDefault();
  addTask();
});
