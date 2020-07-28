<template>
  <b-card-group columns>
    <b-card
      v-for="c in colors"
      :key="c"
      :bg-variant="c"
      :footer="c"
      footer-bg-variant="transparent"
      footer-text-variant="light small"
      footer-class="f rounded-0 m-0"
      class="my-2 rounded-0"
    />
  </b-card-group>
</template>

<script>
export default {
  data() {
    return {
      colors: [
        'primary',
        'primary-1',
        'primary-2',
        'primary-3',
        'primary-4',
        'primary-5',
        'primary-6',
        'primary-7',
        'secondary',
        'tertiary',
        'tertiary-0',
        'tertiary-1',
        'tertiary-2',
        'quaternary',
        'quaternary-0',
        'success',
        'neutral',
        'darker',
        'pale'
      ]
    }
  }
}
</script>

<style>
.f {
  border: none;
}
</style>
