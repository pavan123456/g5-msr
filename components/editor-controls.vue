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
    <b-input-group class="mr-2">
      <b-input-group-prepend class="d-flex align-items-center">
        <b-form-radio-group
          :value="'Quaterly'"
          :options="['Quaterly', 'Monthly']"
          size="sm"
        />
      </b-input-group-prepend>
      <b-form-select
        :options="['Q3 2020', 'Jan 2020']"
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
          <b-icon-arrow-clockwise shift-h="0" shift-v="-1" />
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
    isBareMinimum () {
      return this.client
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
.custom-control-label {
  font-weight: 700;
  // text-transform: uppercase;
}
</style>
