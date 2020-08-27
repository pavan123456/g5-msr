// const notesService = require('./noteService')
const notesService = require('./annotationService')
class ServicesReport {
  constructor(to, from, clientUrn, workQ) {
    this.t0 = null
    this.t1 = null
    this.categories  = []
    this.to = to
    this.from = from
    this.clientUrn = clientUrn
    this.notes = []
    this.cases = []
    this.workQ = workQ

    this.DA = {
      name: 'Digital Advertising',
      category: { Optimizations: 0 },
      subCategory: {},
      timeline: {}
    }
    this.SEO = {
      name: 'SEO',
      category: {},
      subCategory: {},
      timeline: {}
    }
    this.CC = {
      name: 'Customer Care',
      category: {},
      subCategory: {},
      timeline: {}
    }

    this.daSubCatMap = {
      CountLocationExtensionRule: "Updated Call Extension",
      PhoneRule: "Updated Call Extension",
      CountLocationCallExtensionRule: "Updated Call Extension",
      UrlRule: "URL Change"
    }
    this.overview = []
    this.teams = []
  }

  /**
   * Returns Object with formatted report
   *
   * @returns
   * @memberof ServicesReport
   */
  display() {
    this.formatReport()
    const now = new Date()
    return {
      time: `${(now.getTime() - this.t0)} milliseconds`,
      overview: this.overview,
      teams: this.teams,
      notes: this.notes,
    }
  }

  /**
   * Fetch all report data and generate categorties
   *
   * @returns
   * @memberof ServicesReport
   */
  async generate() {
    const now = new Date()
    this.t0 = now.getTime()
    await this.getCategories()
    this.setOverviewCategories()
    // const workQ = this.getWorkQ()
    const notes = this.getNotes()
    const cases = this.getCases()
    return Promise.all([notes, cases])
      .then(() => {
        this.groupWorkQ()
        this.groupNotes()
        this.groupCases()
      })
  }

  /**
   * Get all notes from the note service
   *
   * @memberof ServicesReport
   */
  async getNotes() {
    const { data: notes } = await notesService.getNotes(this.clientUrn, this.to, this.from)
    this.notes = notes
  }

  /**
   * Get all cases from the note service
   *
   * @memberof ServicesReport
   */
  async getCases() {
    const { data: cases } = await notesService.getCases(this.clientUrn, this.to, this.from)
    this.cases = cases
  }

  /**
   * Get all completed workq items from the DAM
   *
   * @memberof ServicesReport
   */
  async getWorkQ() {
    const { data: workQ } = await notesService.getWorkQ(this.clientUrn, this.to, this.from)
    this.workQ = workQ
  }

