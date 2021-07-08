<template>
  <div>
    <alert />
    <nav-header />
    <div class="inset-controls bg-quaternary">
      <b-card class="inset-controls__card">
        <h1 class="text-white text-uppercase font-weight-bold inset-controls__card__title">
          Explore or Create
        </h1>
        <editor-controls />
      </b-card>
    </div>
    <b-container v-if="!reportAvailable" style="margin-top: 60px;" />
    <b-container v-else style="margin-top: 60px;">
      <b-row class="my-2">
        <b-col class="p-0">
          <section-wrapper v-bind="tips.teamOverview">
            <team-overview-chart :charts="annotations[team].overview" />
          </section-wrapper>
        </b-col>
      </b-row>
      <b-row class="my-2">
        <b-col class="p-0">
          <section-wrapper v-bind="tips.teamTimeline">
            <timeline-chart :chart="annotations[team].timeline" />
          </section-wrapper>
        </b-col>
      </b-row>
      <b-row class="my-2">
        <b-col class="p-0">
          <section-wrapper v-bind="tips.teamPromoted">
            <promoted-notes :notes="annotations[team].promoted" />
          </section-wrapper>
        </b-col>
      </b-row>
      <b-row class="my-2">
        <b-col class="p-0">
          <section-wrapper v-bind="tips.overview">
            <heatmap-overview-chart :chart="{ id: 'overview-chart', series: overview }" />
          </section-wrapper>
        </b-col>
      </b-row>
      <b-row class="my-2">
        <b-col class="p-0">
          <b-badge variant="quaternary-40">
            Activity Tracker v.{{ version }}
          </b-badge>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { version } from '~/package.json'
import Helpers from '~/mixins/table-helpers'
const _ = require('lodash')
export default {
  mixins: [Helpers],
  asyncData ({ route, store }) {
    const { team } = route.query
    store.dispatch('inputs/fillClients')
    store.dispatch('inputs/init')
    store.dispatch('inputs/onUpdate', { team: team || 'da' })
  },
  data () {
    return {
      version,
      collapseIsVisible: true,
      tips: {
        overview: {
          title: 'Overview',
          description: 'This section is used to provide a summary of work completed across all teams for the time period. It pulls from transactional notes (SEO Audit Tool, SF Cases) and manual notes taken from the extension or UI.'
        },
        teamOverview: {
          title: 'Team Overview',
          description: 'This section is used to dive a little deeper into the type of work completed over the time period. It pulls from transactional notes (SEO Audit Tool, SF Cases) and manual notes taken from the extension or UI.',
          fallback: '😢 Oh no! It looks like we can\'t find any notes for this time period. \n We\'d recommend adding some notes or if you think this is an error please report it!'
        },
        teamTimeline: {
          title: 'Team Timeline',
          description: 'This section is used to show the work you\'ve completed over time. It pulls from transactional notes (SEO Audit Tool, SF Cases) and manual notes taken from the extension or UI.'
        },
        teamPromoted: {
          title: 'Team Promoted Notes',
          description: 'This section is used to convey important information to a customer. It pulls from the notes you have previously marked as Promoted. This is the only section that displays the actual content of your notes.\n\n You can add or remove notes from this section by promoting or un-promoting them in the table above.'
        }
      }
    }
  },
  computed: {
    ...mapState({
      annotations: state => state.inputs.annotations,
      team: state => state.inputs.team,
      overview: state => state.inputs.overview
    }),
    reportAvailable () {
      return !_.isEmpty(this.annotations)
    }
  },
  watch: {
    team (team) {
      this.$router.push({ path: this.$route.path, query: { team } })
    }
  },
  created () {
    this.$router.push({ path: this.$route.path, query: { team: this.team } })
  },
  methods: {
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
    z-index: 999999;
    &__title {
      position: absolute;
      top: 0;
      width: 100%;
      left: 0;
      transform: translateY(calc(-100% - 10px));
    }
  }
}
</style>
