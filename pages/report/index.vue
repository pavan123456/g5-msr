<template>
  <div>
    <alert />
    <nav-header v-bind="{ hideHamburger }">
      <b-list-group class="flex-row align-items-center mx-3">
        <b-list-group-item
          v-for="(item, i) in items"
          :key="item.text"
          class="p-0 mr-1 border-0 bg-transparent"
        >
          <b-btn
            :href="item.href"
            variant="secondary-70"
            class="px-3 m-0 text-uppercase nav-btn font-weight-bold"
            style="border-radius: 11px; box-shadow: 0 2px 2px rgba(5, 5, 5, 0.5);"
            size="sm"
            @click="move(i)"
          >
            {{ item.text }}
          </b-btn>
        </b-list-group-item>
      </b-list-group>
    </nav-header>
    <b-progress
      :value="position"
      class="w-100 mb-0 rounded-0"
      variant="quinary"
      height="3px"
    />
    <div
      ref="scrollContainer"
      class="scroll-container"
      @scroll="onScroll"
    >
      <div class="inset-controls bg-quaternary">
        <b-card class="inset-controls__card">
          <h1 class="text-white text-uppercase font-weight-bold inset-controls__card__title">
            {{ clientName }}
          </h1>
          <b-dropdown right variant="transparent">
            <template #button-content>
              <span class="font-weight-bold">
                FROM
              </span>
              {{ selectedReport.from }}
              <span class="font-weight-bold">
                TO
              </span>
              {{ selectedReport.to }}
            </template>
            <b-dropdown-item
              v-for="(report, index) in clientReports.filter(report => report.reportId !== selectedReportId)"
              :key="`${report}-${index}`"
              target="_blank"
              @click="selectedReportId = report.reportId"
            >
              <span class="text-uppercase font-weight-bold">
                From:
              </span>
              {{ report.from }}
              <span class="text-uppercase font-weight-bold">
                To:
              </span>
              {{ report.to }}
            </b-dropdown-item>
          </b-dropdown>
          <b-btn
            :disabled="!selectedReportId"
            size="sm"
            variant="quaternary-40"
            class="ml-2 py-2 px-3 font-weight-bold"
            style="border-radius: 13px; align-self: center;"
            @click="getReport"
          >
            <span v-if="!loading">GO</span>
            <b-icon-arrow-clockwise v-else animation="spin" />
          </b-btn>
        </b-card>
      </div>
      <b-container style="margin-top: 60px;" class="px-0">
        <b-row
          v-for="(s, i) in sections"
          :key="`${s.text}-${i}`"
          class="pt-1"
        >
          <b-col v-if="s.text === 'Overview'">
            <b-card
              class="my-1"
              border-variant="quaternary-10"
              style="border-radius: 13px; box-shadow: 0 2px 8px rgba(31, 40, 137, 0.2);"
            >
              <b-card-header class="p-0 border-0 bg-white">
                <h2
                  :id="s.id"
                  class="font-weight-bold text-uppercase"
                >
                  {{ s.text }}
                </h2>
              </b-card-header>
              <heatmap-overview-chart :chart="s.chart" />
            </b-card>
          </b-col>
          <b-col v-else>
            <b-card
              class="my-1 px-2"
              border-variant="quaternary-10"
              style="border-radius: 13px; box-shadow: 0 2px 8px rgba(31, 40, 137, 0.2);"
            >
              <b-card-header class="p-0 border-0 bg-white">
                <h2
                  :id="s.id"
                  class="font-weight-bold text-uppercase"
                >
                  {{ s.text }}
                </h2>
              </b-card-header>
              <b-row v-if="s.overview.length > 0" class="my-3 pt-2">
                <b-col>
                  <team-overview-chart :charts="s.overview" />
                </b-col>
              </b-row>
              <b-row v-if="s.timeline.length > 0" class="h-divider my-5 pt-3">
                <b-col>
                  <timeline-chart :chart="s.timeline" />
                </b-col>
              </b-row>
              <b-row v-if="Object.keys(s.promoted).length > 0" class="h-divider my-5 pt-3">
                <b-col class="pt-3">
                  <promoted-notes :notes="s.promoted" />
                </b-col>
              </b-row>
            </b-card>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import QueryParams from '~/mixins/query-params'
import { createSections, getReportById, getFormattedOverview, clientReportsById } from '~/mixins/report-api'
export default {
  mixins: [QueryParams],
  async asyncData ({ route, $axios, store, error }) {
    try {
      const { reportId } = route.query
      if (!reportId) throw new Error('missing report id')
      const clientReports = await clientReportsById(reportId)
      const { teams, notes, overview, clientName } = await getReportById(reportId)
      const formattedOverview = getFormattedOverview(overview)
      const sections = createSections(notes, formattedOverview, teams)
      store.dispatch('inputs/onUpdate', { sections, clientReports })
      return {
        selectedReportId: reportId,
        clientName
      }
    } catch (e) {
      error(e)
    }
  },
  data () {
    return {
      loading: false,
      items: [
        { text: 'Overview', href: '#overview' },
        { text: 'Digital Advertising', href: '#da' },
        { text: 'SEO', href: '#seo' },
        { text: 'Customer Care', href: '#cc' }
      ],
      progress: 0,
      hideHamburger: true
    }
  },
  computed: {
    selectedReport () {
      return this.clientReports.find(report => report.reportId === this.selectedReportId)
    },
    position () { return `${Math.round(this.progress * 100)}%` },
    ...mapState({
      sections: state => state.inputs.sections,
      clientReports: state => state.inputs.clientReports
    })
  },
  methods: {
    ...mapActions({
      setAlert: 'alert/setAlert'
    }),
    async getReport () {
      try {
        this.loading = true
        const { teams, notes, overview } = await getReportById(this.selectedReportId)
        const formattedOverview = getFormattedOverview(overview)
        const sections = createSections(notes, formattedOverview, teams)
        this.$store.dispatch('inputs/onUpdate', { sections })
        this.updateQueryParams({ reportId: this.selectedReportId })
      } catch (e) {
        this.setAlert({
          alertMsg: 'Error Loading Data',
          includeRefreshLink: true,
          alertVariant: 'error',
          alertEnabled: true
        })
      } finally {
        this.loading = false
      }
    },
    onScroll () {
      const progress = this.$refs.scrollContainer.scrollTop / (this.$refs.scrollContainer.scrollHeight - this.$refs.scrollContainer.clientHeight)
      if (progress > 1) {
        this.progress = 1
      } else if (progress < 0) {
        this.progress = 0
      } else {
        this.progress = progress
      }
    },
    move (index) {
      if (index < 0) {
        this.progress = 0
      } else if (index > this.items.length - 1) {
        this.progress = this.items.length - 1
      } else {
        this.progress = index
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
.h-divider {
  border-top: 2px dotted var(--quaternary-20);
}
.progress-bar {
  background: linear-gradient(35deg, var(--quinary), var(--secondary-30), var(--quaternary-60));
}
.scroll-container {
  overflow: scroll;
  max-height: calc(100vh - 100px);
}

</style>
