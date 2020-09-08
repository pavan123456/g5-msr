<template>
  <div class="centered">
    <b-card footer-class="justify-content-end border-0">
      <b-form-group label="Select a client" label-class="text-muted">
        <vue-multiselect
          :value="client"
          :options="clients"
          placeholder="Search"
          track-by="urn"
          label="name"
          @input="onUpdate({ key: 'client', value: $event })"
        >
          <template v-slot:option="{ option }">
            <b>
              {{ option.name }}
            </b>
            <p class="text-muted small mb-0">
              {{ option.brandedName }}
            </p>
            <p class="text-muted small mb-0">
              {{ option.urn }}
            </p>
          </template>
        </vue-multiselect>
      </b-form-group>
      <div class="d-flex justify-content-between mt-5">
        <swap-wrapper />
        <b-btn
          :disabled="!client"
          variant="outline-primary-3"
          size="sm"
          @click="generateReport"
        >
          <b-spinner v-if="isBusy" small />
          <span v-else>
            {{ status }}
          </span>
          Generate That Report...
        </b-btn>
      </div>
      <template v-slot:footer>
        <b-btn
          v-if="status"
          to="/edit"
          size="sm"
          variant="outline-primary-2"
        >
          View Generated Reports
        </b-btn>
      </template>
    </b-card>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import VueMultiselect from 'vue-multiselect'
import SwapWrapper from '~/components/swap-wrapper'
export default {
  components: {
    VueMultiselect,
    SwapWrapper
  },
  fetch({ store }) {
    store.dispatch('inputs/fillClients')
  },
  data() {
    return {
      isBusy: false,
      status: null
    }
  },
  computed: {
    ...mapState({
      monthly: state => state.inputs.monthly,
      client: state => state.inputs.client,
      clients: state => state.inputs.clients
    }),
    ...mapGetters({
      selectedDate: 'inputs/selectedDate',
      selectedQuarter: 'inputs/selectedQuarter'
    })
  },
  methods: {
    generateReport() {
      if (this.client && !this.monthly) {
        this.isBusy = true
        const { from, to } = this.selectedQuarter
        this.$axios
          .$post(`api/v1/report/${this.client.urn}?from=${from}&to=${to}`)
          .then((status) => {
            this.status = status
          })
          .finally(() => {
            this.isBusy = false
          })
      }
    },
    ...mapActions({
      onUpdate: 'inputs/onUpdate'
    })
  }
}
</script>

<style>
.centered {
  position: fixed;
  width: 50vw;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
