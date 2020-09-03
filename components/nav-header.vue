<template>
  <b-navbar variant="white" class="primary-nav dangle-anchor justify-content-between">
    <b-navbar-brand
      to="/"
      class="h1 my-0"
      style="font-size: 2rem;"
    >
      <b-img-lazy src="/g5-primary-logo.png" height="45" />
      <div class="initial">
        <span class="initialism m">
          M
        </span>
        <span class="initialism s">
          S
        </span>
        <span class="initialism r">
          R
        </span>
      </div>
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
      <!-- <label class="px-2 text-muted text-uppercase small">
        Team
      </label>
      <b-input-group
        v-for="(t, i) in teams"
        :key="i"
        class="flex-nowrap align-items-stretch mr-2"
      >
        <b-form-radio
          :checked="t.isSelected"
          button
          size="sm"
          button-variant="outline-primary-2"
          @input="beforeUpdate({ id: t.id, prop: 'isSelected' })"
        >
          {{ t.text }}
        </b-form-radio>
        <b-input-group-append>
          <b-btn
            :variant="approvals[t] ? 'success': 'quaternary-3'"
            class="py-0 px-2"
            @click="$emit('approved', { evt: $event, t, approvals: approvals[t] })"
          >
            <b-icon-check-circle-fill v-if="approvals[t]" />
            <b-icon-check-circle v-else />
          </b-btn>
        </b-input-group-append>
      </b-input-group> -->
    </b-nav-form>
    <slot name="dangle" />
  </b-navbar>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  props: {
    approvals: {
      type: Object,
      default() {
        return {
          da: false,
          seo: false,
          cc: true
        }
      }
    }
  },
  computed: mapState({
    team: state => state.inputs.team,
    teams: state => state.inputs.teams,
    isBusy: state => state.inputs.isBusy,
    isSubmitted: state => state.inputs.isSubmitted
  }),
  methods: {
    ...mapActions({
      onUpdate: 'inputs/onUpdate',
      onNested: 'inputs/onNested'
    }),
    beforeUpdate(evt) {
      this.$emit('before-update', { id: evt.id, prop: evt.prop })
      this.onNested({
        id: evt.id,
        prop: evt.prop,
        value: true
      })
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
.initialism {
  display: inline;
  &::after {
    width: 0;
    overflow: hidden;
    display: inline-block;
    font-size: 0.75em;
    vertical-align: middle;
    text-transform: lowercase;
    transition: 200ms linear;
  }
  &.m::after {
    content: 'anaged';
  }
  &.s::after {
    content: 'ervice';
  }
  &.r::after {
    content: 'eport';
  }
}
.initial {
  display: inline;
  &:hover .initialism::after {
    width: 20%;
    transform: translateX(-10%);
  }
}
</style>
