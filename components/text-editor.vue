<template>
  <div class="editor d-flex">
    <editor-content class="editor__content flex-grow-1" :editor="editor" />
    <div class="editor__btn-group d-flex">
      <b-form-checkbox
        v-model="editable"
        button
        button-variant="transparent"
        size="sm"
      >
        <b-icon-pencil />
      </b-form-checkbox>
      <b-btn
        :id="`revert-${id}`"
        :disabled="true"
        size="sm"
        variant="transparent"
      >
        <b-icon-x-circle />
      </b-btn>
      <b-form-checkbox
        :id="`promoted-${id}`"
        v-model="promoted"
        button
        button-variant="transparent"
        size="sm"
      >
        <b-icon-star v-if="promoted" />
        <b-icon-star-fill v-else />
      </b-form-checkbox>
      <b-popover
        :target="`promoted-${id}`"
        triggers="hover"
      >
        Promote this Note.
      </b-popover>
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
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      promoted: false,
      editable: false,
      editor: new Editor({
        editable: false,
        content: this.content
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
  }
}
</script>

<style lang="scss" scoped>
.editor {
  max-width: 350px;
  &__btn-group {
    flex-direction: column;
  }
  &__content {
    max-width: 350px;
    overflow-y: scroll;
  }
}
</style>
