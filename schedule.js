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

  renderOccasions() {
    let firstWeekStart = this.fromInclusive.getDate().getTime() - this.fromInclusive.getDay() * MILLIS_DAY;
    let toInclusive = this.toInclusive.getDate().getTime();

    let renderedOccasions = [];

    for (let occasion of this.occasions) {
      // Börja på den första möjliga dagen för det här tillfället och testa för varje vecka, samma dag fram tills "toInclusive"
      for (let time = firstWeekStart + occasion.day * MILLIS_DAY; time <= toInclusive; time += MILLIS_WEEK) {
        if (
          this.exclusions.find(e => e.getDate().getTime() == time) || // Kolla om datumet är exkluderat
          time < this.fromInclusive.getDate().getTime() // eller om datumet är innan "frånOchMed"
        ) continue; // i sådana fall, rendera inte det här tillfället

        renderedOccasions.push({
          start: time + occasion.startTime,
          end: time + occasion.endTime
        });
      }
    }

    // Sortera efter starttid
    renderedOccasions = renderedOccasions.sort((a, b) => a.start - b.start);

    return renderedOccasions;
  }

  getTimePassedUntil(date, removeTimezoneOffset = true) {
    let toInclusive = date.getTime();
    if (removeTimezoneOffset)
      toInclusive -= date.getTimezoneOffset() * MILLIS_MINUTE;
    toInclusive = Math.min(toInclusive, this.toInclusive.getDate().getTime()); // Begränsa sluttiden till det inklusiva maximat ("tillOchMed")

    // Beräkna tiden av 00:00 på den senaste föregående måndagen till datumet i "frånOchMed"
    let firstWeekStart = this.fromInclusive.getDate().getTime() - this.fromInclusive.getDay() * MILLIS_DAY;

    // Beräkna den totala passerade för alla tillfällen i schemat
    // mellan datumet i "frånOchMed" och den angivna tiden "date"
    let sum = 0;
    for (let occasion of this.renderOccasions()) {
      if (toInclusive < occasion.start) break;
      let duration = Math.min(toInclusive, occasion.end) - occasion.start;
      sum += duration;
    }

    return sum;
  }
}