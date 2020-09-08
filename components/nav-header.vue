<template>
  <b-navbar
    class="primary-nav dangle-anchor justify-content-between"
    style="box-shadow: inset 0 -2px 0 0 #e8e8e8;"
  >
    <b-navbar-brand
      to="/"
      class="h1 my-0"
      style="font-size: 2rem;"
    >
      <b-img-lazy src="/g5-primary-logo.png" height="45" />
      M.S.R.
    </b-navbar-brand>
    <b-nav-text class="align-self-start p-0">
      <h2 class="mb-0 text-truncate">
        {{ client.name }}
      </h2>
      <div class="text-muted text-uppercase small mb-0">
        From
        <b-badge class="px-3" style="font-size: 0.75rem;" variant="pale">
          {{ client.from }}
        </b-badge>
        To
        <b-badge class="px-3" style="font-size: 0.75rem;" variant="pale">
          {{ client.to }}
        </b-badge>
      </div>
    </b-nav-text>
    <b-nav-form>
      <b-input-group class="flex-nowrap align-items-center">
        <b-input-group-prepend class="px-2 text-muted text-uppercase small">
          View
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
    client: {
      type: Object,
      default() {
        return {
          name: 'Fallback Client Name',
          to: 'to date',
          from: 'from date'
        }
      }
    },
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
</style>
