const axios = require('axios')

export async function clientReportsById (id) {
  return await axios
    .get(`api/v1/reports/display/${id}`)
    .then((res) => {
      if (res.status === 200) {
        return res.data
      } else {
        throw new Error('invalid data')
      }
    })
}

export async function getReportById (id) {
  return await axios.get(`api/v1/reports/${id}?edit=true`)
    .then(res => res.data)
}

export function createSections (notes, formattedOverview, teams) {
  const overview = {
    text: 'Overview',
    id: 'overview',
    href: '#overview',
    chart: {
      id: 'overview-chart',
      series: formattedOverview
    }
  }
  const sectionMap = {
    da: 'Digital Advertising',
    seo: 'SEO',
    cc: 'Customer Care'
  }
  const teamSections = Object.entries(sectionMap)
    .map(([key, val]) => {
      const promoted = key === 'cc' ? {} : formatPromoted(notes, key.toUpperCase())
      return {
        text: val,
        id: key,
        href: `#${key}`,
        ...teams.find(t => t.name === val),
        promoted
      }
    })
  return [overview, ...teamSections]
}

const noteMap = (note, i) => {
  const { note: text, createdAt: date, annotationType: type, annotationCategory, locations } = note
  return {
    id: i,
    text,
    date,
    type,
    category: annotationCategory.text,
    locations: locations.map(l => l.name)
  }
}

const structureByMonthKeys = (obj, n) => {
  const month = new Date(n.date).toLocaleString('default', { month: 'long' })
  obj[month] = obj[month] || []
  obj[month].push(n)
  return obj
}

export function formatPromoted (notes, team) {
  const teamFilter = note => note.team.name === team && note.promoted === true
  return notes
    .filter(teamFilter)
    .map(noteMap)
    .reduce(structureByMonthKeys, {})
}

export function getFormattedAnnotations (notes, teams) {
  return {
    da: {
      notes: notes.filter(n => n.team.name === 'DA'),
      promoted: formatPromoted(notes, 'DA'),
      ...teams.find(n => n.name === 'Digital Advertising')
    },
    seo: {
      notes: notes.filter(n => n.team.name === 'SEO'),
      ...teams.find(n => n.name === 'SEO')
    },
    cc: {
      notes: notes.filter(n => n.team.name === 'CC'),
      ...teams.find(n => n.name === 'Customer Care')
    }
  }
}
export function getFormattedOverview (overview) {
  const overviewColumns = ['Cases Solved', 'Account Audit', 'General Note', 'Account Changes', 'Optimizations']
  overview.forEach((row) => {
    row.data = row.data.filter((col) => {
      return overviewColumns.includes(col.x)
    })
    const newData = []
    overviewColumns.forEach((title) => {
      newData.push(row.data.find(obj => obj.x === title))
    })
    row.data = newData
  })
  overview.reverse()
  return overview
}

export default {
  data () {
    return {
    }
  },
  methods: {
    async getReportByClient (clientUrn, to, from) {
      return await this.$axios.$get('api/v1/reports', { params: { to, from, clientUrn } })
    },
    getReportById,
    getFormattedAnnotations,
    getFormattedOverview,
    formatPromoted,
    createSections,
    clientReportsById
  }
}
