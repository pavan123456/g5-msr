<template>
  <b-navbar variant="white" class="primary-nav dangle-anchor">
    <b-navbar-brand to="/" class="h1 my-0 pr-3" style="font-size: 2rem; border-right: 2px solid #e8e8e8;">
      <b-img-lazy src="/g5-primary-logo.png" height="45" />
      🦧.🐳.🐝.
    </b-navbar-brand>
    <b-nav-form class="w-100">
      <b-input-group style="flex-wrap: nowrap; align-items: center;">
        <b-input-group-prepend class="px-2 text-muted text-uppercase small">
          Client
        </b-input-group-prepend>
        <vue-multiselect
          id="client-select"
          :value="client"
          :options="clients"
          :custom-label="c => c.name"
          placeholder="Select a Client"
          @input="onUpdate({ key: 'client', value: $event })"
        />
      </b-input-group>
      <b-input-group class="flex-nowrap align-items-center">
        <b-input-group-prepend class="px-2 text-muted text-uppercase small">
          Team
        </b-input-group-prepend>
        <b-form-radio-group
          :checked="team"
          :options="teams"
          buttons
          size="sm"
          button-variant="outline-primary-2"
          @input="onUpdate({ key: 'team', value: $event })"
        />
      </b-input-group>
      <swap-wrapper />
      <year-input />
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
import SwapWrapper from '~/components/swap-wrapper'
import YearInput from '~/components/year-select'
export default {
  components: {
    SwapWrapper,
    YearInput,
    VueMultiselect
  },
  computed: mapState({
    client: state => state.inputs.client,
    clients: state => state.inputs.clients,
    team: state => state.inputs.team,
    teams: state => state.inputs.teams
  }),
  methods: {
    ...mapActions({
      onUpdate: 'inputs/onUpdate'
    })
  }
}
</script>

<style lang="scss">
.primary-nav {
  border-bottom: 2px solid #e8e8e8;
}
.dangle-anchor {
  position: relative;
}
</style>
