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
          <template v-slot:cell(approvals)="{ item }">
            <b-list-group>
              <b-list-group-item
                v-for="approval in item.approvals"
                :key="approval.id"
                class="small"
              >
                <b-icon-check-circle-fill v-if="approval.value" variant="success" />
                <b-icon-check-circle v-else variant="failure" />
                {{ approval.name }}
              </b-list-group-item>
            </b-list-group>
          </template>
          <template v-slot:cell(from)="{ item }">
            <b-badge variant="neutral">
              {{ item.from }}
            </b-badge>
          </template>
          <template v-slot:cell(to)="{ item }">
            <b-badge variant="neutral">
              {{ item.to }}
            </b-badge>
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
