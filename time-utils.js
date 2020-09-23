const MILLIS_WEEK = 6048e5;
const MILLIS_DAY = 864e5;
const MILLIS_MINUTE = 6e4;

class WeekDate {
    constructor(year, ...args) {
        this._year = year;
        this._weekYearStart = getWeekYearStart(this._year);

        if (args.length < 2) {
            this._timeSinceWeekYearStart = args[0];
        } else {
            let [week, day] = args;
            this._timeSinceWeekYearStart =
                week * MILLIS_WEEK + day * MILLIS_DAY;
        }
    }

    getYear() {
        return this._year;
    }

    getWeek() {
        return Math.floor(this._timeSinceWeekYearStart / MILLIS_WEEK) + 1;
    }

    getDay() {
        return Math.floor(
            (this._timeSinceWeekYearStart % MILLIS_WEEK) / MILLIS_DAY
        );
    }

    getDate() {
        return new Date(this._weekYearStart + this._timeSinceWeekYearStart);
    }

    static parse(string) {
        let groups = /^([0-9]{4})(-?)W(0[1-9]|[1-4][0-9]|5[0-3])\2([1-7])?$/.exec(
            string
        );
        if (!groups)
            throw new Error(
                `Ogiltigt veckodatum: ${string}. (ISO 8601 week date)`
            );

        let year = parseInt(groups[1]);
        let week = parseInt(groups[3]) - 1;
        let day = parseInt(groups[4] || "1") - 1;
        return new WeekDate(year, week, day);
    }
}

function parseTime(time) {
    let groups = /^([0-1]?[0-9]|2[0-9])(:?)([0-5][0-9])(?:\2([0-5][0-9])(?:\.([0-9]{3}))?)?$/.exec(
        time
    );
    if (!groups) throw new Error(`Ogiltigt tidsformat: ${time}.`);

    let hours = parseInt(groups[1]);
    let minutes = parseInt(groups[3]);
    let seconds = parseInt(groups[4] || "0");
    let millis = parseInt(groups[5] || "0");

    return ((hours * 60 + minutes) * 60 + seconds) * 1000 + millis;
}

// Ta reda på vilken tid ett visst veckoår börjar enlig ISO 8601
function getWeekYearStart(year) {
    let yearStartDate = new Date(`${year}-01-01T00:00:00.000Z`);
    let yearStartDay = (yearStartDate.getUTCDay() + 6) % 7; // Veckor börjar på söndag i ECMA, rotera ett snäpp

    // Jämför med torsdag (3)
    if (yearStartDay <= 3) {
        return yearStartDate.getTime() - yearStartDay * MILLIS_DAY;
    } else {
        return yearStartDate.getTime() + (7 - yearStartDay) * MILLIS_DAY;
    }
}

function durationToHMSString(duration) {
    let hours = Math.floor(duration / MILLIS_MINUTE / 60);
    let minutes = Math.floor(duration / MILLIS_MINUTE) % 60;
    let seconds = Math.floor((duration / MILLIS_MINUTE) * 60) % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
}
