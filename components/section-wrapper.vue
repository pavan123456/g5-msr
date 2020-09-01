<template>
  <b-card
    header-class="p-0 m-0 border-0"
    class="my-0 border-0"
  >
    <template v-slot:header>
      <b-btn
        block
        variant="transparent"
        class="rounded-0 d-flex justify-content-between align-items-center mb-1"
        @click="visible = !visible"
      >
        <span class="h2 mb-0">
          {{ title }}
        </span>
        <b-icon-question-circle
          variant="muted"
          scale="0.9"
        />
      </b-btn>
    </template>
    <b-collapse v-model="visible">
      <b-card bg-variant="pale" class="rounded-0 small mb-2">
        {{ description }}
      </b-card>
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
  data() {
    return {
      visible: true
    }
  }
}
</script>
