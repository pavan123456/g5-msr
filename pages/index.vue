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
    <b-container fluid class="py-4">
      <b-row>
        <b-col cols="4">
          <b-card no-body>
            <h2 class="px-2">
              Overview
            </h2>
            <b-card-body class="text-muted">
              Will display the heatmap overview in a more condensed format minus the chart.
              <spark-chart />
            </b-card-body>
          </b-card>
        </b-col>
        <b-col>
          <timeline-chart />
        </b-col>
      </b-row>
    </b-container>
  </b-container>
</template>

<script>
import { table } from '~/mixins/staged-data'
import NavHeader from '~/components/nav-header'
import TimelineChart from '~/components/timeline-chart'
import SparkChart from '~/components/spark-chart'
import TableEditor from '~/components/table-editor'
export default {
  components: {
    TimelineChart,
    TableEditor,
    SparkChart,
    NavHeader
  },
  mixins: [table],
  data() {
    return {
      collapseIsVisible: true
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
</style>
