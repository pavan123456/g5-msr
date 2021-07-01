<template>
  <span
    class="mr-3"
  >
    {{ msg }}
    <b-link
      v-if="includeRefreshLink"
      :href="$route.fullPath"
      class="text-error"
      style="text-decoration: underline;"
    >
      Click To Refresh Page
    </b-link>
  </span>
</template>

<script>
export default {
  props: {
    msg: {
      type: String,
      default () {
        return 'Error Saving:'
      }
    },
    includeRefreshLink: {
      type: Boolean,
      default () {
        return true
      }
    }
  }
}
</script>
