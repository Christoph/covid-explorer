import { computedFrom } from 'aurelia-framework';

export class covid {
  // https://www.sozialministerium.at/Informationen-zum-Coronavirus/Coronavirus---Haeufig-gestellte-Fragen/Coronavirus---H%C3%A4ufig-gestellte-Fragen---Ma%C3%9Fnahmen-in-Oesterreich.html
  available_beds = 2547
  people = 1910497

  hospital_factor = 100
  person_factor = 5000

  person_symbols = Math.ceil(this.people / this.person_factor)

  tests_per_week = 23000
  tests_month = this.tests_per_week * 4

  rangeValue = 10;
  percent = 0;

  sim = new Map();
  reductions;
  selectedRed;
  activeSim;

  constructor() {
    let t10 = new Map();
    t10.set('März', {
      infected: 28435,
      critical: 484,
      hospital: 1939,
      recovered: 537,
    });
    t10.set('April', {
      infected: 95934,
      critical: 2173,
      hospital: 7453,
      recovered: 3727,
    });
    t10.set('Mai', {
      infected: 232218,
      critical: 4608,
      hospital: 17194,
      recovered: 8844
    });
    t10.set('Juni', {
      infected: 498970,
      critical: 9145,
      hospital: 37340,
      recovered: 19844
    });

    let t30 = new Map();
    t30.set('März', {
      infected: 24328,
      critical: 451,
      hospital: 1533,
      recovered: 539,
    });
    t30.set('April', {
      infected: 37637,
      critical: 718,
      hospital: 2866,
      recovered: 2158,
    });
    t30.set('Mai', {
      infected: 27864,
      critical: 385,
      hospital: 1930,
      recovered: 1560
    });
    t30.set('Juni', {
      infected: 13652,
      critical: 268,
      hospital: 1182,
      recovered: 820
    });

    let t60 = new Map();
    t60.set('März', {
      infected: 20862,
      critical: 422,
      hospital: 1620,
      recovered: 543
    });
    t60.set('April', {
      infected: 14166,
      critical: 350,
      hospital: 1154,
      recovered: 1233,
    });
    t60.set('Mai', {
      infected: 2907,
      critical: 26,
      hospital: 171,
      recovered: 242
    });
    t60.set('Juni', {
      infected: 143,
      critical: 0,
      hospital: 32,
      recovered: 30
    });

    this.sim.set("10", t10)
    this.sim.set("30", t30)
    this.sim.set("60", t60)

    this.activeSim = this.sim.get("10")
  }

  death_rate = 3
  death_factor = 100
  computeDeathRate(month, activeSim) {
    let missing_beds = Math.max(0, this.activeSim.get(month).critical + this.activeSim.get(month).hospital - this.available_beds)

    return Math.ceil(missing_beds * (this.death_rate / 100) / this.death_factor)
  }

  computeMissingBeds(month, activeSim) {
    return Math.ceil(Math.max(0, this.activeSim.get(month).critical + this.activeSim.get(month).hospital - this.available_beds) / this.hospital_factor)
  }

  computeUsedBeds(month, activeSim) {
    if (this.activeSim.get(month).critical + this.activeSim.get(month).hospital > this.available_beds) return Math.round(this.available_beds / this.hospital_factor)
    else return Math.round((this.activeSim.get(month).critical + this.activeSim.get(month).hospital) / this.hospital_factor)
  }

  computeFreeBeds(month, activeSim) {
    return Math.ceil(Math.max(0, this.available_beds - this.activeSim.get(month).critical - this.activeSim.get(month).hospital) / this.hospital_factor)
  }


  computeCritical(month, activeSim) {
    return Math.ceil(this.activeSim.get(month).critical / this.person_factor)
  }

  computeCriticalNumber(month, activeSim) {
    return Math.max(0, this.activeSim.get(month).critical + this.activeSim.get(month).hospital - this.available_beds)
  }

  computeCovered(month, activeSim) {
    if (this.activeSim.get(month).critical + this.activeSim.get(month).hospital > this.available_beds) return Math.ceil(this.available_beds / (this.person_factor / 2))
    else return Math.ceil((this.activeSim.get(month).critical + this.activeSim.get(month).hospital) / (this.person_factor / 2))
  }

  computeCoveredNumber(month, activeSim) {
    if (this.activeSim.get(month).critical + this.activeSim.get(month).hospital > this.available_beds) return this.available_beds
    else return this.activeSim.get(month).critical + this.activeSim.get(month).hospital
  }

  computeFree(month, activeSim) {
    return Math.ceil(Math.max(0, this.available_beds - this.activeSim.get(month).critical - this.activeSim.get(month).hospital) / (this.person_factor / 2))
  }

  computeFreeNumber(month, activeSim) {
    return Math.max(0, this.available_beds - this.activeSim.get(month).critical - this.activeSim.get(month).hospital)
  }

  computeInfected(month, activeSim) {
    return Math.ceil((this.activeSim.get(month).infected - this.activeSim.get(month).critical) / this.person_factor)
  }
  computeHealthy(month, activeSim) {
    return Math.ceil((this.people - this.activeSim.get(month).infected - this.activeSim.get(month).recovered) / this.person_factor)
  }
  computeRecovered(month, activeSim) {
    return Math.ceil(this.activeSim.get(month).recovered / this.person_factor)
  }

  compute_Risk(month, activeSim) {
    return 9 * this.activeSim.get(month).infected / this.people
  }

  onChange() {
    this.activeSim = this.activeSim
  }
  onChangeBeds() {
    let temp = this.activeSim
    this.activeSim = null
    this.activeSim = temp
  }
}