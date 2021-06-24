<template>
  <svg
    :width="size"
    :height="size"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    aria-hidden="true"
    focusable="false"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 24 24"
  >
    <path
      :fill="color"
      d="M5 21h14a2 2 0 0 0 2-2V8l-5-5H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2zM7 5h4v2h2V5h2v4H7V5zm0 8h10v6H7v-6z"
    />
  </svg>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default () {
        return '1em'
      }
    },
    color: {
      type: String,
      default () {
        return 'currentColor'
      }
    }
  }
}
</script>
