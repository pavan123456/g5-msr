<template>
  <span class="swap mx-3">
    <transition name="slide-fade" mode="out-in">
      <month-picker v-if="showMonth" />
      <period-picker v-else />
    </transition>
    <b-btn
      :class="[{ 'range': showMonth }, 'swap-btn', 'p-0']"
      pill
      variant="transparent"
      @click="onUpdate({ key: 'monthly', value: !monthly })"
    >
      <b-icon-chevron-compact-up v-if="showMonth" variant="muted" />
      <b-icon-chevron-compact-down v-else variant="muted" />
    </b-btn>
  </span>
</template>

<script>
import MonthPicker from '~/components/month-picker'
import PeriodPicker from '~/components/period-picker'
export default {
  components: {
    MonthPicker,
    PeriodPicker
  },
  data () {
    return {
      showMonth: false
    }
  },
  computed: {
    monthly () {
      return this.$store.state.inputs.monthly
    }
  },
  methods: {
    onUpdate (payload) {
      this.showMonth = !this.showMonth
      this.$store.dispatch('inputs/onUpdate', payload)
    }
  }
}
</script>

<style lang="scss">
.swap {
  max-width: 300px;
  position: relative;
  &-btn {
    position: absolute;
    left: 0%;
    transform: translate(50%, -50%);
    &:focus {
      box-shadow: none;
    }
    &.range {
      transform: translate(50%, -150%);
    }
  }
}
</style>
