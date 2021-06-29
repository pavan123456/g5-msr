<template>
  <div class="d-flex align-items-center">
    <b-input-group class="d-flex flex-nowrap align-items-center mr-2" style="width: 400px;">
      <b-input-group-prepend class="font-weight-bold px-2 text-primary-70">
        Client
      </b-input-group-prepend>
      <b-form-select style="border-radius: 11px;" :options="[]" />
    </b-input-group>
    <b-form-radio-group buttons size="sm" :options="['Quaterly', 'Monthly']" class="mr-2" />
    <b-input-group style="max-width: 150px;" class="flex-grow-1 mr-2">
      <b-form-select style="border-radius: 11px;" :options="['Q3 2020', 'Jan 2020']" />
    </b-input-group>
    <b-form-radio-group
      :checked="team"
      :options="teams"
      buttons
      size="sm"
      button-variant="outline-quaternary"
      @input="onUpdate({ key: 'team', value: $event })"
    />
    <b-dropdown no-caret right variant="transparent">
      <template #button-content>
        <b-icon-three-dots-vertical />
      </template>
      <b-dropdown-form>
        other options
      </b-dropdown-form>
    </b-dropdown>
  </div>
</template>

<script>
export default {
  computed: {
    team () { return this.$store.state.inputs.team },
    teams () { return this.$store.state.inputs.teams }
  },
  methods: {
    onUpdate (evt) {
      this.$store.dispatch('inputs/onUpdate', evt)
    }
  }
}
</script>

<style>

</style>
