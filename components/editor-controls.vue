<template>
  <div class="d-flex align-items-center">
    <b-input-group
      class="d-flex flex-nowrap align-items-center"
      style="max-width: 400px;"
    >
      <b-input-group-prepend class="px-2 text-primary-70">
        Client
      </b-input-group-prepend>
      <vue-multiselect
        :value="client"
        :options="clients"
        placeholder="Search"
        track-by="urn"
        label="name"
        @input="onClientUpdate($event)"
      >
        <template #single-label="{ props }">
          {{ props.name }}
        </template>
        <template #option="{ option }">
          <b>
            {{ option.name }}
          </b>
          <p class="text-muted small mb-0">
            {{ option.brandedName }}
          </p>
          <p class="text-muted small mb-0">
            {{ option.urn }}
          </p>
        </template>
      </vue-multiselect>
    </b-input-group>
    <div class="v-divider" />
    <b-input-group class="flex-grow-0 align-items-center px-3">
      <b-form-radio-group
        :checked="mode"
        :options="modes"
        size="sm"
        stacked
        @input="onUpdate({ mode: $event, period: null, month: null })"
      />
      <b-form-select
        :value="year"
        :options="years"
        style="max-width: 150px;"
        @input="onUpdate({ year: $event, period: null, month: null })"
      />
      <b-form-select
        :value="getMonthOrPeriod"
        :options="getMonthOrPeriodOptions"
        class="mx-1"
        style="max-width: 150px;"
        @input="onUpdate({
          [mode === 'Monthly' ? 'month' : 'period']: $event || null
        })"
      />
      <b-input-group-append>
        <b-btn
          :disabled="!isBareMinimum"
          size="sm"
          variant="quaternary-40"
          class="ml-2 py-2 px-3 font-weight-bold"
          style="border-radius: 13px; align-self: center;"
          @click="getReport"
        >
          <span v-if="!loading">GO</span>
          <b-icon-arrow-clockwise v-else animation="spin" />
        </b-btn>
      </b-input-group-append>
    </b-input-group>
    <div class="v-divider flex-grow-1" />
    <b-input-group class="justify-content-center">
      <b-form-radio-group
        :disabled="!isBareMinimum"
        :checked="team"
        :options="teams"
        buttons
        size="sm"
        class="spaced-btn"
        button-variant="outline-quaternary-10"
        @input="onUpdate({ team: $event })"
      />
    </b-input-group>
    <div class="v-divider flex-grow-1" />
    <b-btn
      :disabled="!isBareMinimum"
      variant="quaternary-40"
      size="sm"
      style="border-radius: 50%;"
      @click="generateReport"
    >
      <b-icon-share-fill v-if="!createLoading" shift-h="-1" shift-v="-1" />
      <b-icon-arrow-clockwise v-else animation="spin" />
    </b-btn>
    <b-dropdown no-caret right variant="transparent">
      <template #button-content>
        <b-icon-three-dots-vertical />
      </template>
      <b-dropdown-item
        target="_blank"
        :href="editNotesLink"
      >
        Edit Notes
        <b-icon-link45deg />
      </b-dropdown-item>
      <b-dropdown-divider />
      <b-dropdown-text v-if="clientReports.length === 0">
        {{ client ? 'Previously Shared Reports Will Appear Here' : 'Select Client to View Previously Shared Reports' }}
      </b-dropdown-text>
      <b-dropdown-item
        v-for="(report, index) in clientReports"
        v-else
        :key="`${report}-${index}`"
        target="_blank"
        :href="`/report?reportId=${report.reportId}`"
      >
        <span class="text-uppercase font-weight-bold">
          From:
        </span>
        {{ report.from }}
        <span class="text-uppercase font-weight-bold">
          To:
        </span>
        {{ report.to }}
        <b-icon-link45deg />
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import ReportApi from '~/mixins/report-api'
export default {
  mixins: [ReportApi],
  data () {
    return {
      loading: false,
      createLoading: false
    }
  },
  computed: {
    ...mapState({
      team: state => state.inputs.team,
      teams: state => state.inputs.teams,
      client: state => state.inputs.client,
      clients: state => state.inputs.clients,
      mode: state => state.inputs.mode,
      modes: state => state.inputs.modes,
      availableReports: state => state.inputs.availableReports,
      period: state => state.inputs.period,
      month: state => state.inputs.month,
      year: state => state.inputs.year,
      clientReports: state => state.inputs.clientReports
    }),
    ...mapGetters({
      monthly: 'inputs/monthly',
      years: 'inputs/years',
      months: 'inputs/months',
      periods: 'inputs/periods',
      selectedDate: 'inputs/selectedDate',
      selectedQuarter: 'inputs/selectedQuarter'
    }),
    isBareMinimum () {
      const client = !!(this.client)
      const range = this.mode === 'Monthly'
        ? !!(this.selectedDate)
        : !!(this.selectedQuarter)
      return client && range
    },
    getMonthOrPeriod () {
      return this.mode === 'Monthly' ? this.month : this.period
    },
    getMonthOrPeriodOptions () {
      return this.mode === 'Monthly' ? this.months : this.periods
    },
    editNotesLink () {
      let link = 'https://notes.g5marketingcloud.com/'
      const client = this.client ? this.client.urn : null
      const range = this.mode === 'Monthly'
        ? this.selectedDate
        : this.selectedQuarter

      const needsQueryParams = !!(client || range)
      if (needsQueryParams) {
        const fromDate = range && range.from ? range.from : null
        const toDate = range && range.to ? range.to : null
        link = this.buildDynamicLink(client, fromDate, toDate, link)
      }
      return link
    }
  },
  methods: {
    ...mapActions({
      setAlert: 'alert/setAlert'
    }),
    buildDynamicLink (client, fromDate, toDate, domain) {
      return Object.entries({ client, fromDate, toDate }).reduce((acc, curr, idx) => {
        const seperator = idx === 0 ? '' : '&'
        return curr[1] ? `${acc}${seperator}${curr[0]}=${curr[1]}` : acc
      }, `${domain}?`)
    },
    onClientUpdate (client) {
      if (client && client.urn) {
        this.$axios.$get(`api/v1/reports/client/${client.urn}`)
          .then(clientReports => this.onUpdate({ client, clientReports }))
          .catch((e) => {
            this.setAlert({
              alertMsg: e.message,
              includeRefreshLink: true,
              alertVariant: 'error',
              alertEnabled: true
            })
          })
      } else {
        this.onUpdate({ client, clientReports: [] })
      }
    },
    async generateReport () {
      try {
        this.createLoading = true
        const { from, to } = this.mode === 'Monthly' ? this.selectedDate : this.selectedQuarter
        const { reportId } = await this.$axios.$post(`api/v1/reports/client/${this.client.urn}?from=${from}&to=${to}`)
        this.$copyText(`${window.location.origin}/report?reportId=${reportId}`)
        this.setAlert({
          alertMsg: 'Client report link copied to your clipboard!',
          includeRefreshLink: false,
          alertVariant: 'success',
          alertEnabled: true,
          dismissCountDown: 5,
          countDownAlert: true
        })
      } catch (e) {
        this.setAlert({
          alertMsg: 'Error Loading Data',
          includeRefreshLink: true,
          alertVariant: 'error',
          alertEnabled: true
        })
      } finally {
        this.createLoading = false
      }
    },
    async getReport () {
      try {
        this.loading = true
        const clientUrn = this.client.urn
        const { from, to } = this.mode === 'Monthly' ? this.selectedDate : this.selectedQuarter
        const { overview, teams, notes } = await this.getReportByClient(clientUrn, to, from)
        const annotations = this.getFormattedAnnotations(notes, teams)
        const formattedOverview = this.getFormattedOverview(overview)
        this.onUpdate({ annotations, overview: formattedOverview })
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
    onUpdate (evt) {
      this.$store.dispatch('inputs/onUpdate', evt)
    }
  }
}
</script>

<style lang="scss">
.spaced-btn > label {
  margin-right: 0.5rem;
  border-radius: 13px !important;
  padding: 0.35rem 0.5rem !important;
}
.dropdown-menu {
  min-width: 30rem;
  border-color: var(--quaternary-20);
  border-radius: 13px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
.v-divider {
  align-self: stretch;
  border-left: 2px dotted var(--gray-40);
  margin: 0 0.5rem;
}
</style>
