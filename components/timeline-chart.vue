<template>
  <b-card header-class="border-0" no-body>
    <b-card-body v-if="chart.length === 0">
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
    </b-card-body>
     <apex-chart
      v-else
      :series="chart"
      :options="options"
      height="300"
    />
  </b-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  props: {
    chart: {
      type: Array,
      default() {
        return [
          {
            name: 'Fallback Category',
            requestType: 'Fallback Request Type',
            data: [
              ['01/01/2020 03:15 PM', 1, 1, { category: 'Category', actionType: 'Updated Call Extension', note: '', internal: true, locationNames: ['StorQuest Self Storage'] }],
              ['01/03/2020 03:15 PM', 1, 10, { category: 'Category', actionType: 'Updated Call Extension', note: '', internal: true, locationNames: ['StorQuest Self Storage'] }],
              ['01/14/2020 01:19 PM', 1, 20, { category: 'Category', actionType: 'Updated Call Extension', note: '', internal: true, locationNames: ['StorQuest Self Storage'] }],
              ['02/01/2020 01:42 PM', 1, 30, { category: 'Category', actionType: 'Updated Call Extension', note: '', internal: true, locationNames: ['StorQuest Self Storage'] }],
              ['03/15/2020 05:00 PM', 1, 40, { category: 'Category', actionType: 'Updated Call Extension', note: '', internal: true, locationNames: ['StorQuest Self Storage'] }],
              ['03/24/2020 02:28 PM', 1, 50, { category: 'Category', actionType: 'Updated Call Extension', note: '', internal: true, locationNames: ['StorQuest Self Storage'] }]
            ]
          }
        ]
      }
    }
  },
  data() {
    return {
      fallback: '😢 Oh no! It looks like we can\'t find any notes for this time period.\n We\'d recommend adding some notes or if you think this is an error, please report it!',
      options: {
        id: 'timeline-chart',
        colors: ['#8dc7cb', '#e00033', '#62bc60', '#feb800'],
        chart: { type: 'bubble' },
        dataLabels: { enabled: false },
        fill: { opacity: 0.8 },
        title: { text: 'Activity Timeline' },
        grid: {
          borderColor: '#c1c1c1',
          column: {
            colors: ['#94abd7', 'transparent'],
            opacity: 1
          },
          strokeDashArray: 2,
          xaxis: {
            lines: { show: true }
          },
          yaxis: {
            lines: { show: true }
          }
        },
        legend: { position: 'top' },
        yaxis: [{
          show: false,
          min: 0,
          max: 2,
          tickAmount: 2
        }],
        plotOptions: {
          bubble: {
            minBubbleRadius: 10,
            maxBubbleRadius: 200
          }
        },
        xaxis: {
          // min: '12/01/2019 03:15 PM',
          type: 'datetime',
          position: 'bottom',
          labels: {
            style: {
              fontFamily: '"Fira Sans", sans-serif'
            },
            datatimeUTC: true,
            datetimeFormatter: {
              year: 'yyyy',
              month: 'MMMM',
              day: 'MMM dd'
            }
          }
        },
        tooltip: {
          y: { show: false },
          custom({ series, seriesIndex, dataPointIndex, w }) {
            const { category, actionType, internal, note, locationNames } = w.config.series[seriesIndex].data[dataPointIndex][3]
            const locations = locationNames.length === 0 ? 'All Locations' : (locationNames.length > 3 ? locationNames.length : locationNames)
            return `
              <div class="pb-1 pt-0 timeline-tooltip">
                <h2 class="badge w-100 my-0 badge-primary-1">
                  ${category}
                </h2>
                <div class="py-1 px-2 text-left" style="max-width: 300px;">
                  <p class="font-weight-bold mb-1 text-wrap">
                   ${actionType == null ? '' : actionType}
                  </p>
                  <div class="text-wrap my-2">
                    ${!internal ? note : ''}
                  </div>
                  <p class="text-muted text-wrap border-pale border-top pt-2">
                    ${locations}
                  </p>
                </div>
              </div>
            `
          }
        }
      }
    }
  },
  computed: {
    ...mapState({
      monthly: state => state.inputs.monthly
    }),
    ...mapGetters({
      selectedDate: 'inputs/selectedDate',
      selectedQuarter: 'inputs/selectedQuarter'
    })
  }
}
</script>

<style>
.timeline-tooltip {
  min-width: 300px;
}
</style>
