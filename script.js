window.onload = function () {
  generateCalender();
  renderEvent();
};

function generateCalender() {
  const calender = document.getElementById("calender");
  const currentDate = new Date();
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const firstDayOfWeek = firstDayOfMonth.getDay();
  const totalDays = lastDayOfMonth.getDate();

  for (let i = 0; i < firstDayOfWeek; i++) {
    let blankDay = document.createElement("div");
    calender.appendChild(blankDay);
  }

  for (let day = 1; day <= totalDays; day++) {
    let daySquare = document.createElement("div");
    daySquare.className = "calender-day";
    daySquare.textContent = day;
    daySquare.id = `day-${day}`;
    calender.appendChild(daySquare);
  }
}

function showAddTaskModal() {
  document.getElementById("addTaskModal").style.display = "block";
}

function closeAddTaskModal() {
  document.getElementById("addTaskModal").style.display = "none";
}

function deleteTask(taskElement) {
  if (confirm("Are you sure you want to delete this task?")) {
    console.log(taskElement);
    taskElement.parentNode.removeChild(taskElement);
  }
}

function editTask(taskElement) {
  const newTaskDesc = prompt("Edit your task:", taskElement.textContent);
  if (newTaskDesc !== null && newTaskDesc.trim() !== "") {
    taskElement.textContent = newTaskDesc;
  }
}

function addTask() {
  const taskDate = new Date(document.getElementById("task-date").value);
  const taskDesc = document.getElementById("task-desc").value.trim();

  if (taskDesc && !isNaN(taskDate.getDate())) {
    const calenderDays = document.getElementById("calender").children;

    for (let i = 0; i < calenderDays.length; i++) {
      const day = calenderDays[i];
      if (parseInt(day.textContent) === taskDate.getDate()) {
        const taskElement = document.createElement("div");
        taskElement.className = "task";
        taskElement.textContent = taskDesc;
        console.log(taskElement);
        taskElement.addEventListener("contextmenu", function (event) {
          event.preventDefault();
          deleteTask(taskElement);
        });

        taskElement.addEventListener("click", function () {
          editTask(taskElement);
        });

        day.appendChild(taskElement);
        break;
      }
    }
    addEvent(taskDate.getDay(), taskDate, taskDesc);
    closeAddTaskModal();
  } else {
    alert("Please enter a valid date and task description!");
  }
}

function addEvent(heading, date, task) {
  let events = getEvents();

  if (!events[heading]) {
    events[heading] = [
      {
        heading: heading,
        content: task,
        creationDate: date,
      },
    ];
  } else {
    events[heading].push({
      heading: heading,
      content: task,
      creationDate: date,
    });
  }

  saveEvents(events);
}

function renderEvent() {
    //Get Events 
  const eventsList = getEvents();
  let dayEvent = [];

  //Save Day Events in an Array
  Object.keys(eventsList).forEach((event, index) => {
    dayEvent.push(eventsList[event]);
  });
  for (let i = 0; i < dayEvent.length; i++) {
    for (j = 0; j < dayEvent[i].length; j++) {
      const taskDate = new Date(dayEvent[i][j].creationDate);
      const taskDesc = dayEvent[i][j].content;

      if (taskDesc && !isNaN(taskDate.getDate())) {
        const calenderDays = document.getElementById("calender").children;

        for (let i = 0; i < calenderDays.length; i++) {
          const day = calenderDays[i];
          if (parseInt(day.textContent) === taskDate.getDate()) {
            const taskElement = document.createElement("div");
            taskElement.className = "task";
            taskElement.textContent = taskDesc;
            console.log(taskElement);
            taskElement.addEventListener("contextmenu", function (event) {
              event.preventDefault();
              deleteTask(taskElement);
            });

            taskElement.addEventListener("click", function () {
              editTask(taskElement);
            });

            day.appendChild(taskElement);
            break;
          }
        }
      }
    }
  }
}

function saveEvents(events) {
  localStorage.setItem("events", JSON.stringify(events));
}

function getEvents() {
  return JSON.parse(localStorage.getItem("events")) || {};
}
