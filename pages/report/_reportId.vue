<template>
  <div>
    <nav-header v-bind="{ hideHamburger }">
      <b-list-group class="flex-row align-items-center mx-3">
        <b-list-group-item
          v-for="(item, i) in items"
          :key="item.text"
          class="p-0 mr-1 border-0 bg-transparent"
        >
          <b-btn
            :href="item.href"
            variant="secondary-70"
            class="px-3 m-0 text-uppercase nav-btn font-weight-bold"
            style="border-radius: 11px; box-shadow: 0 2px 2px rgba(5, 5, 5, 0.5);"
            size="sm"
            @click="move(i)"
          >
            {{ item.text }}
          </b-btn>
        </b-list-group-item>
      </b-list-group>
    </nav-header>
    <b-progress
      :value="position"
      class="w-100 mb-0 rounded-0"
      variant="quinary"
      height="3px"
    />
    <div
      ref="scrollContainer"
      class="scroll-container"
      @scroll="onScroll"
    >
      <div class="inset-controls bg-quaternary">
        <b-card class="inset-controls__card">
          <h1 class="text-white text-uppercase font-weight-bold inset-controls__card__title">
            {{ clientName }}
          </h1>
          <b-dropdown right variant="transparent">
            <template #button-content>
              <span class="font-weight-bold">
                FROM
              </span>
              {{ period.from }}
              <span class="font-weight-bold">
                TO
              </span>
              {{ period.to }}
            </template>
          </b-dropdown>
        </b-card>
      </div>
      <b-container style="margin-top: 60px;" class="px-0">
        <b-row
          v-for="(s, i) in sections"
          :key="`${s.text}-${i}`"
          class="pt-1"
        >
          <b-col v-if="s.text === 'Overview'">
            <b-card
              class="my-1"
              border-variant="quaternary-10"
              style="border-radius: 13px; box-shadow: 0 2px 8px rgba(31, 40, 137, 0.2);"
            >
              <b-card-header class="p-0 border-0 bg-white">
                <h2
                  :id="s.id"
                  class="font-weight-bold text-uppercase"
                >
                  {{ s.text }}
                </h2>
              </b-card-header>
              <heatmap-overview-chart :chart="s.chart" />
            </b-card>
          </b-col>
          <b-col v-else>
            <b-card
              class="my-1 px-2"
              border-variant="quaternary-10"
              style="border-radius: 13px; box-shadow: 0 2px 8px rgba(31, 40, 137, 0.2);"
            >
              <b-card-header class="p-0 border-0 bg-white">
                <h2
                  :id="s.id"
                  class="font-weight-bold text-uppercase"
                >
                  {{ s.text }}
                </h2>
              </b-card-header>
              <b-row v-if="s.overview.length > 0" class="my-3 pt-2">
                <b-col>
                  <team-overview-chart :charts="s.overview" />
                </b-col>
              </b-row>
              <b-row v-if="s.timeline.length > 0" class="h-divider my-5 pt-3">
                <b-col>
                  <timeline-chart :chart="s.timeline" />
                </b-col>
              </b-row>
              <b-row v-if="Object.keys(s.promoted).length > 0" class="h-divider my-5 pt-3">
                <b-col class="pt-3">
                  <promoted-notes :notes="s.promoted" />
                </b-col>
              </b-row>
            </b-card>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData ({ params, $axios }) {
    const res = await $axios
      .$get(`api/v1/reports/${params.reportId}?edit=true`)
    const overviewColumns = [
      'Cases Solved',
      'Account Audit',
      'General Note',
      'Account Changes',
      'Optimizations'
    ]
    res.overview.forEach((row) => {
      row.data = row.data.filter((col) => {
        return overviewColumns.includes(col.x)
      })
      const newData = []
      overviewColumns.forEach((title) => {
        newData.push(row.data.find(obj => obj.x === title))
      })
      row.data = newData
    })
    res.overview.reverse()

    return {
      res,
      sections: [
        {
          text: 'Overview',
          id: 'overview',
          href: '#overview',
          chart: {
            id: 'overview-chart',
            series: res.overview
          }
        },
        {
          text: 'Digital Advertising',
          id: 'da',
          href: '#da',
          ...res.teams.find(t => t.name === 'Digital Advertising'),
          promoted: res.notes
            .filter(n => n.team.name === 'DA' && n.promoted === true)
            .map((n) => {
              return {
                id: '',
                text: n.note,
                date: n.createdAt,
                type: n.annotationType,
                category: n.annotationCategory.text,
                locations: n.locations.map(l => l.name)
              }
            })
            .reduce((obj, n) => {
              const month = new Date(n.date).toLocaleString('default', { month: 'long' })
              obj[month] = obj[month] || []
              obj[month].push(n)
              return obj
            }, {})
        },
        {
          text: 'SEO',
          id: 'seo',
          href: '#seo',
          ...res.teams.find(t => t.name === 'SEO'),
          promoted: res.notes
            .filter(n => n.team.name === 'SEO' && n.promoted === true)
            .map((n) => {
              return {
                id: '',
                text: n.note,
                date: n.createdAt,
                locations: n.locations.map(l => l.name)
              }
            })
            .reduce((obj, n) => {
              const month = new Date(n.date).toLocaleString('default', { month: 'long' })
              obj[month] = obj[month] || []
              obj[month].push(n)
              // add a sort of obj[month] by createdAt
              obj[month].sort((a, b) => {
                return new Date(a.date) - new Date(b.date)
              })
              return obj
            }, {})
        },
        {
          text: 'Customer Care',
          id: 'cc',
          href: '#cc',
          ...res.teams.find(t => t.name === 'Customer Care'),
          promoted: {}
        }
      ],
      period: {
        to: res.to,
        from: res.from
      },
      clientName: res.clientName
    }
  },
  data () {
    return {
      items: [
        { text: 'Overview', href: '#overview' },
        { text: 'Digital Advertising', href: '#da' },
        { text: 'SEO', href: '#seo' },
        { text: 'Customer Care', href: '#cc' }
      ],
      progress: 0,
      hideHamburger: true
    }
  },
  computed: {
    position () { return `${Math.round(this.progress * 100)}%` }
  },
  methods: {
    onScroll () {
      const progress = this.$refs.scrollContainer.scrollTop / (this.$refs.scrollContainer.scrollHeight - this.$refs.scrollContainer.clientHeight)
      if (progress > 1) {
        this.progress = 1
      } else if (progress < 0) {
        this.progress = 0
      } else {
        this.progress = progress
      }
    },
    move (index) {
      if (index < 0) {
        this.position = 0
      } else if (index > this.items.length - 1) {
        this.position = this.items.length - 1
      } else {
        this.position = index
      }
    }
  }
}
</script>

<style>
.wrapper {
  height: 100vh;
  width: 100vw;
  display: grid;
  overflow: hidden;
}
.h-divider {
  border-top: 2px dotted var(--quaternary-20);
}
.progress-bar {
  background: linear-gradient(35deg, var(--quinary), var(--secondary-30), var(--quaternary-60));
}
.scroll-container {
  overflow: scroll;
  max-height: calc(100vh - 100px);
}

</style>
