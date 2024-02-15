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

function deleteTask(taskElement, taskIndex, dayIndex) {
  if (confirm("Are you sure you want to delete this task?")) {
    //Get All Events
  const Events = getEvents();
  const h = [];
  
  //Check if task is there
  if(Events[dayIndex][taskIndex]){
      //delete task from array
      Events[dayIndex].splice(taskIndex, 1);
      taskElement.parentNode.removeChild(taskElement);
      console.log(Events[dayIndex].toString());
      if (Events[dayIndex].toString() == ""){
        delete Events[dayIndex];
      }
      saveEvents(Events);
      window.location = 'index.html';
  }
  else{
    alert("Task Not Found!")
  }
  }
}

function editTask(taskElement, taskIndex, dayIndex) {
  //Get All Events
  const Events = getEvents();

  //Get the task being edited
  let task = Events[dayIndex][taskIndex];
  console.log(taskIndex);

  //Get the new Text Content
  const newTaskDesc = prompt("Edit your task:", taskElement.textContent);

  if (newTaskDesc !== null && newTaskDesc.trim() !== "") {
    //Change the old task content
    task.content = newTaskDesc;
    //Update the Array
    Events[dayIndex][taskIndex] = task;
    saveEvents(Events);
    taskElement.textContent = newTaskDesc;
  }
}

function addEvent() {
  let events = getEvents();
  const taskDate = new Date(document.getElementById("task-date").value);
  const taskDesc = document.getElementById("task-desc").value.trim();
  if (taskDesc && !isNaN(taskDate.getDate())) {
    if (!events[taskDate.getDate()]) {
      events[taskDate.getDate()] = [
        {
          heading: taskDate.getDate(),
          content: taskDesc,
          creationDate: taskDate,
        },
      ];
    } else {
      events[taskDate.getDate()].push({
        heading: taskDate.getDate(),
        content: taskDesc,
        creationDate: taskDate,
      });
    }
    closeAddTaskModal();
    saveEvents(events);
    window.location = "index.html";
  } else {
    alert("Please enter a valid date and task description!");
  }
}

function renderEvent() {
  //Get Events
  const eventsList = getEvents();

  //Loop through each Day with events
  Object.keys(eventsList).forEach((Event, index) => {
    //Loop Through each event
    for (let i = 0; i < eventsList[Event].length; i++) {
      const taskDate = new Date(eventsList[Event][i].creationDate);
      const taskDesc = eventsList[Event][i].content;

      // check if event is not null
      if (taskDesc && !isNaN(taskDate.getDate())) {
        const calenderDays = document.getElementById("calender").children;

        //loop through calender days and append tasks at appropriate days
        for (let j = 0; j < calenderDays.length; j++) {
          const day = calenderDays[j];

          //check if date on task is equal to calender date
          if (parseInt(day.textContent) === taskDate.getDate()) {
            const taskElement = document.createElement("div");
            taskElement.className = "task";
            taskElement.textContent = taskDesc;
            taskElement.dataset.index = index;
            taskElement.addEventListener("contextmenu", function (event) {
              event.preventDefault();
              deleteTask(taskElement, i, Event);

            });

            taskElement.addEventListener("click", function () {
              editTask(taskElement, i, Event);
            });

            if (day.textContent === taskElement.textContent) {
              break;
            } else {
              day.appendChild(taskElement);
            }
          }
        }
      }
    }
  });
}

function saveEvents(events) {
  localStorage.setItem("events", JSON.stringify(events));
}

function getEvents() {
  return JSON.parse(localStorage.getItem("events")) || {};
}
