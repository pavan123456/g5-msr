<template>
  <div class="">
    <apex-chart
      :id="chart.id"
      :series="chart.series"
      :options="options"
      type="heatmap"
      height="400"
    />
  </div>
</template>

<script>
export default {
  props: {
    chart: {
      type: Object,
      default() {
        return {
          id: '',
          series: [
            {
              name: 'Digital Advertising',
              data: [
                { x: 'Cases Solved', y: 2 },
                { x: 'Account Changes', y: 2 },
                { x: 'Customer Contact', y: 3 },
                { x: 'General Note', y: 15 },
                { x: 'Optimizations', y: 683 }
              ]
            },
            {
              name: 'SEO',
              data: [
                { x: 'Cases Solved', y: 1 },
                { x: 'Account Changes', y: 6 },
                { x: 'Customer Contact', y: 0 },
                { x: 'General Note', y: 12 },
                { x: 'Optimizations', y: 138 }
              ]
            },
            {
              name: 'Customer Care',
              data: [
                { x: 'Cases Solved', y: 56 },
                { x: 'Account Changes', y: 1 },
                { x: 'Customer Contact', y: 0 },
                { x: 'General Note', y: 0 },
                { x: 'Optimizations', y: 0 }
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
        dataLabels: {
          style: {
            fontSize: '14px',
            fontFamily: '"Fira Sans", sans-serif',
            colors: ['#000']
          }
        },
        grid: {
          show: false
        },
        chart: {
          background: '#fff',
          fontFamily: '"Fira Sans", sans-serif',
          toolbar: { show: false }
        },
        xaxis: {
          categories: ['Digital Advertising', 'SEO', 'Customer Care'],
          axisBorder: { show: false },
          axisTicks: { show: false },
          labels: {
            show: false
          },
          max: 200
        },
        yaxis: {
          axisBorder: { show: false },
          labels: {
            style: {
              colors: ['#000'],
              fontSize: '14px',
              fontFamily: '"Fira Sans", sans-serif'
            }
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
