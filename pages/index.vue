<template>
  <b-container fluid class="px-0">
    <nav-header>
      <template v-slot:dangle>
        <b-btn-group class="dangle-group bg-white border border-neutral" size="sm">
          <b-btn
            id="editor-toggle"
            variant="transparent"
            @click="collapseIsVisible = !collapseIsVisible"
          >
            <b-icon-caret-up v-if="collapseIsVisible" />
            <b-icon-caret-down v-else />
          </b-btn>
          <b-tooltip
            target="editor-toggle"
            triggers="hover"
            variant="primary-1"
            placement="left"
          >
            Toggle Editor.
          </b-tooltip>
        </b-btn-group>
      </template>
    </nav-header>
    <b-collapse
      id="editor"
      v-model="collapseIsVisible"
    >
      <b-card bg-variant="neutral" class="border-0 m-0">
        <table-editor :table="table" />
      </b-card>
    </b-collapse>
    <b-container fluid class="py-2">
      <b-row no-gutters class="mb-2">
        <b-col cols="6" offset="3">
          <b-btn-group size="sm" class="w-100">
            <b-btn
              id="report-refresh-btn"
              variant="light"
              @click=" reportIsBusy = !reportIsBusy"
            >
              Refresh Report Preview
              <b-icon-arrow-clockwise :animation="reportIsBusy ? 'spin' : ''" />
            </b-btn>
            <b-popover
              target="report-refresh-btn"
              triggers="hover"
              placement="topleft"
            >
              <template v-slot:title>
                <span style="font-size: 1.5em;">
                  This reloads visualizations and promoted notes.
                </span>
              </template>
              You should click this if you have made changes to the data above and want to see the effect on the output.
            </b-popover>
          </b-btn-group>
        </b-col>
      </b-row>
      <b-row :class="[{ 'is-busy': reportIsBusy }]">
        <b-col cols="3">
          <b-card no-body>
            <h2 class="px-2">
              Overview
            </h2>
            <b-card-body class="text-muted">
              Will display the heatmap overview in a more condensed format minus the chart.
              <spark-chart :chart="chart" />
            </b-card-body>
          </b-card>
          <div class="mt-3">
            <by-line />
          </div>
        </b-col>
        <b-col>
          <div class="mb-3">
            <timeline-chart />
          </div>
          <promoted-notes />
        </b-col>
      </b-row>
    </b-container>
  </b-container>
</template>

<script>
import { table, metricsData } from '~/mixins/staged-data'
import NavHeader from '~/components/nav-header'
import TimelineChart from '~/components/timeline-chart'
import SparkChart from '~/components/spark-chart'
import PromotedNotes from '~/components/promoted-notes'
import ByLine from '~/components/strategist-byline'
import TableEditor from '~/components/table-editor'
export default {
  components: {
    TimelineChart,
    TableEditor,
    PromotedNotes,
    ByLine,
    SparkChart,
    NavHeader
  },
  mixins: [table, metricsData],
  async fetch({ store }) {
    await store.dispatch('inputs/fillClients')
  },
  data() {
    return {
      collapseIsVisible: true,
      pageIsBusy: false,
      reportIsBusy: false
    }
  }
}
</script>

<style lang="scss" scoped>
.dangle-group {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 50%);
  z-index: 10;
  border-radius: 50%;
  overflow: hidden;
}
.is-busy {
  opacity: 0.5;
}
</style>
