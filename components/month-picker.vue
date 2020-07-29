<template>
  <b-input-group class="align-items-center flex-nowrap">
    <b-input-group-prepend class="text-muted small text-uppercase mr-2">
      Month
    </b-input-group-prepend>
    <b-form-radio-group
      id="month-radio"
      :value="month"
      :options="months"
      buttons
      button-variant="primary-1"
      size="sm"
      @input="onUpdate({ key: 'month', value: $event })"
    />
  </b-input-group>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: mapState({
    month: state => state.inputs.month,
    months: state => state.inputs.months
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
