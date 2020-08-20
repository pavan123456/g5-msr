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
          label="name"
          track-by="urn"
          placeholder="Select a Client"
          @input="onUpdate({ key: 'client', value: $event })"
        />
      </b-input-group>
      <swap-wrapper />
      <year-input />
      <b-btn
        id="refresh-table-btn"
        class="px-2 ml-2"
        variant="primary-2"
        size="sm"
        @click="updateReport"
      >
        <b-icon-arrow-repeat :animation="isBusy ? 'spin' : ''" />
      </b-btn>
      <div style="width: 0; height: 100%; border-right: 2px solid #e8e8e8;" />
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
      <b-btn
        id="approve-btn"
        variant="outline-tertiary-2"
        size="sm"
        class="ml-2 px-4"
        @click="onUpdate({ key: 'isSubmitted', value: !isSubmitted })"
      >
        <b-icon-check-circle-fill v-if="isSubmitted" />
        <b-icon-check-circle v-else />
        {{ isSubmitted ? 'Approved' : 'Approve' }}
      </b-btn>
    </b-nav-form>
    <b-navbar-nav class="ml-auto">
      <b-nav-item-dropdown right>
        <template v-slot:text>
          <b-icon-person />
        </template>
        <b-dropdown-item to="/staged">
          Output Test
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
    teams: state => state.inputs.teams,
    isBusy: state => state.inputs.isBusy,
    isSubmitted: state => state.inputs.isSubmitted
  }),
  methods: {
    ...mapActions({
      onUpdate: 'inputs/onUpdate'
    }),
    updateReport() {
      if (this.client) {
        this.onUpdate({ key: 'isBusy', value: true })
        this.$emit('get-report', this.client.urn)
      }
    }
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
