<template>
  <b-container fluid class="px-0">
    <nav-header />
    <b-container class="py-5">
      <b-row>
        <b-col>
          <h1>
            Managed Services Report
          </h1>
          <p>
            Default paragraph font
          </p>
          <iframe src="/loading.html" title="loading" width="100%" height="600" frameborder="0" />
        </b-col>
        <b-col>
          <placeholder />
        </b-col>
      </b-row>
    </b-container>
  </b-container>
</template>

<script>
import NavHeader from '~/components/nav-header'
import Placeholder from '~/components/placeholder'
export default {
  components: {
    Placeholder,
    NavHeader
  }
}
</script>
