let schedule;
let progressBar;

function init() {
  if (!schedule) {
    let scheduleReq = new XMLHttpRequest();
    scheduleReq.addEventListener("load", () => {
      schedule = new Schedule(JSON.parse(scheduleReq.responseText));
      init();
    });
    scheduleReq.open("GET", "schema.json");
    scheduleReq.send();
    return;
  }

  progressBar = document.getElementById("empty-space");

  update();
  setInterval(update, MILLIS_MINUTE);
}

function update() {
  let totalTime = schedule.getTotalTime();
  let timePassed = schedule.getTimePassedUntil(new Date());
  let percentage = timePassed / totalTime * 100;
  progressBar.style.setProperty("height", `${percentage}%`);
}