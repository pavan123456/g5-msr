<template>
  <div class="px-0">
    <report-nav
      :items="sections"
      :period="period"
      :name="clientName"
    />
    <b-container>
      <b-row
        v-for="(s, i) in sections"
        :key="`${s.text}-${i}`"
        class="pt-5"
      >
        <b-col v-if="s.text === 'Overview'" cols="8" offset="2">
          <h2
            :id="s.id"
            style="padding-top: 100px;"
            class="text-center"
          >
            {{ s.text }}
          </h2>
          <heat-map :chart="s.chart" />
        </b-col>
        <b-col v-else cols="10" offset="1">
          <b-row class="my-5 pt-5">
            <b-col>
              <h2
                :id="s.id"
                style="padding-top: 100px;"
                class="text-center"
              >
                {{ s.text }}
              </h2>
              <team-overview :charts="s.overview" />
            </b-col>
          </b-row>
          <b-row class="my-5">
            <b-col>
              <team-timeline :chart="s.timeline" />
            </b-col>
          </b-row>
          <!-- <b-row>
            <b-col align-self="center" cols="3">
              <by-line />
            </b-col>
            <b-col>
              <promoted-notes />
            </b-col>
          </b-row> -->
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import ReportNav from '~/components/breadcrumb-nav'
import HeatMap from '~/components/heatmap-overview-chart'
// import ByLine from '~/components/strategist-byline'
import TeamOverview from '~/components/team-overview-chart'
import TeamTimeline from '~/components/timeline-chart'
// import PromotedNotes from '~/components/promoted-notes'
export default {
  components: {
    HeatMap,
    ReportNav,
    // ByLine,
    TeamOverview,
    // PromotedNotes,
    TeamTimeline
  },
  async asyncData({ params, $axios }) {
    const res = await $axios
      .$get(`api/v1/report/${params.reportId}`)
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
          ...res.teams.find(t => t.name === 'Digital Advertising')
        },
        {
          text: 'SEO',
          id: 'seo',
          href: '#seo',
          ...res.teams.find(t => t.name === 'SEO')
        },
        {
          text: 'Customer Care',
          id: 'cc',
          href: '#cc',
          ...res.teams.find(t => t.name === 'Customer Care')
        }
      ],
      period: {
        to: res.to,
        from: res.from
      },
      clientName: res.clientName
    }
  }
}
</script>

<style>

</style>
