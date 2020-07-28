<template>
  <b-card>
    <apex-chart
      :id="chart.id"
      :series="chart.series"
      :options="options"
      height="175"
    />
  </b-card>
</template>

<script>
export default {
  props: {
    chart: {
      type: Object,
      default() {
        return {
          id: 'timeline-chart',
          series: [
            {
              name: 'Cases',
              requestType: 'Solved',
              data: [
                ['01/03/2020 03:15 PM', 1, 0],
                ['01/14/2020 01:19 PM', 1, 17],
                ['02/01/2020 01:42 PM', 1, 30],
                ['03/15/2020 05:00 PM', 1, 9],
                ['03/24/2020 02:28 PM', 1, 3]
              ]
            },
            {
              name: 'Optimizations',
              requestType: 'Some type of optimization',
              data: [
                ['01/03/2020 03:15 PM', 1, 3],
                ['01/15/2020 01:19 PM', 1, 1],
                ['03/01/2020 01:42 PM', 1, 2],
                ['03/15/2020 05:00 PM', 1, 13],
                ['03/24/2020 02:28 PM', 1, 3]
              ]
            }
          ]
        }
      }
    }
  },
  data() {
    return {
      options: {
        id: 'timeline-chart',
        colors: ['#0F3259', '#8dc7cb'],
        chart: { type: 'bubble', height: 150 },
        dataLabels: { enabled: false },
        fill: { opacity: 0.8 },
        title: { text: 'Timeline' },
        grid: {
          borderColor: '#e1e5e9',
          column: {
            colors: ['#f8f8f8', 'transparent'],
            opacity: 1
          },
          strokeDashArray: 2,
          xaxis: {
            lines: { show: true }
          }
        },
        legend: { position: 'bottom' },
        yaxis: {
          show: false,
          min: 0,
          max: 2,
          tickAmount: 2
        },
        plotOptions: {
          bubble: {
            minBubbleRadius: 10
          }
        },
        xaxis: {
          type: 'datetime',
          tickAmount: 10,
          position: 'top',
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
          custom({ series, seriesIndex, dataPointIndex, w }) {
            return `
              <div class="pb-1 pt-0 timeline-tooltip">
                <h2 class="badge w-100 my-0 badge-primary-1">
                  ${w.config.series[seriesIndex].name}
                </h2>
                <div class="py-1 px-2 text-left">
                  <p class="font-weight-bold mb-1">
                    ${w.config.series[seriesIndex].requestType}
                  </p>
                  <p class="text-muted">
                    ${w.config.series[seriesIndex].data[dataPointIndex][2]} locations
                  </p>
                </div>
              </div>
            `
          }
        }
      }
    }
  }
}
</script>

<style>
.timeline-tooltip {
  min-width: 200px;
}
</style>
