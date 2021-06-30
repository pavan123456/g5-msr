const _ = require('lodash')

class AvailableReports {
  constructor () {
    this.startYear = 2020
    this.startMonth = 7
    this.startQuarter = this.getQuarter(this.startMonth)
    this.date = new Date()
    this.currentYear = this.date.getFullYear()
    this.currentMonth = this.date.getMonth() + 1
    this.currentQuarter = this.getQuarter(this.currentMonth)
  }

  getQuarter (month) {
    return (Math.ceil(month / 3))
  }

  getQuartersByYear (year) {
    const startQuarter = year === this.startYear ? this.startQuarter : 1
    const endQuarter = year === this.currentYear ? this.currentQuarter : 4
    const range = _.range(startQuarter, endQuarter + 1)
    return Array.from(range, val => `Q${val}`)
  }

  getMonthsByYear (year) {
    const startMonth = year === this.startYear ? this.startMonth : 1
    const endMonth = year === this.currentYear ? this.currentMonth : 12
    return _.range(startMonth, endMonth + 1)
  }

  display () {
    const years = _.range(this.startYear, this.currentYear + 1)
    return years.reduce((acc, year) => {
      acc[year] = {
        quarters: this.getQuartersByYear(year),
        months: this.getMonthsByYear(year)
      }
      return acc
    }, {})
  }
}

module.exports = AvailableReports
