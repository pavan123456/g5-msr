<template>
  <b-card
    footer-class="d-flex align-items-center py-1 px-3 m-0 border-neutral border"
    no-body
  >
    <b-table
      :id="table.id"
      :ref="table.id"
      :fields="table.fields"
      :items="table.items"
      :filter="search"
      :per-page="perPage"
      :current-page="currentPage"
      :busy="isBusy"
      show-empty
      selectable
      select-mode="multi"
      selected-variant="quaternary-1"
      head-variant="light"
      sticky-header="45vh"
      primary-key="id"
      style="border: 1px solid #e1e5e9;"
      small
      striped
      borderless
      responsive
      @row-selected="onSelected"
    >
      <template v-slot:empty>
        <h1 class="text-center">
          {{ emptyText }}
        </h1>
      </template>
      <template v-slot:head(selected)>
        <b-form-checkbox
          @input="selectAllRows"
        />
      </template>
      <template v-slot:cell(selected)="{ rowSelected }">
        <b-icon-check v-if="rowSelected" scale="2" />
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
        <text-editor
          :content="row.item.note"
          :row-id="row.item.id"
          :promoted="row.item.promoted"
          @on-updated="refreshTable"
        />
      </template>
      <template v-slot:cell(clientName)="row">
        <b-badge variant="neutral" class="text-wrap">
          {{ row.item.clientName }}
        </b-badge>
      </template>
    </b-table>
    <template v-slot:footer>
      <b-container fluid class="px-0">
        <b-row>
          <b-col cols="4">
            <b-btn-group size="sm">
              <b-btn
                id="is-visible-btn"
                :disabled="isBusy"
                variant="neutral"
                @click="onBulkUpdate({ internal: false })"
              >
                <b-icon-emoji-sunglasses />
              </b-btn>
              <b-popover
                target="is-visible-btn"
                triggers="hover"
                placement="top"
                variant="neutral"
              >
                Mark selected notes as <b>Customer-Facing</b>.
              </b-popover>
              <b-btn
                id="is-internal-btn"
                :disabled="isBusy"
                variant="neutral"
                @click="onBulkUpdate({ internal: true })"
              >
                <b-icon-emoji-neutral />
              </b-btn>
              <b-popover
                target="is-internal-btn"
                triggers="hover"
                placement="top"
                variant="neutral"
              >
                Mark Selected notes as <b>Internal-Only</b>.
              </b-popover>
              <b-btn
                id="is-promoted-btn"
                :disabled="isBusy"
                variant="neutral"
                @click="onBulkUpdate({ promoted: true })"
              >
                <b-icon-star-fill />
              </b-btn>
              <b-popover
                target="is-promoted-btn"
                triggers="hover"
                placement="top"
                variant="neutral"
              >
                Mark selected notes as <b>Promoted Notes</b>.
              </b-popover>
              <b-btn
                id="is-unpromoted-btn"
                :disabled="isBusy"
                variant="neutral"
                @click="onBulkUpdate({ promoted: false })"
              >
                <b-icon-star />
              </b-btn>
              <b-popover
                target="is-unpromoted-btn"
                triggers="hover"
                placement="top"
                variant="neutral"
              >
                Unmark selected notes as <b>Promoted Notes</b>.
              </b-popover>
              <b-btn
                id="toggle-select"
                variant="neutral"
                @click="selectAllRows(false)"
              >
                Deselect All
              </b-btn>
            </b-btn-group>
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
                style="max-width: 80px; border-radius: 5px;"
                size="sm"
              />
            </b-input-group>
          </b-col>
          <b-col>
            <b-pagination
              v-model="currentPage"
              :per-page="perPage"
              :total-rows="table.totalRows"
              hide-ellipsis
              class="m-0"
              size="sm"
            />
          </b-col>
          <b-col>
            <b-input-group class="inset align-items-center">
              <b-form-input
                id="table-search-input"
                v-model="search"
                debounce="500"
                placeholder="Search table..."
                size="sm"
                style="border: 2px solid #e8e8e8; border-radius: 5px;"
              />
              <template v-slot:append>
                <b-btn
                  v-show="search !== ''"
                  variant="transparent"
                  class="inset-btn m-0 p-0 text-muted"
                  @click="onClearSearch"
                >
                  <b-icon-x-circle-fill />
                </b-btn>
              </template>
            </b-input-group>
          </b-col>
        </b-row>
      </b-container>
    </template>
  </b-card>
</template>

<script>
import TableHelpers from '~/mixins/table-helpers'
import TextEditor from '~/components/text-editor'
export default {
  components: {
    TextEditor
  },
  mixins: [TableHelpers],
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
      isBusy: false,
      perPage: 10,
      currentPage: 1,
      selected: false,
      pageOptions: [10, 20, 50],
      emptyText: '🦥 Nothing to See Here.',
      filteredText: '🦥 Adjust your Search String.',
      search: '',
      selectedRows: []
    }
  },
  methods: {
    onClearSearch() {
      this.search = ''
    },
    onSelected(rows) {
      // this.$emit('method-onSelected', rows)
      this.selectedRows = rows
    },
    onBulkUpdate(action) {
      if (this.selectedRows.length > 0) {
        this.isBusy = true
        this.$axios
          .$put('api/v1/update', {
            rows: this.selectedRows.map(row => ({
              id: row.id,
              ...action
            }))
          })
          .then((res) => {
            this.$emit('success-put', res)
            this.selectAllRows(false)
          })
          .finally(() => {
            this.isBusy = false
          })
      }
      // selected will be rows, action will be promoted, internal booleans
      // make api put to api/v1/notes with array of rows.
    },
    selectAllRows(select = false) {
      select === true
        ? this.$refs[this.table.id].selectAllRows()
        : this.$refs[this.table.id].clearSelected()
    },
    refreshTable(pull = false) {
      if (pull) {
        // refetch data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.inset {
  position: relative;
  &-btn {
    position: absolute;
    right: 0%;
    transform: translate(-25%, -50%);
    z-index: 10;
  }
}
#table-search-input::placeholder {
  text-transform: uppercase;
  font-size: 0.9em;
}
</style>
