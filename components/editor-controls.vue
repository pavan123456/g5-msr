<template>
  <div class="d-flex align-items-center">
    <b-input-group
      class="d-flex flex-nowrap align-items-center mr-3"
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
        @input="onUpdate({ key: 'client', value: $event })"
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
    <b-input-group class="mr-2 align-items-center">
      <b-form-radio-group
        :checked="mode"
        :options="modes"
        size="sm"
        stacked
        @input="onUpdate({ key: 'mode', value: $event })"
      />
      <b-form-select
        :value="period"
        :options="periods"
        class="mx-1"
        style="border-radius: 11px; max-width: 150px;"
        @input="onUpdate({ key: 'period', value: $event })"
      />
      <b-form-select
        :value="year"
        :options="years"
        style="border-radius: 11px; max-width: 150px;"
        @input="onUpdate({ key: 'year', value: $event })"
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
    <div class="flex-grow-1" />
    <b-input-group>
      <b-form-radio-group
        :disabled="!isBareMinimum"
        :checked="team"
        :options="teams"
        buttons
        size="sm"
        class="spaced-btn"
        button-variant="outline-quaternary-10"
        @input="onUpdate({ key: 'team', value: $event })"
      />
    </b-input-group>
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
export default {
  computed: {
    team () { return this.$store.state.inputs.team },
    teams () { return this.$store.state.inputs.teams },
    client () { return this.$store.state.inputs.client },
    clients () { return this.$store.state.inputs.clients },
    mode () { return this.$store.state.inputs.mode },
    modes () { return this.$store.state.inputs.modes },
    months () { return this.$store.state.inputs.months },
    period () { return this.$store.state.inputs.period },
    periods () { return this.$store.state.inputs.periods },
    monthly () { return this.$store.getters.inputs.monthly },
    year () { return this.$store.state.inputs.year },
    years () { return this.$store.state.inputs.years },
    isBareMinimum () {
      return this.client !== null
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
</style>
