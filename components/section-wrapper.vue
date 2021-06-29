<template>
  <b-card
    header-bg-variant="white"
    header-class="p-0 m-0 border-0"
    class="my-0 border-0"
  >
    <template #header>
      <b-btn
        block
        variant="transparent"
        class="rounded-0 d-flex justify-content-between align-items-center mb-1"
        @click="visible = !visible"
      >
        <span class="h2 text-uppercase font-weight-bold mb-0">
          {{ title }}
        </span>
        <b-icon-question-circle-fill
          variant="tertiary-30"
          scale="0.9em"
        />
      </b-btn>
    </template>
    <b-collapse v-model="visible">
      <b-alert
        show
        variant="tertiary"
        class="rounded-0 mb-4 pb-4 respect-linebreak small"
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
