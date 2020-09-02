<template>
  <b-container>
    Dashboard-style Report Browser
    <b-table :items="items">
      <template v-slot:cell(reportId)="{ item }">
        <b-btn :to="`/report/${item.reportId}?team=da`">
          {{ item.reportId }}
        </b-btn>
      </template>
    </b-table>
  </b-container>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    return {
      items: await $axios.$get('api/v1/reports')
    }
  }
}
</script>

<style>

</style>
