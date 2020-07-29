<template>
  <b-card
    footer-class="d-flex align-items-start p-1 m-0 border-0"
  >
    <b-table
      :ref="table.id"
      :id="table.id"
      :fields="table.fields"
      :items="table.items"
      :per-page="perPage"
      :current-page="currentPage"
      show-empty
      thead-tr-class="bg-white"
      sticky-header="35vh"
      small
      striped
      outlined
      responsive
    >
      <template v-slot:table-busy>
        <div class="text-center h1 align-middle">
          <b-spinner scale="5" style="vertical-align: -0.15em;" />
          Loading Those Notes...
        </div>
      </template>
      <template v-slot:empty>
        <h1 class="text-center">
          {{ emptyText }}
        </h1>
      </template>
      <template v-slot:cell(internal)="row">
        <div class="hover-anchor">
          <b-icon-emoji-neutral v-if="row.item.internal" font-scale="2" />
          <b-icon-emoji-sunglasses v-else font-scale="2" />
          <div class="hovered-icon">
            {{ row.item.internal ? 'Internal Only' : 'Customer-Facing' }}
          </div>
        </div>
      </template>
      <template v-slot:cell(annotationCategory)="row">
        <small class="text-muted">
          {{ row.item.annotationCategory.text }}
        </small>
      </template>
      <template v-slot:cell(annotationType)="row">
        <small class="text-muted">
          {{ row.item.annotationType }}
        </small>
        <b-badge v-if="row.item.startDate" variant="neutral" class="mb-1 px-2">
          Start: {{ row.item.startDate }}
        </b-badge>
        <b-badge v-if="row.item.endDate" variant="neutral" class="mb-1 px-2">
          End: {{ row.item.endDate }}
        </b-badge>
      </template>
      <template v-slot:cell(createdAt)="row">
        <b-badge variant="neutral">
          {{ formatDate(row.item.createdAt) }}
        </b-badge>
      </template>
      <template v-slot:cell(updatedAt)="row">
        <b-badge variant="neutral">
          {{ formatDate(row.item.updatedAt) }}
        </b-badge>
      </template>
      <template v-slot:cell(locationNames)="row">
        <div v-if="row.item.locationNames.length >= 10">
          {{ row.item.locationNames.length }} Locations
        </div>
        <b-badge
          v-for="(loc, i) in row.item.locationNames"
          v-else
          :key="`${loc}-${row.item.id}`"
          :variant="`primary-${i}`"
          class="mr-1"
        >
          {{ loc }}
        </b-badge>
      </template>
      <template v-slot:cell(salesforceSync)="row">
        <b-icon-check-circle-fill
          v-if="row.item.salesforceSync"
          scale="1.2"
          class="text-success"
        />
        <b-icon-x-circle-fill
          v-else
          scale="1.2"
          class="text-tertiary"
        />
      </template>
      <template v-slot:cell(note)="row">
        <span v-html="row.item.note" />
      </template>
      <template v-slot:cell(clientName)="row">
        <b-badge variant="neutral" class="text-wrap">
          {{ row.item.clientName }}
        </b-badge>
      </template>
    </b-table>
    <template v-slot:footer>
      <b-btn variant="transparent" class="mr-2">
        <b-icon-arrow-clockwise />
      </b-btn>
      <b-pagination
        v-model="currentPage"
        :per-page="perPage"
        :total-rows="table.totalRows"
        pills
        class="m-0"
      />
    </template>
  </b-card>
</template>

<script>
export default {
  props: {
    table: {
      type: Object,
      default() {
        return {
          id: '',
          fields: [],
          items: []
        }
      }
    }
  },
  data() {
    return {
      perPage: 10,
      currentPage: 1,
      pageOptions: [10, 20, 50],
      emptyText: '🦥 Nothing to See Here.'
    }
  },
  methods: {
    formatDate(date) {
      const d = new Date(date)
      let month = '' + (d.getMonth() + 1)
      let day = '' + d.getDate()
      const year = d.getFullYear()
      if (month.length < 2) {
        month = '0' + month
      }
      if (day.length < 2) {
        day = '0' + day
      }
      return [year, month, day].join('-')
    }
  }
}
</script>

<style lang="scss" scoped>
.tbl-w350 {
  // width: 350px;
  max-width: 350px;
}
.tbl-w200 {
  // width: 200px;
  max-width: 200px;
}
.tbl-w400 {
  max-width: 400px;
}
</style>
