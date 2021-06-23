<template>
  <b-input-group class="align-items-center flex-nowrap">
    <b-input-group-prepend class="text-muted small text-uppercase mr-2">
      Month
    </b-input-group-prepend>
    <b-pagination
      id="month-select"
      :value="month"
      total-rows="12"
      per-page="1"
      limit="3"
      size="sm"
      hide-goto-end-buttons
      hide-ellipsis
      class="mb-0"
      @input="onUpdate({ key: 'month', value: $event })"
    >
      <template #page="{ page }">
        {{ months[page].text }}
      </template>
    </b-pagination>
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
