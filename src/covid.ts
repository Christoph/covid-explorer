export class covid {
  // https://www.sozialministerium.at/Informationen-zum-Coronavirus/Coronavirus---Haeufig-gestellte-Fragen/Coronavirus---H%C3%A4ufig-gestellte-Fragen---Ma%C3%9Fnahmen-in-Oesterreich.html
  hospital_beds = 2547
  average_usage_of_beds = 0.82
  available_beds = Math.round(this.hospital_beds * this.average_usage_of_beds)

  tests_per_week = 23000
  tests_month = this.tests_per_week * 4

  people = 1910497

  sim = {
    "10": {
      march_infected: 30184,
      april_infected: 134520,
      may_infected: 385406,
      march_critical: 521,
      april_critical: 2608,
      may_critical: 7321,
      march_hospital: 1924,
      april_hospital: 9743,
      may_hospital: 28475,
      march_recovered: 537,
      april_recovered: 3727,
      may_recovered: 8844
    },
    "30": {
      march_infected: 24328,
      april_infected: 37637,
      may_infected: 27864,
      march_critical: 451,
      april_critical: 718,
      may_critical: 385,
      march_hospital: 1533,
      april_hospital: 2866,
      may_hospital: 1930,
      march_recovered: 539,
      april_recovered: 2158,
      may_recovered: 1560
    }
  }


  hospital_factor = 50
  computeMissingBeds(critical, hospital) {
    return Math.round(Math.max(0, critical + hospital - this.available_beds) / this.hospital_factor)
  }

  computeUsedBeds(critical, hospital) {
    if (critical + hospital > this.available_beds) return Math.round(this.available_beds / this.hospital_factor)
    else return Math.round((critical + hospital) / this.hospital_factor)
  }

  computeFreeBeds(critical, hospital) {
    return Math.round(Math.max(0, this.available_beds - critical - hospital) / this.hospital_factor)
  }

  person_factor = 2000
  person_symbols = Math.ceil(this.people / this.person_factor)

  computeCritical(critical, hospital) {
    return Math.ceil(Math.max(0, critical + hospital - this.available_beds) / this.person_factor)
  }

  computeCriticalNumber(critical, hospital) {
    return Math.max(0, critical + hospital - this.available_beds)
  }

  computeCovered(critical, hospital) {
    if (critical + hospital > this.available_beds) return Math.ceil(this.available_beds / (this.person_factor / 2))
    else return Math.ceil((critical + hospital) / (this.person_factor / 2))
  }

  computeCoveredNumber(critical, hospital) {
    if (critical + hospital > this.available_beds) return this.available_beds
    else return critical + hospital
  }

  computeFree(critical, hospital) {
    return Math.ceil(Math.max(0, this.available_beds - critical - hospital) / (this.person_factor / 2))
  }

  computeFreeNumber(critical, hospital) {
    return Math.max(0, this.available_beds - critical - hospital)
  }

  computeInfected(infected, critical) {
    return Math.ceil((infected - critical) / this.person_factor)
  }
  computeHealthy(infected, recovered) {
    return Math.ceil((this.people - infected - recovered) / this.person_factor)
  }
  computeRecovered(recovered) {
    return Math.ceil(recovered / this.person_factor)
  }

  compute_Risk(infected) {
    return 9 * infected / this.people
  }

  activeSim = this.sim["10"]

  rangeValue = 10;
  percent = 0;

  onChange() {
    this.activeSim = this.sim[this.rangeValue]
  }
  onChangeBeds() {
    this.available_beds = Math.round(this.hospital_beds * this.average_usage_of_beds)
    this.activeSim = this.sim["30"]
    this.activeSim = this.sim[this.rangeValue]
  }
}