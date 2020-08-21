const notesService = require('./noteService')
class ServiecesReport {
  constructor(to, from, clientUrn) {
    this.t0 = null
    this.t1 = null
    this.to = to
    this.from = from
    this.clientUrn = clientUrn
    this.notes = []
    this.cases = []
    this.workQ = []
    this.DA = {
      name: 'Digital Advertising',
      category: {
        optimizations: 0
      },
      subCategory: {}
    }
    this.SEO = {
      name: 'Search Engine Optimization',
      category: {},
      subCategory: {}
    }
    this.CC = {
      name: 'Customer Care',
      category: {},
      subCategory: {}
    }
    this.daSubCatMap = {
      CountLocationExtensionRule:"Updated Call Extension",
      PhoneRule:"Updated Call Extension",
      CountLocationCallExtensionRule:"Updated Call Extension",
      UrlRule: "URL Change"
  
    }
  }
  display () {
    const now = new Date()
    return {
      time: `${(now.getTime() - this.t0)} milliseconds`,
      DA: this.DA, 
      SEO: this.SEO,
      CC: this.CC,
      notes: this.notes

    }
  }
  async generate() {
    const now = new Date()
    this.t0 = now.getTime()
    const workQ = this.getWorkQ()
    const notes = this.getNotes()
    const cases = this.getCases()
    return Promise.all([workQ, notes, cases])
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
  async getCases () {
    const { data: cases } = await notesService.getCases(this.clientUrn, this.to, this.from)
    this.cases = cases
  }
  async getWorkQ () {
    const { data: workQ } = await notesService.getWorkQ(this.clientUrn, this.to, this.from)
    this.workQ = workQ
  }
  groupNotes () {
    this.notes.forEach((note) => {
      const {annotationCategory, annotationType} = note
      if (!this[note.team.name].category[annotationCategory.value]) {
        this[note.team.name].category[annotationCategory.value] = 0
      }
      this[note.team.name].category[annotationCategory.value]++
      if (!this[note.team.name].subCategory[annotationType]) {
        this[note.team.name].subCategory[annotationType] = 0
      }
      this[note.team.name].subCategory[annotationType]++
    })
  }

  groupCases () {
    this.cases.forEach((ticket) => {
      const { requestType, recordType } = ticket
      if (!this.CC.subCategory[requestType.name]) {
        this.CC.subCategory[requestType.name] = 0
      }
      this.CC.subCategory[requestType.name]++
      if (!this.CC.category[recordType.name]) {
        this.CC.category[recordType.name] = 0
      }
      this.CC.category[recordType.name]++
    })
  }

  groupWorkQ () {
    this.workQ.forEach((item) => {
      this.DA.category.optimizations++
      if(!this.DA.subCategory[this.daSubCatMap[item.rule.class_name]]) {
        this.DA.subCategory[this.daSubCatMap[item.rule.class_name]] = 0
      }
      this.DA.subCategory[this.daSubCatMap[item.rule.class_name]]++
    })
  }
}

module.exports = ServiecesReport
