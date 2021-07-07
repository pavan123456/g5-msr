<template>
  <div>
    <nav-header />
    <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);">
      <span v-if="error.statusCode === 404">
        <h1 style="font-size: 10em; font-weight: 700; line-height: 0.75;">
          Well, this is awkward.
        </h1>
        <p>
          You've reached an address that doesn't exist.
        </p>
      </span>
      <h1 v-else>
        An error occurred
      </h1>
      <p>
        Click
        <NuxtLink to="/">
          Here
        </NuxtLink>
        to get back on track.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'error',
  props: {
    error: {
      type: Object,
      default () {
        return {}
      }
    }
  }
}
</script>
