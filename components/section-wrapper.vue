<template>
  <b-card
    class="my-1"
    border-variant="quaternary-10"
    style="border-radius: 13px; box-shadow: 0 2px 8px rgba(31, 40, 137, 0.2);"
  >
    <b-card-header class="p-0 border-0 bg-white">
      <b-btn
        block
        variant="transparent"
        class="d-flex justify-content-between align-items-center mb-1"
        style="border-radius: 13px;"
        @click="visible = !visible"
      >
        <span class="h2 text-uppercase font-weight-bold mb-0">
          {{ title }}
        </span>
        <b-icon-question-circle-fill
          variant="quaternary-40"
          scale="0.9em"
        />
      </b-btn>
    </b-card-header>
    <b-collapse v-model="visible">
      <b-alert
        show
        variant="tertiary"
        class="rounded-0 my-3 pb-4 respect-linebreak small"
      >
        {{ description }}
      </b-alert>
    </b-collapse>
    <slot />
  </b-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'title here'
    },
    description: {
      type: String,
      default: 'description here'
    }
  },
  data () {
    return {
      visible: false
    }
  }
}
</script>
