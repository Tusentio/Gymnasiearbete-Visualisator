let schedule;
let progressBar;
let timeLeftHeading;

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
  timeLeftHeading = document.getElementById("time-left");

  update();
  setInterval(update, 1000);
}

function update() {
  let totalTime = schedule.getTotalTime();
  let timePassed = schedule.getTimePassedUntil(new Date());
  let percentage = timePassed / totalTime * 100;
  progressBar.style.setProperty("height", `${percentage}%`);

  let timeLeft = totalTime - timePassed;
  timeLeftHeading.textContent = durationToHMSString(timeLeft);
}