<template>
  <div>
    <nav-header />
    <b-container>
      <h1 style="text-align: center; font-size:5em;">
        {{ time }}
      </h1>
      {{ notes }}
    </b-container>
  </div>
</template>

<script>
import NavHeader from '~/components/nav-header'
import Helpers from '~/mixins/table-helpers'
export default {
  components: {
    NavHeader
  },
  mixins: [Helpers],
  async asyncData({ params, $axios }) {
    const teams = ['DA', 'SEO', 'CC']
    const {
      time,
      overview,
      teams: sections,
      notes
    } = await $axios.$get(`api/v1/report/${params.reportId}`)
    return {
      time,
      overview,
      sections,
      teams,
      notes: notes.filter(n => n.team.name === 'DA')
    }
  },
  computed: {
    team() {
      return this.$store.state.inputs.team
    },
    teamOptions() {
      return this.$store.state.inputs.teams
    }
  }
}
</script>

<style>

</style>
