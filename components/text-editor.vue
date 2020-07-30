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
        size="sm"
        variant="transparent"
      >
        <b-icon-arrow-counterclockwise />
      </b-btn>
      <b-form-checkbox
        button
        button-variant="transparent"
        size="sm"
      >
        <b-icon-star />
      </b-form-checkbox>
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
    }
  },
  data() {
    return {
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
}
</style>