  /**
   * Group the notes by category, subcategory and team
   *
   * @memberof ServicesReport
   */
  groupNotes() {
    this.notes.forEach((note) => {
      const { annotationCategory, annotationType } = note
      if (!this[note.team.name].category[annotationCategory.value]) {
        this[note.team.name].category[annotationCategory.value] = 0
        this[note.team.name].timeline[annotationCategory.value] = []
      }
      if (!this[note.team.name].timeline[annotationCategory.value]) {
        this[note.team.name].timeline[annotationCategory.value] = []
      }

      this[note.team.name].category[annotationCategory.value]++
      if (!this[note.team.name].subCategory[annotationType]) {
        this[note.team.name].subCategory[annotationType] = {
          count : 0,
          category: annotationCategory.value
        }
      }
      this.addToTimeline(note.team.name, annotationCategory.value, note.locationNames, note.note, note.internal, note.createdAt)
      this[note.team.name].subCategory[annotationType].count++
    })
  }
  /**
   * Group Cases by team and subcategory
   *
   * @memberof ServicesReport
   */
  groupCases() {
    this.cases.forEach((ticket) => {
      const { requestType, recordType } = ticket
      if (!this.CC.subCategory[requestType.name]) {
        this.CC.subCategory[requestType.name] = {
          count: 0,
          category: 'Cases Solved'
      }
    }
      this.CC.subCategory[requestType.name].count++
      if (!this.CC.category['Cases Solved']) {
        this.CC.category['Cases Solved'] = 0
      }
      this.addToTimeline('CC', recordType.name, 1, null, true, ticket.createdAt)
      this.CC.category['Cases Solved']++
    })
  }
  /**
   * Group WorkQ items by subcategory
   *
   * @memberof ServicesReport
   */
  groupWorkQ() {
    this.workQ.forEach((item) => {
      this.DA.category.Optimizations++
      if (!this.DA.subCategory[this.daSubCatMap[item.rule.class_name]]) {
        this.DA.subCategory[this.daSubCatMap[item.rule.class_name]] = {
          count : 0,
          category: 'Optimizations'
      }
    }
      this.addToTimeline('DA', 'Optimizations', 1, this.daSubCatMap[item.rule.class_name], true, item.created_at)
      this.DA.subCategory[this.daSubCatMap[item.rule.class_name]].count++
    })
  }
  /**
   * Add Item to Timeline
   *
   * @param {String} teamName
   * @param {String} timelineName
   * @param {Array || String} locations
   * @param {String} note
   * @param {Boolean} internal
   * @param {Date} timestamp
   * @memberof ServicesReport
   */
  addToTimeline(teamName, timelineName, locations, note, internal, timestamp) {
    if (!this[teamName].timeline[timelineName]) {
      this[teamName].timeline[timelineName] = []
    }
    // const locationCount = typeof locations === 'number' ? locations : ( locations.length > 3 ? locations.length : locations.join())
    const locationCount = typeof locations === 'number' ? locations : locations.length
    const locationNames = typeof locations === 'number' ? '' : ( locations.length > 3 ? '' : locations.join())

      this[teamName].timeline[timelineName].push([
        timestamp,
        1,
        locationCount,
        note,
        internal,
        locationNames
      ])
  }
  /**
   * Formate All Teams Data for use in the report
   *
   * @memberof ServicesReport
   */
  formatReport() {
    this.formatTeam(this.DA)
    this.formatTeam(this.CC)
    this.formatTeam(this.SEO)
  }
  /**
   * Format the teams data to work for the report
   *
   * @param {*} team
   * @memberof ServicesReport
   */
  formatTeam (team) {
    const { category, name, subCategory, timeline } = team
    const keys = Object.keys(category)

    const teamOverview = {
      name,
      data: []
    }
    const teamData = {
      name,
      overview: [],
      timeline: this.formatTimeline(timeline)
    }
    const overviews = {}
    keys.forEach((key => {
      teamOverview.data.push({
        x: key,
        y: category[key]
      })
      overviews[key] = []
    }))
    const subKeys = Object.keys(subCategory)
    subKeys.forEach((key) => {
      overviews[subCategory[key].category].push({
        name: key,
        data: [subCategory[key].count ]
      })
    })
    teamData.overview = this.formatSubCatCharts(overviews)
    this.teams.push(teamData)
    this.overview.push(teamOverview)
  }
  /**
   * Build Timeline Objects
   *
   * @param {*} timeline
   * @returns
   * @memberof ServicesReport
   */
  formatTimeline (timeline) {
    const keys = Object.keys(timeline)
    return keys.map((key) => {
      return {
        id: key.toLowerCase(),
        name: key,
        data: timeline[key]
      }
    })
  }
  /**
   * Format the sub category charts
   *
   * @param {*} overview
   * @returns
   * @memberof ServicesReport
   */
  formatSubCatCharts(overview) {
    const data = []
    const keys = Object.keys(overview)
    keys.forEach((key => {
      if (overview[key].length > 0) {
        data.push({
          id: key.toLowerCase(),
          category: key,
          series: overview[key]
        })
      }
    }))
    return data
  }
  getCategories() {
    return notesService.getCategories().then(({data}) => this.categories = data)
  }
  setOverviewCategories() {
    this.categories.forEach((category) => {
      this.DA.category[category.name] = 0
      this.CC.category[category.name] = 0
      this.SEO.category[category.name] = 0
    })
    this.DA.category['Cases Solved'] = 0
    this.CC.category['Cases Solved'] = 0
    this.SEO.category['Cases Solved'] = 0
  }
}

module.exports = ServicesReport
