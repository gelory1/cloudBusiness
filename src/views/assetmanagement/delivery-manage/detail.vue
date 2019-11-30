<template>
  <div class="fh_detial layout">
    <Layout style="background:#ffffff;width:95%;minHeight:800px;">
      <div class="header_top" @click="goBack">
        <Icon type="ios-arrow-left"></Icon>
        <span>返回</span>
      </div>
      <header class="fa_mid">
        <Button type="ghost" class="right fa_b">已通过</Button>
        <h2>发货方案详情</h2>

        <div class="fa_div">
          <p>
            <span class="gray">方案编号：</span>
            {{fabh}}
          </p>
          <p>
            <span class="gray">发起时间：</span>
            {{fqsj}}
          </p>
          <p>
            <span class="gray">发起人：</span>
            {{fqr}}
          </p>
          <p>
            <span class="gray">期望发货时间：</span>
            {{fhsj}}之前
          </p>
        </div>
        <div class="fa_div1">
          <p class="left">方案描述：</p>
          <div class="left">
            <p>{{fams}}</p>
            <p>换行文字</p>
          </div>
        </div>
      </header>
      <content>
        <div class="fa_p">
          <p class="left">批次要求： {{}}</p>
          <p>
            <span>
              订单数
              <b>{{}}</b>个
            </span>
            <span>
              设备数
              <b>{{}}</b>台
            </span>
            <span>
              金额
              <b>{{}}</b>元
            </span>
          </p>
        </div>
        <div class="fa_co">
          <div class="fa_c">
            <span style="font-size:16px">出库设备</span>
            <p class="right">
              <span>整体完成度</span>
              <Progress class="pro" :percent="25"></Progress>
            </p>
          </div>
          <div style="clear:both;overflow: hidden;">
            <div style="width:17%;float:left;">
              <Table
                :columns="cksb_columns1"
                ref="cktable"
                :data="outcksb_data1"
                size="small"
                disabled-hover
                highlight-row
                @on-row-click="ckbhClick"
                style="margin:20px 0 0 0px;overflow:auto"
              ></Table>
            </div>
            <div style="width:83%;float:right;">
              <div>
                <p class="ck_p">
                  <span>哈哈哈哈哈哈哈哈哈哈哈哈{{}}</span>
                  <span class="gray">出库单号：</span>
                  {{}}
                </p>
              </div>
              <Table
                :columns="cksb_columns"
                :data="outcksb_data"
                size="small"
                style="margin:0px 0 0 0;overflow:auto"
              ></Table>
            </div>
          </div>
        </div>
      </content>
    </Layout>
  </div>
</template>

<script>
export default {
  name: "detail",
  data() {
    return {
      fabh: "DDDHHH30840284",
      fqsj: "2220-4-4",
      fqr: "刘能",
      fhsj: "5495-58-8",
      fams: "列车就要进站了，请注意请注意",
      cksb_columns1: [
        {
          title: "订单编号",
          key: "ddbh"
        }
      ],
      cksb_columns: [
        {
          title: "存货编码",
          key: "chbm",
          align: "center"
        },
        {
          title: "存货名称",
          key: "chmc",
          align: "center"
        },
        {
          title: "规格型号",
          key: "ggxh",
          align: "center"
        },
        {
          title: "计量单位",
          key: "jldw",
          align: "center"
        },
        {
          title: "数量",
          key: "sl",
          align: "center"
        }
      ],
      outcksb_data1: [],
      outcksb_data: []
    };
  },
  methods: {
    ckbhClick() {},
    goBack() {
      var _self = this;
      _self.$router.go(-1);
    }
  },
  mounted() {}
};
</script>

<style>
@import "../assetmanage.css";
@import "../../customermanage/customer.css";
</style>