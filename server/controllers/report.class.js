const notesService = require('./noteService')
class ServicesReport {
  constructor(to, from, clientUrn) {
    this.t0 = null
    this.t1 = null
    this.categories  = []
    this.to = to
    this.from = from
    this.clientUrn = clientUrn
    this.notes = []
    this.cases = []
    this.workQ = []

    this.DA = {
      name: 'Digital Advertising',
      category: {
        Optimizations: 0
      },
      subCategory: {},
      timeline: {}
    }
    this.SEO = {
      name: 'Search Engine Optimization',
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
  display() {
    this.formatReport()
    const now = new Date()
    return {
      time: `${(now.getTime() - this.t0)} milliseconds`,
      overview: this.overview,
      teams: this.teams,
      // DA: this.DA,
      // SEO: this.SEO,
      // CC: this.CC,
      notes: this.notes,
      // workQ: this.workQ
    }
  }
  async generate() {
    const now = new Date()
    this.t0 = now.getTime()
    await this.getCategories()
    this.setOverviewCategories()
    const workQ = this.getWorkQ()
    const notes = this.getNotes()
    const cases = this.getCases()
    return Promise.all([ workQ, notes, cases])
      .then(() => {
        this.groupWorkQ()
        this.groupNotes()
        this.groupCases()
      })
  }
  async getNotes() {
    const { data: notes } = await notesService.getNotes(this.clientUrn, this.to, this.from)
    this.notes = notes
  }
  async getCases() {
    const { data: cases } = await notesService.getCases(this.clientUrn, this.to, this.from)
    this.cases = cases
  }
  async getWorkQ() {
    const { data: workQ } = await notesService.getWorkQ(this.clientUrn, this.to, this.from)
    this.workQ = workQ
  }
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
  addToTimeline(teamName, timelineName, locations, note, internal, timestamp) {
    if (!this[teamName].timeline[timelineName]) {
      this[teamName].timeline[timelineName] = []
    }
    const locationCount = typeof locations === 'number' ? locations : ( locations.length > 3 ? locations.length : locations.join())
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
  formatReport() {
    this.formatTeam(this.DA)
    this.formatTeam(this.CC)
    this.formatTeam(this.SEO)
  }
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
  formatSubCatCharts(overview) {
    const data = []
    const keys = Object.keys(overview)
    keys.forEach((key => {
      data.push({
        id: key.toLowerCase(),
        category: key,
        series: overview[key]
      })
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
