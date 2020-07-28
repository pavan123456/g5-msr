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
        'secondary',
        'secondary-0',
        'secondary-1',
        'tertiary',
        'tertiary-0',
        'tertiary-1',
        'tertiary-2',
        'tertiary-3',
        'tertiary-4',
        'quaternary',
        'quaternary-0',
        'quaternary-1',
        'quaternary-2',
        'quaternary-3',
        'success',
        'success-0',
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
