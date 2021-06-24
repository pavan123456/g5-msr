<template>
  <div class="editor d-flex">
    <editor-content class="editor__content flex-grow-1" :editor="editor" />
    <div class="editor__btn-group d-flex">
      <b-form-checkbox
        v-model="editable"
        :button-variant="editable ? 'tertiary': 'transparent'"
        button
        size="sm"
        @input="beforeUpdate"
      >
        <span v-if="editable" class="save-btn">
          SAVE
        </span>
        <b-icon-pencil v-else />
      </b-form-checkbox>
      <b-btn
        :id="`revert-${rowId}`"
        :variant="editable ? 'failure' : 'transparent'"
        :disabled="!editable"
        size="sm"
        @click="onRevert"
      >
        <b-icon-x-circle />
      </b-btn>
    </div>
  </div>
</template>

<script>
import { Editor, EditorContent } from 'tiptap'
export default {
  components: {
    EditorContent
  },
  props: {
    content: {
      type: String,
      default: '<p></p>'
    },
    rowId: {
      type: Number,
      required: true
    },
    promoted: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      editable: false,
      actions: {},
      editor: new Editor({
        editable: false,
        content: this.content,
        onUpdate: ({ getHTML, getJSON }) => {
          this.actions = {
            annotation: getJSON(),
            html: getHTML()
          }
        }
      })
    }
  },
  watch: {
    editable () {
      this.editor.setOptions({
        editable: this.editable
      })
    }
  },
  beforeDestroy () {
    this.editor.destroy()
  },
  methods: {
    onRevert () {
      this.editor.content = this.content
      this.editable = false
    },
    beforeUpdate () {
      if (!this.editable && this.actions.html) {
        this.onUpdate({ ...this.actions })
      }
    },
    onUpdate (actions) {
      this.$emit('on-update', actions)
      if (actions) {
        this.$axios
          .$put('api/v1/update', {
            rows: [{
              id: this.rowId,
              ...actions
            }]
          })
          .then(() => {
            this.$emit('update-table', true)
          })
      }
    }
  }
}
</script>

<style lang="scss">
.editor {
  max-width: 350px;
  &__btn-group {
    flex-direction: column;
    &.save-btn {
      position: relative;
      &::after {
        position: absolute;
        content: 'Save';
        right: 0%;
        top: 50%;
        transform: translate(100%, -50%);
        color: black;
      }
    }
  }
  &__content {
    max-width: 350px;
    // overflow-y: scroll;
    padding: 2px;
    & div {
      transition: 200ms ease-in-out;
      &[contenteditable="true"] {
        background-color: white;
        padding: 2px;
        box-shadow: 0 0 2px 2px rgba(37, 107, 106, 0.5),
        0 5px 20px rgba(10, 10, 10, 0.2);
        transform-origin: right top;
        transform: scale(1.05);
      }
    }
  }
}
</style>
