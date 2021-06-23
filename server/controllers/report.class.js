const models = require('../models')
const notesService = require('./annotationService')

class ServicesReport {
  constructor (to, from, clientUrn, workQ, approvals, edit) {
    this.t0 = null
    this.t1 = null
    this.categories = []
    this.approvals = approvals
    this.editing = edit
    this.to = to
    this.from = from
    this.clientUrn = clientUrn
    this.notes = []
    this.cases = []
    this.workQ = workQ
    this.clientName = null

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
      CountLocationExtensionRule: 'Updated Call Extension',
      PhoneRule: 'Updated Call Extension',
      CountLocationCallExtensionRule: 'Updated Call Extension',
      UrlRule: 'URL Change'
    }

    this.caseTeamMap = {
      'Technical Support': 'CC',
      'Website Maintenance': 'CC',
      'Digital Advertising': 'DA',
      'Search Engine Optimization': 'SEO'
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
  display () {
    if (this.isApproved() || this.editing) {
      this.formatReport()
      const now = new Date()
      console.log(`${(now.getTime() - this.t0)} milliseconds`)
      return {
        time: `${(now.getTime() - this.t0)} milliseconds`,
        overview: this.overview,
        teams: this.teams,
        notes: this.notes,
        approvals: this.approvals.map(team => ({
          name: this[team.id.toUpperCase()].name,
          ...team
        }
        )),
        to: this.to,
        from: this.from,
        clientName: this.clientName
      }
    } else {
      return {
        error: 'this report is not ready to view'
      }
    }
  }

  isApproved () {
    let approved = true
    for (let i = 0; i < this.approvals.length; i++) {
      if (!this.approvals[i].value) {
        approved = false
        break
      }
    }
    return approved
  }

  getClientName () {
    return models.g5_updatable_client.findOne({
      where: {
        urn: this.clientUrn
      }
    }).then((client) => {
      this.clientName = client.dataValues.properties.branded_name
        ? client.dataValues.properties.branded_name
        : client.dataValues.name
    })
  }

  /**
   * Fetch all report data and generate categorties
   *
   * @returns
   * @memberof ServicesReport
   */
  async generate () {
    const now = new Date()
    this.t0 = now.getTime()
    await this.getCategories()
    this.setOverviewCategories()
    await this.getClientName()
    const notes = this.getNotes()
    const cases = this.getCases()
    return Promise
      .all([notes, cases])
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
  async getNotes () {
    const { data: notes } = await notesService.getNotes(this.clientUrn, this.to, this.from)
    this.notes = notes
  }

  /**
   * Get all cases from the note service
   *
   * @memberof ServicesReport
   */
  async getCases () {
    const { data: cases } = await notesService.getCases(this.clientUrn, this.to, this.from)
    this.cases = cases
  }

  /**
   * Group the notes by category, subcategory and team
   *
   * @memberof ServicesReport
   */
  groupNotes () {
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
          count: 0,
          category: annotationCategory.value
        }
      }
      this.addToTimeline(annotationCategory.value, note.team.name, annotationType, note.locationNames, note.note, note.internal, note.createdAt)
      this[note.team.name].subCategory[annotationType].count++
    })
  }

  /**
   * Group Cases by team and subcategory
   *
   * @memberof ServicesReport
   */
  groupCases () {
    this.cases.forEach((ticket) => {
      const { requestType, recordType } = ticket
      const team = this.caseTeamMap[recordType.name]
      if (team) {
        if (!this[team].subCategory[requestType.name]) {
          this[team].subCategory[requestType.name] = {
            count: 0,
            category: 'Cases Solved'
          }
        }
        this[team].subCategory[requestType.name].count++
        if (!this[team].category['Cases Solved']) {
          this[team].category['Cases Solved'] = 0
        }
        this.addToTimeline('Cases Solved', team, requestType.name, 1, null, true, ticket.closedDate)
        this[team].category['Cases Solved']++
      }
    })
  }

  /**
   * Group WorkQ items by subcategory
   *
   * @memberof ServicesReport
   */
  groupWorkQ () {
    this.workQ.forEach((item) => {
      this.DA.category.Optimizations++
      if (!this.DA.subCategory[this.daSubCatMap[item.rule.class_name]]) {
        this.DA.subCategory[this.daSubCatMap[item.rule.class_name]] = {
          count: 0,
          category: 'Optimizations'
        }
      }
      this.addToTimeline('Optimizations', 'DA', this.daSubCatMap[item.rule.class_name], item.locations, '', true, item.created_at)
      this.DA.subCategory[this.daSubCatMap[item.rule.class_name]].count++
    })
  }

  /**
   * Add Item to Timeline
   *
   * @param {String} category
   * @param {String} teamName
   * @param {String} actionType
   * @param {Array || String} locations
   * @param {String} note
   * @param {Boolean} internal
   * @param {Date} timestamp
   * @memberof ServicesReport
   */
  addToTimeline (category, teamName, actionType, locations, note, internal, timestamp) {
    if (!this[teamName].timeline[category]) {
      this[teamName].timeline[category] = []
    }

    const locationCount = typeof locations === 'number' ? locations : (locations.length === 0 ? 10 : locations.length)
    const locationNames = typeof locations === 'number' ? [''] : locations

    this[teamName].timeline[category].push([
      timestamp,
      1,
      locationCount,
      {
        category,
        actionType,
        note,
        internal,
        locationNames
      }
    ])
  }

  /**
   * Formate All Teams Data for use in the report
   *
   * @memberof ServicesReport
   */
  formatReport () {
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
    keys.forEach((key) => {
      teamOverview.data.push({
        x: key,
        y: category[key]
      })
      overviews[key] = []
    })
    const subKeys = Object.keys(subCategory)
    subKeys.forEach((key) => {
      overviews[subCategory[key].category].push({
        name: key === 'null' ? subCategory[key].category : key,
        data: [subCategory[key].count]
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
  formatSubCatCharts (overview) {
    const data = []
    const keys = Object.keys(overview)
    keys.forEach((key) => {
      if (overview[key].length > 0) {
        data.push({
          id: key.toLowerCase(),
          category: key,
          series: overview[key]
        })
      }
    })
    return data
  }

  getCategories () {
    return notesService.getCategories().then(({ data }) => {
      this.categories = data
    })
  }

  setOverviewCategories () {
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
