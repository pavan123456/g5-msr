<template>
  <b-input-group class="flex-nowrap align-items-center">
    <b-input-group-prepend class="text-muted small text-uppercase mr-2">
      Year
    </b-input-group-prepend>
    <b-form-input
      id="year-select"
      :value="year"
      type="number"
      min="2015"
      style="max-width: 80px; border-radius: 5px; border-color: #e8e8e8;"
      @input="onUpdate({ key: 'year', value: $event })"
    />
  </b-input-group>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: mapState({
    year: state => state.inputs.year
  }),
  methods: mapActions({
    onUpdate: 'inputs/onUpdate'
  })
}
</script>

<style lang="scss" scoped>

</style>
