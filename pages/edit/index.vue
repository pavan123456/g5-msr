<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <b-table :items="items" :fields="fields">
          <template v-slot:cell(reportId)="{ item }">
            <b-btn
              :to="`/edit/${item.reportId}?team=da`"
              block
              variant="quaternary-3"
              size="sm"
            >
              Edit Report
            </b-btn>
            <b-btn :to="`/report/${item.reportId}?edit=false`" block variant="tertiary-2" size="sm">
              View Report
            </b-btn>
          </template>
          <template v-slot:cell(workQ)="{ item }">
            <h1>
              {{ item.workQ.length }}
            </h1>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    const items = await $axios.$get('api/v1/reports')
    return {
      items,
      fields: Object.keys(items[0]).map(field => ({
        key: field,
        sortable: true
      }))
    }
  }
}
</script>

<style>

</style>
