export default {
  data () {
    return {
    }
  },
  methods: {
    async getReportById (id) {
      return await this.$axios.$get(`api/v1/reports/${id}?edit=true`)
    },
    async getReportByClient (clientUrn, to, from) {
      return await this.$axios.$get('api/v1/reports', { params: { to, from, clientUrn } })
    },
    getFormattedAnnotations (notes, teams) {
      return {
        da: {
          notes: notes.filter(n => n.team.name === 'DA'),
          promoted: notes
            .filter(n => n.team.name === 'DA' && n.promoted === true)
            .map((n) => {
              return {
                id: '',
                text: n.note,
                date: n.createdAt,
                locations: n.locations.map(l => l.name)
              }
            })
            .reduce((obj, n) => {
              const month = new Date(n.date).toLocaleString('default', { month: 'long' })
              obj[month] = obj[month] || []
              obj[month].push(n)
              return obj
            }, {}),
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
    },
    getFormattedOverview (overview) {
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
  }
}
