<template>
  <div class="collapse-ctn">
    <b-card
      v-if="Object.keys(notes).length === 0 && notes.constructor === Object"
    >
      <b-alert show variant="tertiary-3" class="respect-linebreak pb-4">
        {{ fallback }}
      </b-alert>
      <b-btn
        href="https://notes.g5marketingcloud.com"
        target="_blank"
        variant="outline-tertiary-3"
        size="sm"
      >
        Open Notes Service
        <b-icon-box-arrow-up-right />
      </b-btn>
    </b-card>
    <b-card-group
      v-for="g in groups"
      v-else
      :key="g.id"
      :class="[{ 'is-collapsed': g.isCollapsed }, 'collapsible', 'mb-3', 'pt-4']"
      deck
    >
      <b-badge variant="neutral" class="collapse-badge px-5">
        {{ g.date }}
      </b-badge>
      <b-card
        v-for="(note, i) in notes[g.date]"
        :key="`${note.id}-${i}`"
      >
        <div v-html="note.text" class="mb-3" />
        <div v-if="note.locations.length < 8">
          <b-badge
            v-for="(l, idx) in note.locations"
            :key="`${l}-${idx}`"
            variant="pale"
            class="mb-1 mr-1"
          >
            {{ l }}
          </b-badge>
        </div>
        <div v-else>
          <b-container fluid class="scroll-container">
            <b-badge
              v-for="(l, idx) in note.locations"
              :key="`${l}-${idx}`"
              variant="pale"
              class="mb-1 mr-1"
            >
              <span class="text-wrap">{{ l }}</span>
            </b-badge>
          </b-container>
        </div>
      </b-card>
      <b-btn
        v-if="notes[g.date].length > 1"
        variant="transparent"
        block
        class="collapse-btn py-0 text-uppercase"
        @click="g.isCollapsed = !g.isCollapsed"
      >
        <b-icon-chevron-compact-down v-if="g.isCollapsed" />
        <span v-if="g.isCollapsed" class="text-muted small">
          Show More
        </span>
        <b-icon-chevron-compact-up v-else />
      </b-btn>
    </b-card-group>
  </div>
</template>

<script>
import Helpers from '~/mixins/table-helpers'
export default {
  mixins: [Helpers],
  props: {
    notes: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      groups: [],
      fallback: '😢 Oh no! You don\'t have any Promoted Notes for this time period. Please use the table above to promote notes you want the customer to be able to see.\n If there are no notes worthy of promotion, consider adding some notes that encapsulate the themes of the work you did in this period.'
    }
  },
  created() {
    this.groups = Object
      .keys(this.notes)
      .map(key => ({
        id: key.toLowerCase(),
        date: key,
        isCollapsed: true
      }))
  }
}
</script>

<style lang="scss" scoped>
.collapsible {
  overflow-y: hidden;
  position: relative;
  & .collapse-badge {
    position: absolute;
    z-index: 2;
    transform: translateY(-115%);
  }
  & .collapse-btn {
    z-index: 10;
    position: absolute;
    left: 50%;
    top: 100%;
    transform: translate(-50%, -75%);
    // transition: 200ms ease;
    background-color: white;
    box-shadow: none;
    &:focus {
      box-shadow: none;
    }
  }
  &.is-collapsed {
    height: 200px;
    & .collapse-btn {
      top: 200px;
      box-shadow: 0 -15px 15px 10px rgba(255, 255, 255, 0.8);
    }
  }
  & .scroll-container {
    overflow-y: scroll;
    max-height: 200px;
    scroll-behavior: smooth;
    padding: 0px;
    overflow-x: hidden;
  }
}
</style>
