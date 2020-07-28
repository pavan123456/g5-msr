<template>
  <b-container fluid class="px-0">
    <nav-header>
      <template v-slot:dangle>
        <b-btn-group class="dangle-group bg-white" size="sm">
          <b-btn
            id="editor-toggle"
            variant="neutral"
            @click="collapseIsVisible = !collapseIsVisible"
          >
            <b-icon-caret-up v-if="collapseIsVisible" />
            <b-icon-caret-down v-else />
          </b-btn>
          <b-tooltip
            target="editor-toggle"
            triggers="hover"
            variant="darker"
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
      <b-card>
        <h1>
          Editor
        </h1>
      </b-card>
    </b-collapse>
    <b-container fluid class="py-5">
      <b-row>
        <b-col cols="4">
          <b-card>
            <h2>
              Overview
            </h2>
            <b-card-body class="text-muted">
              Will display the heatmap overview in a more condensed format minus the chart.
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
import NavHeader from '~/components/nav-header'
import TimelineChart from '~/components/timeline-chart'
export default {
  components: {
    TimelineChart,
    NavHeader
  },
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
  transform: translate(-50%, 80%);
  z-index: 10;
}
</style>
