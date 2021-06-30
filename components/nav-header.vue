<template>
  <b-navbar toggleable="lg" class="justify-content-between bg-primary-70 py-2" type="dark" fixed="true">
    <b-navbar-brand to="/" class="h1 my-0 text-white font-weight-bold text-uppercase">
      <b-img-lazy src="/g5-logo-white.png" height="40" class="mr-2" />
      <b-icon-journal-check scale="1.2em" class="mr-1" />
      Activity Tracker
    </b-navbar-brand>
  </b-navbar>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  props: {
    client: {
      type: Object,
      default () {
        return {
          name: 'Fallback Client Name',
          to: 'to date',
          from: 'from date'
        }
      }
    },
    approvals: {
      type: Array,
      default () {
        return [
          { name: 'Digital Advertising', id: 'da', value: false },
          { name: 'SEO', id: 'seo', value: false },
          { name: 'Customer Care', id: 'cc', value: true }
        ]
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
    updateReport (evt, allApprovals) {
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
