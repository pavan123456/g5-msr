<template>
  <div>
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
          <b-popover
            target="editor-toggle"
            triggers="hover"
            placement="left"
          >
            Toggle Editor.
          </b-popover>
        </b-btn-group>
      </template>
    </nav-header>
    <b-collapse
      id="editor"
      v-model="collapseIsVisible"
    >
      <b-card bg-variant="primary-1" no-body class="border-0 m-0">
        <table-editor
          :table="{
            id: 'team-table',
            items: items,
            fields: fields,
            totalRows: items.length
          }"
        />
      </b-card>
    </b-collapse>
    <b-container>
      <b-row>
        <b-col>
          <b-card
            v-if="annotations[team].overview.length > 0"
            no-body
            class="my-2"
          >
            <team-overview-chart :charts="annotations[team].overview" />
          </b-card>
          <b-card
            v-if="annotations[team].timeline.length > 0"
            no-body
            class="my-2"
          >
            <timeline-chart :chart="annotations[team].timeline" />
          </b-card>
          <b-card
            header-class="p-0 my-2"
            class="my-2"
          >
            <template v-slot:header>
              <b-btn
                block
                variant="transparent"
                class="rounded-0 d-flex justify-content-between text-muted text-uppercase"
                @click="overviewVisible = !overviewVisible"
              >
                All Teams
                <b-icon-chevron-up v-if="overviewVisible" />
                <b-icon-chevron-down v-else />
              </b-btn>
            </template>
            <b-collapse
              v-model="overviewVisible"
            >
              <spark-chart
                :chart="{ id: 'overview-chart', series: overview }"
              />
              <h1 style="font-size:2em;">
                {{ time }}
              </h1>
            </b-collapse>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import NavHeader from '~/components/nav-header'
import Helpers from '~/mixins/table-helpers'
import TableEditor from '~/components/table-editor'
import SparkChart from '~/components/heatmap-overview-chart'
import TimelineChart from '~/components/timeline-chart'
import TeamOverviewChart from '~/components/team-overview-chart'
export default {
  components: {
    TableEditor,
    TimelineChart,
    TeamOverviewChart,
    SparkChart,
    NavHeader
  },
  mixins: [Helpers],
  fetch({ store, query }) {
    return store.dispatch('inputs/onUpdate', {
      key: 'team',
      value: query.team
    })
  },
  async asyncData({ params, $axios }) {
    const {
      time,
      overview,
      teams,
      notes
    } = await $axios.$get(`api/v1/report/${params.reportId}`)

    const annotations = {
      da: {
        notes: notes.filter(n => n.team.name === 'DA'),
        promoted: [],
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

    return {
      time,
      overview,
      teams,
      annotations,
      collapseIsVisible: true,
      overviewVisible: true
    }
  },
  computed: {
    team() {
      return this.$store.state.inputs.team
    },
    teamOptions() {
      return this.$store.state.inputs.teams
    }
  },
  created() {
    this.items = this.annotations[this.team].notes
  },
  methods: {
    onTeamChange(team) {
      if (team) {
        this.items = this.annotations[team].notes
        this.totalRows = this.annotations[team].notes.length
      }
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
