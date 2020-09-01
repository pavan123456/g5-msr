<template>
  <div class="editor d-flex">
    <editor-content class="editor__content flex-grow-1" :editor="editor" />
    <div class="editor__btn-group d-flex">
      <b-form-checkbox
        v-model="editable"
        :button-variant="editable ? 'tertiary': 'transparent'"
        button
        size="sm"
      >
        <save-icon v-if="editable" class="save-btn" />
        <b-icon-pencil v-else />
      </b-form-checkbox>
      <b-btn
        :id="`revert-${rowId}`"
        :variant="editable ? 'failure' : 'transparent'"
        :disabled="!editable"
        size="sm"
      >
        <b-icon-x-circle />
      </b-btn>
      <b-form-checkbox
        :id="`promoted-${rowId}`"
        :value="promoted"
        button
        button-variant="transparent"
        size="sm"
        @input="onUpdate({ key: 'promoted', value: $event })"
      >
        <b-icon-star-fill v-if="promoted" />
        <b-icon-star v-else />
      </b-form-checkbox>
      <b-popover
        :target="`promoted-${rowId}`"
        triggers="hover"
      >
        Promote this Note.
      </b-popover>
    </div>
  </div>
</template>

<script>
import { Editor, EditorContent } from 'tiptap'
import SaveIcon from '~/components/icons/save'
export default {
  components: {
    SaveIcon,
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
  data() {
    return {
      // promoted: false,
      editable: false,
      editor: new Editor({
        editable: false,
        content: this.content,
        onUpdate({ getHTML, getJSON }) {
          return {
            html: getHTML(),
            annotation: getJSON()
          }
        }
      })
    }
  },
  watch: {
    editable() {
      this.editor.setOptions({
        editable: this.editable
      })
    }
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  methods: {
    onUpdate(evt) {
      this.$emit('on-update', evt)
      this.$emit('on-updated', true)
      // const content = this.editor.onUpdate()
      // this.$axios
      //   .$put('api/v1/notes', {
      //     id: this.rowId,
      //     promoted: this.promoted,
      //     ...content
      //   })
      //   .then()
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
        transform: scale(1.1);
      }
    }
  }
}
</style>
