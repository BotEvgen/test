class TodoList {
  constructor() {
    this.tasks = new Map();
    this.current_id = 0;
  }

  addTask(task) {
    task.id = this.current_id;
    this.tasks.set(this.current_id, task);
    this.current_id += 1;
    return task;
  }

  complete_task(task_id) {
    const task = this.tasks.get(parseInt(task_id));
    task.completed = true;
  }

  uncomplete_task(task_id) {
    const task = this.tasks.get(parseInt(task_id));
    task.completed = false;
  }

  edit_task(task_id, description) {
    const task = this.tasks.get(parseInt(task_id));
    task.description = description;
  }

  get_task(task_id) {
    return this.tasks.get(task_id);
  }

  add_task(task) {
    return this.addTask(task);
  }

  remove_task(task_id) {
    return this.tasks.delete(parseInt(task_id));
  }

  all_tasks() {
    return this.tasks.values();
  }

  print_all() {
    for (let task of this.tasks) {
      console.log(task);
    }
  }
}

class TodoFilter {
  constructor() {
    this.filter = "";
  }

  allFilter() {
    this.filter = "all";
  }

  activeFilter() {
    this.filter = "active";
  }

  completedFilter() {
    this.filter = "completed";
  }
}

const todoList = new TodoList();
const todoFilter = new TodoFilter();

const tasks = [
  { description: "create todo list", completed: false },
  { description: "add filtering by priority", completed: false },
  { description: "use rest api backend", completed: false },
];

tasks.forEach((task) => {
  todoList.addTask(task);
});

function isTaskCompleted(task_id) {
  const task = todoList.get_task(task_id);
  return task.completed;
}

function checkedProperty(task_id) {
  if (isTaskCompleted(task_id)) {
    return 'checked="true"';
  } else {
    return "";
  }
}

function remove() {
  const id = this.getAttribute("id");

  todoList.remove_task(id);
  showTaskList();
  return false;
}

function changeLabel() {
  const id = this.getAttribute("id");
  $('label[id="' + id + '"]').hide();
  $('.edit-input[id="' + id + '"]')
    .show()
    .focus();

  return false;
}

function labelChanged() {
  const id = this.getAttribute("id"),
    description = $(".edit-input[id=" + id + "]").val();

  todoList.edit_task(id, description);
  showTaskList();
  return false;
}

function taskList() {
  let html = "";
  for (let todo of todoList.all_tasks()) {
    const checked = checkedProperty(todo.id);
    html += `<div class="input-group style">
                    <span class="input-group">
                        <input type="checkbox" id="${todo.id}" ${checked}>
                            <label for="checkbox" id="${todo.id}" class="edit">${todo.description}</label>
                        <input class="edit-input" id="${todo.id}"/>
                    </span>
                    <span class="input-group-btn">
                        <button aria-label="Close" class="close remove" id="${todo.id}">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </span>
                </div>`;
  }

  document.getElementById("todos").innerHTML = html;

  const buttons = document.getElementsByClassName("remove");
  const edit = document.getElementsByClassName("edit");
  const edit_inputs = document.getElementsByClassName("edit-input");
  //   const checkboxes = $("input[type=checkbox]");

  //   for (let i = 0; i < checkboxes.length; i++) {
  //     checkboxes[i].addEventListener(
  //       "click",
  //       changeStatus(+checkboxes[i].getAttribute("id"))
  //     );
  //   }

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", remove);
  }

  for (let i = 0; i < edit.length; i++) {
    edit[i].addEventListener("dblclick", changeLabel);
    edit[i].addEventListener("touchmove", changeLabel);
  }

  for (let i = 0; i < edit_inputs.length; i++) {
    edit_inputs[i].addEventListener("focusout", labelChanged);
  }
}

showTaskList();

function filterByAll() {
  todoFilter.allFilter();
  const inputs = $("input[type=checkbox]");
  $("#allFilter").addClass("active");
  $("#completedFilter").removeClass("active");
  $("#activeFilter").removeClass("active");
  return inputs.parents().show();
}

document
  .querySelector("#allFilter")
  .addEventListener("click", filterByAll, false);

function filterByActive() {
  todoFilter.activeFilter();

  let $inputs = $("div input[type=checkbox]"),
    $inputsCh = $inputs.filter(":checked"),
    $inputsNotCh = $inputs.filter(":not(:checked)");

  const $parentInputs = $inputsCh.parents(".input-group");

  $("#activeFilter").addClass("active");
  $("#allFilter").removeClass("active");
  $("#completedFilter").removeClass("active");

  return $parentInputs.hide(), $inputsNotCh.parents().show();
}

document
  .querySelector("#activeFilter")
  .addEventListener("click", filterByActive, false);

function filterByCompleted() {
  todoFilter.completedFilter();

  let $inputs = $("div input[type=checkbox]"),
    $inputsCh = $inputs.filter(":checked"),
    $inputsNotCh = $inputs.filter(":not(:checked)");

  const $parentInputs = $inputsNotCh.parents(".input-group");

  $("#completedFilter").addClass("active");
  $("#allFilter").removeClass("active");
  $("#activeFilter").removeClass("active");

  return $parentInputs.hide(), $inputsCh.parents().show();
}

document
  .querySelector("#completedFilter")
  .addEventListener("click", filterByCompleted, false);

function filterTasksBy() {
  switch (todoFilter.filter) {
    case "all": {
      filterByAll();
      break;
    }
    case "active": {
      filterByActive();
      break;
    }
    case "completed": {
      filterByCompleted();
      break;
    }
    default:
      break;
  }
}

function calculateCounter() {
  const $counter = $("#counter"),
    $inputs = $("input[type=checkbox]"),
    $inputsCh = $inputs.filter(":checked"),
    informationText = $inputs.length - $inputsCh.length;
  $counter.html(informationText);
}

function showTaskList() {
  filterTasksBy(activeFilter);
  taskList();
  calculateCounter();
}

function add(e) {
  e.preventDefault();
  const description = document.getElementById("task").value;
  if (description) {
    todoList.add_task({ description: description, completed: false });
    document.getElementById("task").value = "";
    showTaskList();
  }
  return true;
}

document.getElementById("add").addEventListener("click", (e) => add(e));

function changeStatus(task_id) {
  const task = todoList.get_task(task_id);
  if (task.completed) {
    todoList.uncomplete_task(task_id);
  } else {
    todoList.complete_task(task_id);
  }
  showTaskList();
}

function selectAll() {
  const inputs = $("input[type=checkbox]");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].checked = true;
    todoList.complete_task(inputs[i].id);
  }
  showTaskList();
}

document
  .querySelector("#selectAll")
  .addEventListener("click", selectAll, false);

function deselectAll() {
  const inputs = $("input[type=checkbox]");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].checked = false;
    todoList.uncomplete_task(inputs[i].id);
  }
  showTaskList();
}

document
  .querySelector("#deselectAll")
  .addEventListener("click", deselectAll, false);

function completedRemove() {
  const inputs = $("input[type=checkbox]");
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].checked == true) {
      todoList.remove_task(inputs[i].id);
    }
  }
  showTaskList();
}

document
  .querySelector("#completedRemove")
  .addEventListener("click", completedRemove, false);
