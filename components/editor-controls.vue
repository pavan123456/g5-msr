<template>
  <div class="d-flex align-items-center">
    <b-input-group
      class="d-flex flex-nowrap align-items-center mr-2"
      style="max-width: 400px;"
    >
      <b-input-group-prepend class="font-weight-bold px-2 text-primary-70">
        Client
      </b-input-group-prepend>
      <vue-multiselect
        :value="client"
        :options="clients"
        style="border-radius: 11px;"
        placeholder="Search"
        track-by="urn"
        label="name"
        @input="onUpdate({ key: 'client', value: $event })"
      >
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
        :options="[]"
        class="mx-1"
        style="border-radius: 11px; max-width: 150px;"
      />
      <b-form-select
        :options="['2021', '2020']"
        style="border-radius: 11px; max-width: 150px;"
      />
      <b-input-group-append>
        <b-btn
          :disabled="!isBareMinimum"
          size="sm"
          variant="quaternary-40"
          class="ml-2"
          style="border-radius: 50%; align-self: center;"
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
      <b-dropdown-form>
        <b-btn variant="quaternary-10">
          Save Report and Share
        </b-btn>
      </b-dropdown-form>
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
    periods () { return this.$store.state.inputs.periods },
    monthly () { return this.$store.getters.inputs.monthly },
    isBareMinimum () {
      return this.client !== null
    },
    rangePicker () {
      return this.monthly ? this.months : this.periods
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

</style>
