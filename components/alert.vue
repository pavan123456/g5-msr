<template>
  <div>
    <b-alert
      v-if="!countDownAlert"
      :show="alertEnabled"
      :variant="alertVariant"
      class="global-alert"
      dismissible
      fade
      @dismissed="resetAlert()"
    >
      <error-link v-bind="{ msg: alertMsg, includeRefreshLink }" />
    </b-alert>
    <b-alert
      v-else
      :show="dismissCountDown"
      :variant="alertVariant"
      class="global-alert"
      dismissible
      fade
      @dismiss-count-down="countDownChanged"
      @dismissed="resetAlert()"
    >
      <error-link v-bind="{ msg: alertMsg, includeRefreshLink }" />
    </b-alert>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState({
      alertMsg: state => state.alert.alertMsg,
      includeRefreshLink: state => state.alert.includeRefreshLink,
      alertVariant: state => state.alert.alertVariant,
      alertEnabled: state => state.alert.alertEnabled,
      countDownAlert: state => state.alert.countDownAlert,
      dismissSecs: state => state.alert.dismissSecs,
      dismissCountDown: state => state.alert.dismissCountDown
    })
  },
  methods: {
    ...mapActions({
      setAlert: 'alert/setAlert',
      resetAlert: 'alert/resetAlert'
    }),
    countDownChanged (dismissCountDown) {
      this.setAlert({ key: 'dismissCountDown', val: dismissCountDown })
    }
  }
}
</script>

<style >
 .global-alert {
  position: fixed;
  top: 3.5em;
  left: 50%;
  z-index: 9999;
  border-radius: 20px;
  box-shadow: -0.25em 0.25em 20px rgba(10, 10, 10, 0.25);
 }
 .alert-dismissable .close {
    padding: 0.75rem 1.25rem !important;
}
</style>
