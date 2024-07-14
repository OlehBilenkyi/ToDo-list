const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const sortSelect = document.getElementById("sort-select");
const todoListsContainer = document.getElementById("todo-lists");
const newListBtn = document.getElementById("new-list-btn");
const deleteSelectedBtn = document.getElementById("delete-selected-btn");

let lists = [
  {
    name: "Default List",
    todos: [],
  },
];

function renderLists() {
  todoListsContainer.innerHTML = "";

  lists.forEach((list, listIndex) => {
    const listContainer = document.createElement("div");
    listContainer.classList.add("todo-list");

    const listHeader = document.createElement("h2");
    listHeader.textContent = list.name;
    const deleteListBtn = document.createElement("button");
    deleteListBtn.textContent = "Delete List";
    deleteListBtn.classList.add("delete-list-button");
    deleteListBtn.onclick = () => deleteList(listIndex);

    const headerContainer = document.createElement("div");
    headerContainer.style.display = "flex";
    headerContainer.style.justifyContent = "space-between";
    headerContainer.appendChild(listHeader);
    headerContainer.appendChild(deleteListBtn);

    listContainer.appendChild(headerContainer);

    const ul = document.createElement("ul");
    ul.classList.add("todo-items");

    list.todos.forEach((todo, todoIndex) => {
      const todoItem = document.createElement("li");
      todoItem.classList.add("todo-item");
      if (todo.completed) {
        todoItem.classList.add("completed");
      }
      todoItem.innerHTML = `
                <div>
                    <input type="checkbox" data-list="${listIndex}" data-todo="${todoIndex}" onchange="toggleComplete(${listIndex}, ${todoIndex})" ${
        todo.completed ? "checked" : ""
      }>
                    <span>${todo.task}</span>
                </div>
                <div class="edit-buttons">
                    <button onclick="editTodoPrompt(${listIndex}, ${todoIndex})">Edit</button>
                    <button onclick="deleteTodo(${listIndex}, ${todoIndex})">Delete</button>
                </div>
            `;
      ul.appendChild(todoItem);
    });

    listContainer.appendChild(ul);
    todoListsContainer.appendChild(listContainer);
  });

  deleteSelectedBtn.style.display = lists.some((list) =>
    list.todos.some((todo) => todo.completed)
  )
    ? "inline-block"
    : "none"; // Показать или скрыть кнопку удаления выбранных
}

function updateSortSelect() {
  sortSelect.innerHTML = "";
  lists.forEach((list, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = list.name;
    sortSelect.appendChild(option);
  });
}

function addTodoToList(listIndex, task) {
  if (task.trim() === "") return;

  const newTodo = {
    task,
    completed: false,
  };

  lists[listIndex].todos.push(newTodo);
  renderLists();
}

function addNewList(listName) {
  if (listName.trim() === "") return;

  const newList = {
    name: listName,
    todos: [],
  };
  lists.push(newList);
  updateSortSelect();
  renderLists();
}

function deleteSelectedTodos() {
  lists.forEach((list) => {
    list.todos = list.todos.filter((todo) => !todo.completed);
  });
  renderLists();
}

function toggleComplete(listIndex, todoIndex) {
  lists[listIndex].todos[todoIndex].completed =
    !lists[listIndex].todos[todoIndex].completed;
  renderLists();
}

function deleteTodo(listIndex, todoIndex) {
  lists[listIndex].todos.splice(todoIndex, 1);
  renderLists();
}

function editTodoPrompt(listIndex, todoIndex) {
  const newTask = prompt(
    "Enter new task description:",
    lists[listIndex].todos[todoIndex].task
  );
  if (newTask !== null) {
    lists[listIndex].todos[todoIndex].task = newTask;
    renderLists();
  }
}

function deleteList(listIndex) {
  if (confirm("Are you sure you want to delete this list?")) {
    lists.splice(listIndex, 1);
    updateSortSelect();
    renderLists();
  }
}

todoForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const task = todoInput.value.trim();
  if (task === "") return;

  const listIndex = parseInt(sortSelect.value);
  addTodoToList(listIndex, task);
  todoInput.value = "";
});

newListBtn.addEventListener("click", function () {
  const listName = prompt("Enter list name:");
  if (listName !== null) {
    addNewList(listName);
  }
});

deleteSelectedBtn.addEventListener("click", deleteSelectedTodos);

renderLists();
updateSortSelect();

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
