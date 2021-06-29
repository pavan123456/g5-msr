<template>
  <b-navbar
    class="primary-nav dangle-anchor justify-content-between"
    style="box-shadow: inset 0 -2px 0 0 #e8e8e8;"
  >
    <b-navbar-brand
      to="/"
      class="h1 my-0"
    >
      <b-img-lazy src="/g5-primary-logo.png" height="35" class="mr-2" />
      <b-icon-alarm />
      Activity Tracker
    </b-navbar-brand>
    <b-nav-text class="d-flex justify-content-between p-0">
      <b-form-group>
        <vue-multiselect :options="[]" />
      </b-form-group>
      <b-form-group>
        <b-form-datepicker />
      </b-form-group>
    </b-nav-text>
    <b-nav-form>
      <b-input-group class="flex-nowrap align-items-center">
        <b-form-radio-group
          :checked="team"
          :options="teams"
          buttons
          size="sm"
          button-variant="outline-primary-20"
          @input="onUpdate({ key: 'team', value: $event })"
        />
      </b-input-group>
    </b-nav-form>
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
