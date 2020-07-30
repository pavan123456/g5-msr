<template>
  <span class="swap mx-3">
    <transition name="slide-fade" mode="out-in">
      <month-picker v-if="range" />
      <period-picker v-else />
    </transition>
    <b-btn
      :class="[{ 'range': range }, 'swap-btn', 'p-0']"
      pill
      variant="transparent"
      @click="range = !range"
    >
      <b-icon-chevron-compact-up v-if="range" variant="muted" />
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
  data() {
    return {
      range: true
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
