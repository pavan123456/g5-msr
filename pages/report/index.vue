<template>
  <div>
    <nav-header />
    <div
      ref="scrollContainer"
      class="scroll-container"
      @scroll="onScroll"
    >
      <b-container>
        <b-row
          v-for="(s, i) in sections"
          :key="`${s.text}-${i}`"
          class="pt-1"
        >
          <b-col v-if="s.text === 'Overview'" cols="8" offset="2">
            <h2
              :id="s.id"
              style="padding-top: 30px;"
              class="text-center"
            >
              {{ s.text }}
            </h2>
            <heatmap-overview-chart :chart="s.chart" />
          </b-col>
          <b-col v-else cols="10" offset="1">
            <b-row v-if="s.overview.length > 0" class="my-2 pt-1">
              <b-col>
                <h2
                  :id="s.id"
                  style="padding-top: 30px;"
                  class="text-center"
                >
                  {{ s.text }}
                </h2>
                <team-overview-chart :charts="s.overview" />
              </b-col>
            </b-row>
            <b-row v-if="s.timeline.length > 0" class="my-2">
              <b-col>
                <timeline-chart :chart="s.timeline" />
              </b-col>
            </b-row>
            <b-row v-if="Object.keys(s.promoted).length > 0">
              <b-col>
                <promoted-notes :notes="s.promoted" />
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
// import { getFormattedAnnotations, getFormattedOverview, getReportById } from '~/mixins/report'
export default {
  async asyncData ({ params, $axios, route, error }) {
    // try {
    //   const { reportId } = route.query
    //   if (!reportId) throw new Error('missing query params')
    //   const res = await getReportById(reportId)
    // } catch (e) {
    //   error(e)
    // }
    const { reportId } = route.query
    const res = await $axios
      .$get(`api/v1/reports/${reportId}?edit=true`)
    const overviewColumns = [
      'Cases Solved',
      'Account Audit',
      'General Note',
      'Account Changes',
      'Optimizations'
    ]
    res.overview.forEach((row) => {
      row.data = row.data.filter((col) => {
        return overviewColumns.includes(col.x)
      })
      const newData = []
      overviewColumns.forEach((title) => {
        newData.push(row.data.find(obj => obj.x === title))
      })
      row.data = newData
    })
    res.overview.reverse()

    return {
      res,
      sections: [
        {
          text: 'Overview',
          id: 'overview',
          href: '#overview',
          chart: {
            id: 'overview-chart',
            series: res.overview
          }
        },
        {
          text: 'Digital Advertising',
          id: 'da',
          href: '#da',
          ...res.teams.find(t => t.name === 'Digital Advertising'),
          promoted: res.notes
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
            }, {})
        },
        {
          text: 'SEO',
          id: 'seo',
          href: '#seo',
          ...res.teams.find(t => t.name === 'SEO'),
          promoted: res.notes
            .filter(n => n.team.name === 'SEO' && n.promoted === true)
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
            }, {})
        },
        {
          text: 'Customer Care',
          id: 'cc',
          href: '#cc',
          ...res.teams.find(t => t.name === 'Customer Care'),
          promoted: {}
        }
      ]
    }
  },
  data () {
    return {
      progress: 0
    }
  },
  methods: {
    onScroll () {
      const progress = this.$refs.scrollContainer.scrollTop / (this.$refs.scrollContainer.scrollHeight - this.$refs.scrollContainer.clientHeight)
      if (progress > 1) {
        this.progress = 1
      } else if (progress < 0) {
        this.progress = 0
      } else {
        this.progress = progress
      }
    }
  }
}
</script>

<style>
.wrapper {
  height: 100vh;
  width: 100vw;
  display: grid;
  overflow: hidden;
}

.scroll-container {
  overflow: scroll;
  max-height: calc(100vh - 150px);
}

</style>
