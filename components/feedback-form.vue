<template>
  <div :class="[{ 'is-open': show }, 'f-card', 'bg-white', 'p-2']">
    <b-btn
      id="f-card-toggle"
      variant="tertiary-4"
      class="f-card__icon py-1 px-2"
      pill
      @click="show = !show"
    >
      <b-icon-chat-dots-fill />
    </b-btn>
    <b-tooltip
      target="f-card-toggle"
      triggers="hover"
      placement="bottom"
      variant="tertiary-4"
    >
      Toggle Feedback Form
    </b-tooltip>
    <div class="f-card__body">
      <h2>
        Hi, David!
      </h2>
      <b-form>
        <b-form-group>
          <b-form-select
            :value="type"
            :options="types"
            required
            @input="onUpdate({ key: 'type', value: $event })"
          />
        </b-form-group>
        <b-form-group>
          <b-form-textarea
            :value="comment"
            :state="isValid"
            rows="6"
            placeholder="Spare no one's feelings..."
            @input="onUpdate({ key: 'comment', value: $event })"
          />
          <b-form-text>
            {{ commentLength }} / {{ max }}
          </b-form-text>
        </b-form-group>
        <b-btn-group class="w-75 bg-white" size="sm">
          <b-btn
            variant="tertiary-4"
          >
            Send
          </b-btn>
          <b-btn
            variant="outline-tertiary-4"
          >
            Clear
          </b-btn>
        </b-btn-group>
      </b-form>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      show: false
    }
  },
  computed: {
    ...mapState({
      type: state => state.feedback.type,
      types: state => state.feedback.types,
      comment: state => state.feedback.comment,
      max: state => state.feedback.maxCommentLength
    }),
    commentLength () {
      return this.$store.getters['feedback/commentLength']
    },
    isValid () {
      return this.$store.getters['feedback/isValid']
    }
  },
  methods: {
    onSubmit () {},
    onClear () {},
    ...mapActions({
      onUpdate: 'feedback/onUpdate'
    })
  }
}
</script>

<style lang="scss" scoped>
.f-card {
  position: fixed;
  right: 15px;
  bottom: 15px;
  clip-path: circle(23px at 88% 90%);
  transition: 400ms ease-out;
  z-index: 99999;
  &.is-open {
    clip-path: circle(100%);
  }
  &__icon {
    position: absolute;
    right: 5%;
    bottom: 5%;
    &:focus {
      box-shadow: none;
    }
  }
}
</style>
