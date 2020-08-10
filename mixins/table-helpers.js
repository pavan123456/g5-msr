export default {
  methods: {
    createFields(row, exclude = []) {},
    generateTimeline(items) {
      this.$emit('generate-timeline', items)
      return {
        id: 'timeline-chart',
        series: [{
          name: 'Cases',
          requestType: 'Solved',
          data: [
            ...items.map(n => [n.createdAt, 1, n.locations.length])
          ]
        }]
      }
    }
  }
}
