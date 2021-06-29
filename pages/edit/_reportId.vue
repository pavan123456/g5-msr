<template>
  <div>
    <nav-header :approvals="approvals" :client="client" />
    <div class="inset-controls bg-quaternary">
      <b-card class="inset-controls__card">
        <h1 class="text-white text-uppercase font-weight-bold inset-controls__card__title">
          Explore or Create
        </h1>
        <editor-controls />
      </b-card>
    </div>
    <b-container style="margin-top: 100px;">
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
import Helpers from '~/mixins/table-helpers'
export default {
  mixins: [Helpers],
  async asyncData ({ params, $axios, route, store }) {
    const { team } = route.query
    store.dispatch('inputs/onUpdate', {
      key: 'team',
      value: team || 'da'
    })
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
  data () {
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
  fetch ({ store, query }) {
    return store.dispatch('inputs/onUpdate', {
      key: 'team',
      value: query.team || 'da'
    })
  },
  computed: {
    team () {
      return this.$store.state.inputs.team
    },
    teamOptions () {
      return this.$store.state.inputs.teams
    },
    items () {
      return this.annotations && this.team && this.annotations[this.team].notes
        ? this.annotations[this.team].notes
        : []
    },
    totalRows () {
      return this.annotations && this.team && this.annotations[this.team].notes
        ? this.annotations[this.team].notes.length
        : 1
    }
  },
  watch: {
    team (team) {
      this.$router.push({ path: this.$route.path, query: { team } })
    }
  },
  created () {
    this.$router.push({ path: this.$route.path, query: { team: this.team } })
  }
}
</script>

<style lang="scss">
.inset-controls {
  height: 120px;
  width: 100%;
  border-radius: 0 0 100px 0;
  position: relative;
  &__card {
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 85%;
    max-width: 1140px;
    transform: translate(-50%, 50%);
    border-radius: 13px;
    border-color: #f7f7fc;
    box-shadow: 0 5px 10px rgba(31, 40, 137, 0.3);
    &__title {
      position: absolute;
      top: 0;
      width: 100%;
      left: 0;
      transform: translateY(calc(-100% - 20px));
    }
  }
}
</style>
