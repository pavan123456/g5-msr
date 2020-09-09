<template>
  <div>
    <nav-header
      :approvals="approvals"
      :client="client"
    >
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
            Open/Close Editor
          </b-popover>
        </b-btn-group>
      </template>
    </nav-header>
    <b-collapse
      id="editor"
      v-model="collapseIsVisible"
    >
      <b-card bg-variant="primary-1" no-body class="m-0 rounded-0">
        <table-editor
          :table="{
            id: 'teamTable',
            items: items,
            fields: fields,
            totalRows: items.length
          }"
        />
      </b-card>
    </b-collapse>
    <b-container>
      <b-row class="my-2">
        <b-col>
          <section-wrapper v-bind="tips.teamOverview">
            <team-overview-chart :charts="annotations[team].overview" />
          </section-wrapper>
        </b-col>
      </b-row>
      <b-row class="my-2">
        <b-col>
          <section-wrapper v-bind="tips.teamTimeline">
            <timeline-chart :chart="annotations[team].timeline" />
          </section-wrapper>
        </b-col>
      </b-row>
      <b-row class="my-2">
        <b-col>
          <section-wrapper v-bind="tips.teamPromoted">
            <promoted-notes :notes="annotations[team].promoted" />
          </section-wrapper>
        </b-col>
      </b-row>
      <b-row class="my-2">
        <b-col>
          <section-wrapper v-bind="tips.overview">
            <heatmap-chart :chart="{ id: 'overview-chart', series: overview }" />
          </section-wrapper>
        </b-col>
      </b-row>
    </b-container>
    {{ version }}
  </div>
</template>

<script>
import { version } from '~/package.json'
import NavHeader from '~/components/nav-header'
import Helpers from '~/mixins/table-helpers'
import TableEditor from '~/components/table-editor'
import HeatmapChart from '~/components/heatmap-overview-chart'
import TimelineChart from '~/components/timeline-chart'
import TeamOverviewChart from '~/components/team-overview-chart'
import PromotedNotes from '~/components/promoted-notes'
import SectionWrapper from '~/components/section-wrapper'
export default {
  components: {
    TableEditor,
    PromotedNotes,
    TimelineChart,
    TeamOverviewChart,
    HeatmapChart,
    SectionWrapper,
    NavHeader
  },
  mixins: [Helpers],
  fetch({ store, query }) {
    return store.dispatch('inputs/onUpdate', {
      key: 'team',
      value: query.team || 'da'
    })
  },
  async asyncData({ params, $axios }) {
    const {
      time,
      overview,
      teams,
      approvals,
      notes,
      clientName,
      to,
      from
    } = await $axios.$get(`api/v1/report/${params.reportId}?edit=true`)

    const annotations = {
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

    return {
      time,
      overview,
      teams,
      approvals,
      annotations,
      client: {
        name: clientName,
        to,
        from
      }
    }
  },
  data() {
    return {
      version,
      collapseIsVisible: true,
      tips: {
        overview: {
          title: 'Overview',
          description: 'This section is used to provide a summary of work completed across all teams for the time period. It pulls from transactional notes (WorkQ, SEO Audit Tool, SF Cases) and manual notes taken from the extension or UI.'
        },
        teamOverview: {
          title: 'Team Overview',
          description: 'This section is used to dive a little deeper into the type of work completed over the time period. It pulls from transactional notes (WorkQ, SEO Audit Tool, SF Cases) and manual notes taken from the extension or UI.',
          fallback: '😢 Oh no! It looks like we can\'t find any notes for this time period. \n We\'d recommend adding some notes or if you think this is an error please report it!'
        },
        teamTimeline: {
          title: 'Team Timeline',
          description: 'This section is used to show the work you\'ve completed over time. It pulls from transactional notes (WorkQ, SEO Audit Tool, SF Cases) and manual notes taken from the extension or UI.'
        },
        teamPromoted: {
          title: 'Team Promoted Notes',
          description: 'This section is used to convey important information to a customer. It pulls from the notes you have previously marked as Promoted. This is the only section that displays the actual content of your notes.\n\n You can add or remove notes from this section by promoting or un-promoting them in the table above.'
        }
      }
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
    },
    formatOverviewData() {
      this.overview.forEach((row) => {
        row.data = row.data.filter((col) => {
          return this.overviewColumns.includes(col.x)
        })
      })
      return this.overview
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
