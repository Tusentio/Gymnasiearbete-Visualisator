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

    generateTimeMarks();

    update();
    setInterval(update, 1000);
}

function generateTimeMarks() {
    let timeMarksList = document.getElementById("time-marks-list");

    let totalTime = schedule.getTotalTime();
    let renderedOccasions = schedule.renderOccasions();

    renderedOccasions.pop();
    renderedOccasions.forEach((occation) => {
        let mark = document.createElement("li");

        let duration = occation.end - occation.start;
        let durationPercentage = (duration / totalTime) * 100;
        mark.style.setProperty("height", `${durationPercentage}%`);

        timeMarksList.appendChild(mark);
    });
}

function update() {
    let totalTime = schedule.getTotalTime();
    let timePassed = schedule.getTimePassedUntil(new Date());
    let percentage = (timePassed / totalTime) * 100;
    progressBar.style.setProperty("height", `${percentage}%`);

    let timeLeft = totalTime - timePassed;
    timeLeftHeading.textContent = durationToHMSString(timeLeft);
}
