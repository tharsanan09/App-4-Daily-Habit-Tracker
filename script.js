const habitTitle = document.getElementById("habit-title");
const habitCategory = document.getElementById("habit-category");
const addHabitBtn = document.getElementById("add-habit");
const habitList = document.getElementById("habit-list");

const modal = document.getElementById("modal");
const closeModal = document.querySelector(".close");
const modalTitle = document.getElementById("modal-title");
const modalCategory = document.getElementById("modal-category");
const modalStreak = document.getElementById("modal-streak");
const modalTotal = document.getElementById("modal-total");
const modalHistory = document.getElementById("modal-history");

let habits = JSON.parse(localStorage.getItem("habits")) || [];

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

function renderHabits() {
  habitList.innerHTML = "";
  habits.forEach((habit) => {
    const li = document.createElement("li");

    const info = document.createElement("div");
    info.innerHTML = `<strong>${habit.title}</strong><br><small>${habit.category || ""}</small>`;

    const actions = document.createElement("div");
    actions.className = "actions";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = habit.completions[getToday()] || false;
    checkbox.onchange = () => toggleCompletion(habit.id);

    const detailBtn = document.createElement("button");
    detailBtn.textContent = "Details";
    detailBtn.onclick = () => showDetails(habit);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.style.backgroundColor = "#e74c3c";
    deleteBtn.onclick = () => deleteHabit(habit.id);

    actions.append(checkbox, detailBtn, deleteBtn);
    li.append(info, actions);
    habitList.appendChild(li);
  });
}

function addHabit() {
  const title = habitTitle.value.trim();
  const category = habitCategory.value.trim();
  if (!title) return;

  const newHabit = {
    id: Date.now(),
    title,
    category,
    completions: {},
  };

  habits.push(newHabit);
  saveHabits();
  renderHabits();

  habitTitle.value = "";
  habitCategory.value = "";
}

function deleteHabit(id) {
  habits = habits.filter(h => h.id !== id);
  saveHabits();
  renderHabits();
}

function toggleCompletion(id) {
  const today = getToday();
  habits = habits.map(h => {
    if (h.id === id) {
      h.completions[today] = !h.completions[today];
    }
    return h;
  });
  saveHabits();
  renderHabits();
}

function showDetails(habit) {
  modal.classList.remove("hidden");
  modalTitle.textContent = habit.title;
  modalCategory.textContent = `Category: ${habit.category || "None"}`;

  const completions = habit.completions;
  const dates = Object.keys(completions).sort().reverse();
  let streak = 0;
  let current = new Date(getToday());

  for (let date of dates) {
    if (completions[date]) {
      if (date === current.toISOString().split("T")[0]) {
        streak++;
        current.setDate(current.getDate() - 1);
      } else {
        break;
      }
    }
  }

  modalStreak.textContent = `Current Streak: ${streak}`;
  modalTotal.textContent = `Total Completions: ${Object.values(completions).filter(Boolean).length}`;

  modalHistory.innerHTML = "";
  dates.forEach(date => {
    const li = document.createElement("li");
    li.textContent = `${date}: ${completions[date] ? "✔️" : "❌"}`;
    modalHistory.appendChild(li);
  });
}

addHabitBtn.onclick = addHabit;
closeModal.onclick = () => modal.classList.add("hidden");

window.onload = renderHabits;
