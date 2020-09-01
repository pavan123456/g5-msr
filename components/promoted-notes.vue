<template>
  <div class="collapse-ctn">
    <b-card v-if="notes.length === 0" class="h4">
      {{ fallback }}
    </b-card>
    <b-card-group
      v-else
      v-for="g in groups"
      :key="g.id"
      :class="[{ 'is-collapsed': g.isCollapsed }, 'collapsible', 'mb-3', 'pt-4']"
      deck
    >
      <b-badge variant="neutral" class="collapse-badge px-5">
        {{ g.date }}
      </b-badge>
      <b-card
        v-for="note in group(g.date)"
        :key="note.id"
        header-tag="h4"
      >
        <template v-slot:header>
          <div>
            {{ note.headline }}
          </div>
        </template>
        <div class="mb-3">
          {{ note.text }}
        </div>
        <b-badge
          v-for="l in note.locations"
          :key="l"
          variant="pale"
          class="mb-1 mr-1"
        >
          {{ l }}
        </b-badge>
        <template v-slot:footer>
          {{ note.level }}
        </template>
      </b-card>
      <b-btn
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
import { promotedNotes } from '~/mixins/staged-data'
export default {
  props: {
    notes: {
      type: Array,
      default() {
        return []
      }
    }
  },
  mixins: [promotedNotes],
  data() {
    return {
      fallback: '😢 Oh no! You don\'t have any Promoted Notes for this time period. Please use the table above to promote notes you want the customer to be able to see. If there are no notes worthy of promotion, consider adding some notes that encapsulate the themes of the work you did in this period.'
    }
  },
  methods: {
    group(date) {
      return this.promoted.filter(n => n.date === date)
    }
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
}
</style>
