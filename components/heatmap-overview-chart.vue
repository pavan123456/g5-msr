<template>
  <div>
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
      default () {
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
  data () {
    return {
      options: {
        stroke: { width: 4 },
        dataLabels: {
          style: {
            fontSize: '18px',
            fontFamily: '"Fira Sans", sans-serif',
            colors: ['#fff']
          }
        },
        legend: { show: false },
        grid: { show: false },
        chart: {
          background: '#fff',
          fontFamily: '"Fira Sans", sans-serif',
          toolbar: { show: false }
        },
        plotOptions: {
          heatmap: {
            radius: 5,
            enableShades: false,
            shadeIntensity: 0.2,
            useFillColorAsStroke: false,
            colorScale: {
              ranges: [
                { from: 0, to: 1, color: '#e8e8e8', foreColor: '#e8e8e8' },
                { from: 1, to: 2, color: '#82c9c9' },
                { from: 3, to: 5, color: '#feb800' },
                { from: 6, to: 10, color: '#f39d1f' },
                { from: 11, to: 20, color: '#ff7800' },
                { from: 21, to: 50, color: '#94abd7' },
                { from: 51, to: 200, color: '#234082' },
                { from: 201, to: 1000, color: '#0b233f' }
              ]
            }
          }
        },
        xaxis: {
          axisBorder: { show: false },
          axisTicks: { show: false },
          labels: {
            show: true,
            rotate: -45,
            rotateAlways: true,
            offsetY: 0,
            style: {
              colors: '#a8a8a8',
              fontSize: 12,
              cssClass: 'text-uppercase'
            }
          },
          max: 200
        },
        yaxis: {
          axisBorder: { show: false },
          labels: {
            style: {
              colors: '#000',
              fontSize: 14,
              cssClass: 'text-uppercase',
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
