<template>
  <b-card>
    <b-card-body v-if="chart.length === 0" class="respect-linebreak h4">
      {{ fallback }}
      <a href="https://notes.g5marketingcloud.com" target="_blank">
        Open Notes Service
      </a>
    </b-card-body>
    <apex-chart
      v-else
      :series="chart"
      :options="options"
      height="275"
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
              ['01/03/2020 03:15 PM', 1, 0],
              ['01/14/2020 01:19 PM', 1, 17],
              ['02/01/2020 01:42 PM', 1, 30],
              ['03/15/2020 05:00 PM', 1, 9],
              ['03/24/2020 02:28 PM', 1, 3]
            ]
          }
        ]
      }
    }
  },
  data() {
    return {
      fallback: '😢 Oh no! It looks like we can\'t find any notes for this time period.\n\n We\'d recommend adding some notes or if you think this is an error, please report it!',
      options: {
        id: 'timeline-chart',
        colors: ['#8dc7cb', '#e00033', '#62bc60', '#feb800'],
        chart: { type: 'bubble', height: 250 },
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
        yaxis: {
          show: false,
          min: 0,
          max: 2,
          tickAmount: 2
        },
        plotOptions: {
          bubble: {
            minBubbleRadius: 1,
            maxBubbleRadius: 300
          }
        },
        xaxis: {
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
            return `
              <div class="pb-1 pt-0 timeline-tooltip">
                <h2 class="badge w-100 my-0 badge-primary-1">
                  ${w.config.series[seriesIndex].name}
                </h2>
                <div class="py-1 px-2 text-left" style="max-width: 300px;">
                  <p class="font-weight-bold mb-1 text-wrap">
                    ${w.config.series[seriesIndex].data[dataPointIndex][5] === null ? '' : w.config.series[seriesIndex].data[dataPointIndex][5]}
                  </p>
                  <div class="text-wrap my-2">
                    ${!w.config.series[seriesIndex].data[dataPointIndex][4] ? w.config.series[seriesIndex].data[dataPointIndex][3] : ''}
                  </div>
                  <p class="text-muted text-wrap border-pale border-top pt-2">
                    ${w.config.series[seriesIndex].data[dataPointIndex][6]}
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
