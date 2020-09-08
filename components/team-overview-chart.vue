<template>
  <b-card header-class="border-0" no-body>
    <b-card-body v-if="charts.length === 0">
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
    <b-tabs v-else cards justified>
      <b-tab
        v-for="(c, i) in charts"
        :key="`${c.id}-${i}`"
        :title="c.category"
        title-item-class="text-uppercase small"
      >
        <apex-chart
          :id="c.id"
          :series="c.series"
          :options="options"
          type="bar"
          height="300"
        />
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>
export default {
  props: {
    charts: {
      type: Array,
      default() {
        return [
          {
            id: 'optimizations',
            category: 'Optimizations',
            series: [
              { name: 'Added Negative Keywords', data: [12] },
              { name: 'Updated Audiences', data: [1] },
              { name: 'Added Keywords', data: [21] },
              { name: 'Changed Location Strategy', data: [2] },
              { name: 'Paused Campaign', data: [1] },
              { name: 'Enabled Campaign', data: [5] },
              { name: 'Refreshed Ad Copy', data: [2] },
              { name: 'Testing', data: [8] },
              { name: 'T&O Added', data: [12] },
              { name: 'Manual Spend Adjustments', data: [8] },
              { name: 'Manual Bid Adjustments', data: [3] }
            ]
          },
          {
            id: 'account-changes',
            category: 'Account Changes',
            series: [
              { name: 'Smart Bidding Strategy Change', data: [3] },
              { name: 'Specials/Promotions', data: [10] },
              { name: 'Spend Optimizer Version Change', data: [7] },
              { name: 'URL Change', data: [1] },
              { name: 'Whitelisting Events Change', data: [0] }
            ]
          }
        ]
      }
    }
  },
  data() {
    return {
      fallback: '😢 Oh no! It looks like we can\'t find any notes for this time period. \n We\'d recommend adding some notes or if you think this is an error please report it!',
      categories: [
        'Optimizations',
        'Account Changes',
        'General Note'
      ],
      test: null
    }
  },
  computed: {
    options() {
      return {
        tooltip: {
          y: {
            formatter(value, { series, seriesIndex, dataPointIndex, w }) {
              return value
            }
          }
        },
        colors: ['#6889b0', '#a0ced1', '#234082', '#7fd9a3', '#da808f', '#f39d1f', '#fb001e'],
        chart: { type: 'bar', height: 300 },
        dataLabels: {
          enabled: true,
          offsetY: -25,
          style: {
            fontSize: '14px',
            colors: ['#000']
          }
        },
        grid: {
          show: true,
          borderColor: '#e8e8e8',
          strokeDashArray: 2
        },
        fill: { opacity: 1 },
        title: { text: 'Team Overview by Category' },
        yaxis: { show: false },
        plotOptions: {
          bar: {
            columnWidth: '70%',
            dataLabels: {
              position: 'top'
            }
          }
        },
        legend: {
          show: true,
          position: 'left'
        },
        xaxis: {
          tooltip: { enabled: false },
          categories: [
            'Added Negative Keywords',
            'Updated Audiences',
            'Added Keywords',
            'Changed Location Strategy',
            'Paused Campaign',
            'Enabled Campaign',
            'Refreshed Ad Copy'
          ],
          axisBorder: { show: false },
          axisTicks: { show: false },
          labels: { show: false }
        }
      }
    }
  }
}
</script>

<style>
.apexcharts-tooltip-title {
  display: none !important;
}
</style>
