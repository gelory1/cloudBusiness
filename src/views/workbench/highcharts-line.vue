<template>
  <div class="line">
    <div id="container1" style="min-width:300px;height:270px"></div>
  </div>
</template>

<script>
var Highcharts = require("highcharts");
require("highcharts/modules/exporting")(Highcharts);
export default {
  name: "highcharts-line",
  data() {
    return {};
  },
  props: ['reportData'],
  methods: {
    update(){
      var chart = Highcharts.chart("container1", {
      chart: {
        type: "spline"
      },
      title: {
        text: this.reportData.report_name
      },
      xAxis: {
        categories: this.reportData.report_value.x_axis
      },
      yAxis: {
        title: {
          text: "数量"
        },
        labels: {
          formatter: function() {
            return this.value;
          }
        }
      },
      tooltip: {
        crosshairs: true,
        shared: true
      },
      plotOptions: {
        spline: {
          marker: {
            radius: 4,
            lineColor: "#666666",
            lineWidth: 1
          }
        }
      },
      series: [
        {
          name: "有效用户",
          marker: {
            symbol: "square"
          },
          data: this.reportData.report_value.y_axis
        }
      ]
    });
    }
  },
  mounted() {
    this.update();
  },
  watch:{
    'reportData.report_id'(){
      this.update();
    }
  }
};
</script>

<style>
</style>