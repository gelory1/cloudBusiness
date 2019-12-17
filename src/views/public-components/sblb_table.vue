<template>
  <div class="sblb">
    <Table :columns="sblb_columns" :data="sblb_data" size="small"></Table>
    <Page
      :total="40"
      size="small"
      show-elevator
      show-total
      style="text-align:center;margin-top:20px;"
    ></Page>
  </div>
</template>

<script>
export default {
  name: "sblb-table",
  props: {
    sblb_data: Array
  },
  data() {
    return {
      sblb_columns: [
        {
          title: "条码",
          key: "tm"
        },
        {
          title: "存货编码",
          key: "chbm"
        },
        {
          title: "存货名称",
          key: "chmc"
        },
        {
          title: "规格型号",
          key: "ggxh"
        },
        {
          title: "计量单位",
          key: "jldw"
        },
        {
          title: "箱码",
          key: "xm"
        },
        {
          title: "状态",
          key: "zt"
        },
        {
          title: "最新操作时间",
          key: "newtime",
          width:150
        }
      ]
    };
  }
};
</script>

<style>
</style>