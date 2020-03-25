import { computedFrom } from 'aurelia-framework';

export class covid {
  // https://www.sozialministerium.at/Informationen-zum-Coronavirus/Coronavirus---Haeufig-gestellte-Fragen/Coronavirus---H%C3%A4ufig-gestellte-Fragen---Ma%C3%9Fnahmen-in-Oesterreich.html
  available_beds = 2547
  people = 1910497

  hospital_factor = 1000
  person_factor = 2000

  person_symbols = Math.ceil(this.people / this.person_factor)

  tests_per_week = 23000
  tests_month = this.tests_per_week * 4

  rangeValue = 10;
  percent = 0;

  sim = {
    "10": {
      march: {
        infected: 30184,
        critical: 521,
        hospital: 1924,
        recovered: 537,
      },
      april: {
        infected: 134520,
        critical: 2608,
        hospital: 9743,
        recovered: 3727,
      },
      may: {
        infected: 385406,
        critical: 7321,
        hospital: 28475,
        recovered: 8844
      }
    },
    "30": {
      march: {
        infected: 24328,
        critical: 451,
        hospital: 1533,
        recovered: 539,
      },
      april: {
        infected: 37637,
        critical: 718,
        hospital: 2866,
        recovered: 2158,
      },
      may: {
        infected: 27864,
        critical: 385,
        hospital: 1930,
        recovered: 1560
      }
    }
  }

  reductions = Object.keys(this.sim)
  selectedRed = this.reductions[0];
  activeSim = this.sim["10"]

  death_rate = 3
  death_factor = 100
  computeDeathRate(month, activeSim) {
    let missing_beds = Math.max(0, this.activeSim[month].critical + this.activeSim[month].hospital - this.available_beds)

    return Math.ceil(missing_beds * (this.death_rate / 100) / this.death_factor)
  }

  computeMissingBeds(month, activeSim) {
    return Math.ceil(Math.max(0, this.activeSim[month].critical + this.activeSim[month].hospital - this.available_beds) / this.hospital_factor)
  }

  computeUsedBeds(month, activeSim) {
    if (this.activeSim[month].critical + this.activeSim[month].hospital > this.available_beds) return Math.round(this.available_beds / this.hospital_factor)
    else return Math.round((this.activeSim[month].critical + this.activeSim[month].hospital) / this.hospital_factor)
  }

  computeFreeBeds(month, activeSim) {
    return Math.ceil(Math.max(0, this.available_beds - this.activeSim[month].critical - this.activeSim[month].hospital) / this.hospital_factor)
  }


  computeCritical(month, activeSim) {
    return Math.ceil(Math.max(0, this.activeSim[month].critical + this.activeSim[month].hospital - this.available_beds) / this.person_factor)
  }

  computeCriticalNumber(month, activeSim) {
    return Math.max(0, this.activeSim[month].critical + this.activeSim[month].hospital - this.available_beds)
  }

  computeCovered(month, activeSim) {
    if (this.activeSim[month].critical + this.activeSim[month].hospital > this.available_beds) return Math.ceil(this.available_beds / (this.person_factor / 2))
    else return Math.ceil((this.activeSim[month].critical + this.activeSim[month].hospital) / (this.person_factor / 2))
  }

  computeCoveredNumber(month, activeSim) {
    if (this.activeSim[month].critical + this.activeSim[month].hospital > this.available_beds) return this.available_beds
    else return this.activeSim[month].critical + this.activeSim[month].hospital
  }

  computeFree(month, activeSim) {
    return Math.ceil(Math.max(0, this.available_beds - this.activeSim[month].critical - this.activeSim[month].hospital) / (this.person_factor / 2))
  }

  computeFreeNumber(month, activeSim) {
    return Math.max(0, this.available_beds - this.activeSim[month].critical - this.activeSim[month].hospital)
  }

  computeInfected(month, activeSim) {
    return Math.ceil((this.activeSim[month].infected - this.activeSim[month].critical) / this.person_factor)
  }
  computeHealthy(month, activeSim) {
    return Math.ceil((this.people - this.activeSim[month].infected - this.activeSim[month].recovered) / this.person_factor)
  }
  computeRecovered(month, activeSim) {
    return Math.ceil(this.activeSim[month].recovered / this.person_factor)
  }

  compute_Risk(month, activeSim) {
    return 9 * this.activeSim[month].infected / this.people
  }

  onChange() {
    this.activeSim = this.sim[this.rangeValue]
  }
  onChangeBeds() {
    this.activeSim = null
    this.activeSim = this.sim[this.rangeValue]
  }
}