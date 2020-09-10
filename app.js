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

  progressBar = document.getElementById("progress-bar");

  update();
  setInterval(update, MILLIS_MINUTE);
}

function update() {
  let totalTime = schedule.getTotalTime();
  let timeLeft = totalTime - schedule.getTimePassedUntil(new Date());
  let percentage = timeLeft / totalTime * 100;
  progressBar.style.setProperty("height", `${percentage}%`);
}