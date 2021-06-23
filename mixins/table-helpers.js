export default {
  data () {
    return {
      fields: [
        {
          key: 'selected',
          label: 'Selected',
          sortable: false,
          class: 'align-middle text-center'
        },
        {
          key: 'createdAt',
          label: 'Created',
          sortable: true,
          class: 'align-middle text-center'
        },
        {
          key: 'updatedAt',
          label: 'Updated',
          sortable: true,
          class: 'align-middle text-center'
        },
        {
          key: 'internal',
          label: 'Visibility',
          sortable: true,
          class: 'align-middle text-center'
        },
        {
          key: 'annotationCategory',
          label: 'Category',
          sortable: true,
          class: 'align-middle text-center'
        },
        {
          key: 'annotationType',
          label: 'Action Type',
          sortable: true,
          class: 'align-middle text-center tbl-w200'
        },
        {
          key: 'annotationUser',
          label: 'User',
          sortable: true,
          class: 'align-middle text-center tbl-w200'
        },
        {
          key: 'salesforceSync',
          label: 'SF Synced',
          sortable: true,
          class: 'align-middle text-center'
        },
        {
          key: 'note',
          label: 'Note',
          sortable: true,
          class: 'align-middle tbl-w350'
        },
        {
          key: 'clientName',
          label: 'Client',
          sortable: true,
          class: 'align-middle tbl-w350 text-center'
        },
        {
          key: 'locationNames',
          label: 'Location Name(s)',
          sortable: true,
          class: 'align-middle tbl-w400'
        }
      ],
      items: [],
      totalRows: 1
    }
  },
  methods: {
    createFields (row, exclude = []) {},
    formatDate (date) {
      const d = new Date(date)
      let month = '' + (d.getMonth() + 1)
      let day = '' + d.getDate()
      const year = d.getFullYear()
      if (month.length < 2) {
        month = '0' + month
      }
      if (day.length < 2) {
        day = '0' + day
      }
      return [year, month, day].join('-')
    },
    generateTimeline (items) {
      // this.$emit('generate-timeline', items)
      const categories = [
        'Optimizations',
        'Account Changes',
        'General Note'
      ]
      const series = []
      for (const c in categories) {
        series.push({
          name: categories[c],
          data: items
            .filter(i => i.annotationCategory.value === categories[c])
            .map((n) => {
              return [
                n.createdAt,
                1,
                n.locations.length * 10,
                n.note,
                n.internal,
                n.annotationType,
                n.locations.length > 3 ? `${n.locations.length} locations` : `${n.locationNames.join(', ')}`
              ]
            })
        })
      }
      // this.$emit('series', series)
      return {
        id: 'timeline-chart',
        series
      }
    }
  }
}
