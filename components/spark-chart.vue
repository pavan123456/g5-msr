<template>
  <div class="">
    <apex-chart
      :id="chart.id"
      :series="chart.series"
      :options="options"
      type="bar"
      height="80"
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
          series: [{
            name: 'metric',
            data: [145]
          }]
        }
      }
    }
  },
  data() {
    return {
      options: {
        colors: ['#49617d'],
        plotOptions: {
          bar: { horizontal: true }
        },
        dataLabels: {
          style: {
            fontSize: '14px',
            fontFamily: '"Fira Sans", sans-serif'
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
          categories: ['metric'],
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
