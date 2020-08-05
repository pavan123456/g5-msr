<template>
  <div class="align-self-center">
    <b-avatar
      :src="content.src"
      size="6rem"
    />
    <h3 class="my-2">
      {{ content.name }}
    </h3>
    <p class="my-2">
      {{ content.title }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      default() {
        return {
          src: 'http://placekitten.com/200/200',
          name: 'Kitten Strategist',
          title: 'Chief Cuddler'
        }
      }
    }
  }
}
</script>

<style>

</style>
