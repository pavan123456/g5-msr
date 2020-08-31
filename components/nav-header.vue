<template>
  <b-navbar variant="white" class="primary-nav dangle-anchor">
    <b-navbar-brand
      to="/"
      class="h1 my-0 pr-3"
      style="font-size: 2rem; border-right: 2px solid #e8e8e8;"
    >
      <b-img-lazy src="/g5-primary-logo.png" height="45" />
      App Name?
    </b-navbar-brand>
    <b-nav-form>
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
    <slot name="dangle" />
  </b-navbar>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: mapState({
    team: state => state.inputs.team,
    teams: state => state.inputs.teams,
    isBusy: state => state.inputs.isBusy,
    isSubmitted: state => state.inputs.isSubmitted
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
