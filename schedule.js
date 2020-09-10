class Schedule {
  constructor(options) {
    this.fromInclusive = WeekDate.parse(options["frånOchMed"]);
    this.toInclusive = WeekDate.parse(options["tillOchMed"]);
    this.exclusions = options["exkludera"].map(WeekDate.parse);
    this.currentSession = null;

    this.occasions = options["tillfällen"].map(occasion => ({
      day: ["måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag", "söndag"].findIndex(e => e === occasion["veckodag"].toLowerCase()),
      startTime: parseTime(occasion["starttid"]),
      endTime: parseTime(occasion["sluttid"])
    }));
  }

  getTotalTime() {
    return this.getTimePassedUntil(this.toInclusive.getDate(), false);
  }

  getTimePassedUntil(date, removeTimezoneOffset = true) {
    let now = date.getTime();
    if (removeTimezoneOffset)
      now -= date.getTimezoneOffset() * MILLIS_MINUTE;
    now = Math.min(now, this.toInclusive.getDate().getTime()); // Begränsa sluttiden till det inklusiva maximat ("tillOchMed")

    // Beräkna tiden av 00:00 på den senaste föregående måndagen till datumet i "frånOchMed"
    let firstWeekStart = this.fromInclusive.getDate().getTime() - this.fromInclusive.getDay() * MILLIS_DAY;

    // Beräkna den totala passerade för alla tillfällen i schemat
    // mellan datumet i "frånOchMed" och den angivna tiden "date"
    let sum = 0;
    this.occasions.forEach(occasion => {
      let standardDuration = occasion.endTime - occasion.startTime;

      // Börja på den första möjliga dagen för det här tillfället och testa för varje vecka samma dag fram tills "now"
      for (let time = firstWeekStart + occasion.day * MILLIS_DAY; time <= now; time += MILLIS_WEEK) {
        if (
          this.exclusions.find(e => e.getDate().getTime() == time) || // Kolla om datumet är exkluderat
          time < this.fromInclusive.getDate().getTime() // Kolla om datumet är innan "frånOchMed"
        ) continue;

        // Plussa den tid som gått av tillfället (eller allt om det redan passerats)
        sum += Math.max(Math.min(standardDuration, now - time - occasion.startTime), 0);
      }
    });

    return sum;
  }
}