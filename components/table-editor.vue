<template>
  <b-card
    footer-class="d-flex align-items-center py-1 px-3 m-0 border-neutral border"
    no-body
  >
    <b-table
      :ref="table.id"
      :id="table.id"
      :fields="table.fields"
      :items="table.items"
      :filter="search"
      :per-page="perPage"
      :current-page="currentPage"
      show-empty
      select-mode="multi"
      head-variant="light"
      sticky-header="45vh"
      primary-key="id"
      style="border: 2px solid #e1e5e9;"
      small
      striped
      outlined
      responsive
    >
      <template v-slot:empty>
        <h1 class="text-center">
          {{ emptyText }}
        </h1>
      </template>
      <template v-slot:head(selected)>
        <b-form-checkbox />
      </template>
      <template v-slot:cell(selected)>
        <b-form-checkbox />
      </template>
      <template v-slot:cell(internal)="row">
        <div class="hover-anchor">
          <b-icon-emoji-neutral v-if="row.item.internal" font-scale="1.5" />
          <b-icon-emoji-sunglasses v-else font-scale="1.5" />
          <div class="hovered-icon small text-muted text-uppercase">
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
        <!-- <span v-html="row.item.note" /> -->
        <text-editor :content="row.item.note" />
      </template>
      <template v-slot:cell(clientName)="row">
        <b-badge variant="neutral" class="text-wrap">
          {{ row.item.clientName }}
        </b-badge>
      </template>
    </b-table>
    <template v-slot:footer>
      <b-container fluid class="px-0">
        <b-row no-gutters>
          <b-col cols="4">
            <b-btn-group>
              <b-btn
                id="is-visible-btn"
                variant="neutral"
              >
                <b-icon-emoji-sunglasses />
              </b-btn>
              <b-popover
                target="is-visible-btn"
                triggers="hover"
                placement="lefttop"
                variant="neutral"
              >
                Mark selected notes as <b>Customer-Facing</b>.
              </b-popover>
              <b-btn
                id="is-internal-btn"
                variant="outline-neutral"
              >
                <b-icon-emoji-frown />
              </b-btn>
              <b-popover
                target="is-internal-btn"
                triggers="hover"
                placement="lefttop"
                variant="neutral"
              >
                Mark Selected notes as <b>Internal-Only</b>.
              </b-popover>
              <b-btn
                id="toggle-select"
                variant="neutral"
              >
                <b-icon-emoji-smile-upside-down />
              </b-btn>
              <b-popover
                target="toggle-select"
                triggers="hover"
                placement="lefttop"
                variant="neutral"
              >
                Deselect All.
              </b-popover>
            </b-btn-group>
          </b-col>
          <b-col>
            <b-pagination
              v-model="currentPage"
              :per-page="perPage"
              :total-rows="table.totalRows"
              hide-ellipsis
              class="m-0"
            />
          </b-col>
          <b-col cols="2">
            <b-input-group class="align-items-center">
              <b-input-group-prepend class="text-muted small text-uppercase pr-2">
                Rows
              </b-input-group-prepend>
              <b-form-select
                id="row-options"
                v-model="perPage"
                :options="pageOptions"
              />
            </b-input-group>
          </b-col>
          <b-col>
            <b-input-group class="inset align-items-center">
              <b-form-input
                id="table-search-input"
                v-model="search"
                debounce="500"
                placeholder="Search table..."
              />
              <b-input-group-btn
                v-show="search !== ''"
                variant="neutral"
                class="inset-btn"
                @click="onClearSearch"
              >
                <b-icon-x-circle />
              </b-input-group-btn>
            </b-input-group>
          </b-col>
        </b-row>
      </b-container>
    </template>
  </b-card>
</template>

<script>
import TextEditor from '~/components/text-editor'
export default {
  components: {
    TextEditor
  },
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
      emptyText: '🦥 Nothing to See Here.',
      filteredText: '',
      search: ''
    }
  },
  methods: {
    onClearSearch() {
      this.search = ''
    },
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
.inset {
  position: relative;
  &-btn {
    position: absolute;
    right: 10px;
    transform: translatX(-100%);
    z-index: 10;
  }
}
</style>
