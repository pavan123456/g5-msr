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
        @input="onUpdate({ client: $event })"
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
        @input="onUpdate({ mode: $event })"
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
          [mode === 'Monthly' ? 'month' : 'period']: $event || null,
          period: null,
          month: null
        })"
      />
      <b-input-group-append>
        <b-btn
          :disabled="!isBareMinimum"
          size="sm"
          variant="quaternary-40"
          class="ml-2 py-2 px-3 font-weight-bold"
          style="border-radius: 13px; align-self: center;"
        >
          GO
          <!-- <b-icon-arrow-clockwise shift-h="0" shift-v="-1" /> -->
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
    >
      <b-icon-share-fill shift-h="-1" shift-v="-1" />
    </b-btn>
    <b-dropdown no-caret right variant="transparent">
      <template #button-content>
        <b-icon-three-dots-vertical />
      </template>
      <b-dropdown-text>
        Previously Shared Reports will appear here
      </b-dropdown-text>
    </b-dropdown>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  data () {
    return {
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
      year: state => state.inputs.year
    }),
    ...mapGetters({
      monthly: 'inputs/monthly',
      years: 'inputs/years',
      months: 'inputs/months',
      periods: 'inputs/periods'
    }),
    isBareMinimum () {
      return this.client !== null
    },
    getMonthOrPeriod () {
      return this.mode === 'Monthly' ? this.month : this.period
    },
    getMonthOrPeriodOptions () {
      return this.mode === 'Monthly' ? this.months : this.periods
    }
  },
  methods: {
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
