<template>
  <div v-if="loading" class="centered">
    <b-iconstack>
      <b-icon-emoji-dizzy />
      <b-icon-arrow-repeat animation="spin" />
    </b-iconstack>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false
    }
  },
  methods: {
    start() {
      this.loading = true
    },
    finish() {
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.centered {
  position: fixed;
  z-index: 9999;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 6em;
}
</style>
