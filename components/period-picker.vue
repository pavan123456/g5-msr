<template>
  <b-input-group style="flex-wrap: nowrap; align-items: center;" class="mr-2">
    <b-input-group-prepend class="px-2 text-muted text-uppercase small">
      Quarter
    </b-input-group-prepend>
    <b-form-radio-group
      id="period-select"
      :checked="period"
      :options="periods"
      buttons
      button-variant="primary-5"
      class="mx-2"
      size="sm"
      @input="onUpdate({ key: 'period', value: $event })"
    />
  </b-input-group>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: mapState({
    period: state => state.inputs.period,
    periods: state => state.inputs.periods
  }),
  methods: {
    ...mapActions({
      onUpdate: 'inputs/onUpdate'
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
