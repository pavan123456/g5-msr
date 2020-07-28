<template>
  <b-navbar variant="light" class="primary-nav dangle-anchor">
    <b-navbar-brand to="/" class="h1 mb-0">
      <b-img-lazy src="/g5-primary-logo.png" height="45" />
      Managed Services
    </b-navbar-brand>
    <b-nav-form class="w-100" style="justify-content: space-around;">
      <b-input-group style="flex-wrap: nowrap; align-items: center;">
        <b-input-group-prepend class="px-2 text-muted text-uppercase small">
          Client
        </b-input-group-prepend>
        <vue-multiselect
          id="client-select"
          :value="client"
          :options="clients"
          placeholder="Select a Client"
          @input="onUpdate({ key: 'client', value: $event })"
        />
      </b-input-group>
      <b-input-group style="flex-wrap: nowrap; align-items: center;" class="mx-2">
        <b-input-group-prepend class="px-2 text-muted text-uppercase small">
          Quarter
        </b-input-group-prepend>
        <b-form-radio-group
          id="period-select"
          :checked="period"
          :options="periods"
          buttons
          button-variant="primary-1"
          class="mx-2"
          @input="onUpdate({ key: 'period', value: $event })"
        />
      </b-input-group>
    </b-nav-form>
    <b-navbar-nav class="ml-auto">
      <b-nav-item-dropdown right>
        <template v-slot:text>
          <b-icon-person />
        </template>
        <b-dropdown-item to="/staged">
          Colors
        </b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
    <slot name="dangle" />
  </b-navbar>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import VueMultiselect from 'vue-multiselect'
export default {
  components: {
    VueMultiselect
  },
  computed: mapState({
    client: state => state.inputs.client,
    clients: state => state.inputs.clients,
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

<style>
.primary-nav {
  border-bottom: 2px solid #e8e8e8;
}
.dangle-anchor {
  position: relative;
}
</style>
