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
      <b-input-group class="flex-nowrap align-items-center ml-3">
        <b-input-group-prepend class="px-2 text-muted text-uppercase small">
          Approvals
        </b-input-group-prepend>
        <b-btn-group>
          <b-btn
            v-for="a in approvals"
            :key="a.id"
            :variant="a.value ? 'success' : 'outline-failure-1'"
            size="sm"
            class="approval-btn"
            @click="updateReport(a, approvals)"
          >
            {{ a.name }}
            <b-spinner v-if="pending[a.id]" small />
            <b-icon-check-circle v-else />
          </b-btn>
        </b-btn-group>
      </b-input-group>
    </b-nav-form>
    <slot name="dangle" />
  </b-navbar>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  props: {
    approvals: {
      type: Array,
      default() {
        return [
          { name: 'Digital Advertising', id: 'da', value: false },
          { name: 'SEO', id: 'seo', value: false },
          { name: 'Customer Care', id: 'cc', value: true }
        ]
      }
    }
  },
  data () {
    return {
      pending: {
        da: false,
        cc: false,
        seo: false
      }
    }
  },
  computed: mapState({
    team: state => state.inputs.team,
    teams: state => state.inputs.teams
  }),
  methods: {
    ...mapActions({
      onUpdate: 'inputs/onUpdate'
    }),
    updateReport(evt, allApprovals) {
      allApprovals.find(obj => obj.id === evt.id).value = !evt.value
      if (evt) {
        this.pending[evt.id] = true
        this.$axios
          .$put(`api/v1/report/${this.$route.params.reportId}`, {
            approvals: allApprovals
          }).then((res) => {
            this.pending[evt.id] = false
          }).catch((err) => {
            // eslint-disable-next-line no-console
            console.error(err)
            this.pending[evt.id] = false
          })
      }
    }
  }
}
</script>

<style lang="scss">
.dangle-anchor {
  position: relative;
}
.approval-btn:focus  {
  outline: none;
  box-shadow: none;
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
