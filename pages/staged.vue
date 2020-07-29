<template>
  <b-container class="py-5">
    <b-row>
      <b-col>
        <h1>
          <span class="text-primary">M</span><span class="text-primary-1">a</span><span class="text-primar-2">n</span><span class="text-primary-3">a</span><span class="text-primary-4">g</span><span class="text-primary-5">e</span><span class="text-primary-6">d</span>
          <span class="text-secondary">S</span><span class="text-success-0">e</span><span class="text-tertiary-1">r</span><span class="text-quaternary-3">v</span><span class="text-tertiary-0">i</span><span class="text-quaternary-3">c</span><span class="text-secondary">e</span><span class="text-secondary">s</span>
        </h1>
        <p>
          Default paragraph font
        </p>
        <month-picker />
        <placeholder />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Placeholder from '~/components/placeholder'
import MonthPicker from '~/components/month-picker'
export default {
  components: {
    MonthPicker,
    Placeholder
  }
}
</script>

<style>

</style>
