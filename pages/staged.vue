<template>
  <b-container fluid>
    <report-nav />
    <b-progress :value="position" class="w-100 mb-2 rounded-0" />
    <b-row>
      <b-col cols="8" offset="2">
        <heat-map />
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="3">
        <by-line />
      </b-col>
      <b-col>
        <team-overview />
        <team-timeline />
        <promoted-notes />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import ReportNav from '~/components/breadcrumb-nav'
import HeatMap from '~/components/spark-chart'
import ByLine from '~/components/strategist-byline'
import TeamOverview from '~/components/team-overview-chart'
import TeamTimeline from '~/components/timeline-chart'
import PromotedNotes from '~/components/promoted-notes'
export default {
  components: {
    HeatMap,
    ReportNav,
    ByLine,
    TeamOverview,
    PromotedNotes,
    TeamTimeline
  },
  data() {
    return {
      position: 75
    }
  }
}
</script>

<style>

</style>
