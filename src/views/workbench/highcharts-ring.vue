<template>
  <div class="ring">
    <div id="container" style="min-width:300px;height:270px;"></div>
  </div>
</template>

<script>
var Highcharts = require("highcharts");
require("highcharts/modules/exporting")(Highcharts);
export default {
  name: "highcharts-ring",
  props: ['reportData'],
  data() {
    return {};
  },
  methods: {
    update(){
      let series = [];
      this.reportData.report_value.forEach(item => {
        series.push(
          {
            name:item.name,
            y:item.value,
            selected: item.name === '已发货'?true:false,
            sliced: item.name === '已发货'?true:false,
          }
        )
      });
    var chart = Highcharts.chart(
      "container",
      {
        chart: {
          // spacing: [40, 0, 40, 0]
        },
        title: {
          floating: true,
          text: this.reportData.report_name
        },
        tooltip: {
          pointFormat: "{series.name}: <b>{point.percentage:.2f}%</b>"
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: {
              enabled: true,
              format: "<b>{point.name}</b>: {point.y:.0f}",
              style: {
                color:
                  (Highcharts.theme && Highcharts.theme.contrastTextColor) ||
                  "black"
              }
            },
            point: {
              events: {
                mouseOver: function(e) {
                  // 鼠标滑过时动态更新标题
                  // 标题更新函数，API 地址：https://api.hcharts.cn/highcharts#Chart.setTitle
                  chart.setTitle({
                    text: e.target.name + "\t" + (e.target.percentage).toFixed(2) + " %"
                  });
                }
                //,
                // click: function(e) { // 同样的可以在点击事件里处理
                //     chart.setTitle({
                //         text: e.point.name+ '\t'+ e.point.y + ' %'
                //     });
                // }
              }
            }
          }
        },
        series: [
          {
            type: "pie",
            innerSize: "80%",
            name: "订单占比",
            data: series
          }
        ]
      },
      function(c) {
        // 图表初始化完毕后的会掉函数
        // 环形图圆心
        var centerY = c.series[0].center[1],
          titleHeight = parseInt(c.title.styles.fontSize);
        // 动态设置标题位置
        c.setTitle({
          y: centerY + titleHeight / 2
        });
      }
    );
    }
  },
  mounted() {
    this.update();
  },
  watch:{
    'reportData.report_id'() {
      this.update();
    }
  }
};
</script>

<style>
text.highcharts-credits{
  display: none
}
</style>