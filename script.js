const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#complete");
const columns = [todo, progress, done];
const TaskAdding = document.querySelector(".New-taskAddingBtn");
const modal = document.querySelector(".modal");
const taskcolumn = document.querySelector(".Task-colum");
const addBtn = document.querySelector(".add-newTask");

let DraggingElement = null;
let taskData = {};


function localData() {
  const data = JSON.parse(localStorage.getItem("keys")) || {};

  for (const col in data) {
    const column = document.querySelector(`#${col}`);

    data[col].forEach((task) => {
      createTodo(task.title, task.desc, column);
    });
  }

  countUpdator();
}

if (localStorage.getItem("keys")) {
  localData();
}
function createTodo(title, desc, column) {
  const NewTodo = document.createElement("div");

  NewTodo.classList.add("Todo-item");
  NewTodo.setAttribute("draggable", "true");

  NewTodo.innerHTML = `
    <h2>${title}</h2>
    <p>${desc}</p>
    <button class="clear">Clear</button>
  `;

  NewTodo.addEventListener("dragstart", () => {
    DraggingElement = NewTodo;
  });

  column.appendChild(NewTodo);
}
function countUpdator() {
  taskData = {};

  columns.forEach((col) => {
    const tasks = col.querySelectorAll(".Todo-item");
    const count = col.querySelector(".count");

    taskData[col.id] = Array.from(tasks).map((task) => ({
      title: task.querySelector("h2").innerText,
      desc: task.querySelector("p").innerText,
    }));

    count.innerText = tasks.length;
  });

  localStorage.setItem("keys", JSON.stringify(taskData));
}
function enableDrop(column) {
  column.addEventListener("dragenter", (e) => {
    e.preventDefault();
    column.classList.add("hover");
  });

  column.addEventListener("dragleave", () => {
    column.classList.remove("hover");
  });

  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  column.addEventListener("drop", (e) => {
    e.preventDefault();

    if (DraggingElement) {
      column.appendChild(DraggingElement);
      column.classList.remove("hover");
      countUpdator();
    }
  });
}

columns.forEach(enableDrop);
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("clear")) {
    e.target.closest(".Todo-item").remove();
    countUpdator();
  }
});
TaskAdding.addEventListener("click", () => {
  modal.classList.add("show");
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    modal.classList.remove("show");
  }
});
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");
  }
});
addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const input = document.querySelector("#task-title").value.trim();
  const description = document.querySelector("#task-discription").value.trim();
  if (input && description){
  createTodo(input, description, todo);
  modal.classList.remove("show");
  document.querySelector("#task-title").value = "";
  document.querySelector("#task-discription").value = "";}
  else{
    alert("Plz enter your task")
  }

  countUpdator();
});