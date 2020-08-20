<template>
  <b-navbar>
    <b-navbar-brand />
    <b-breadcrumb :items="items" class="h2 mb-0" />
  </b-navbar>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default() {
        return [
          { text: 'Overview', href: '#overview' },
          { text: 'Digital Advertising', href: '#da' },
          { text: 'SEO', href: '#seo' },
          { text: 'Customer Care', href: '#cc' }
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
