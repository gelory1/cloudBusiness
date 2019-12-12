<template>
  <div>
    <Layout class="cpxh">
      <Content
        :style="{background: '#fff', minHeight: scrollHeight}"
        style="padding-left:20px;flex: 0 0 150px;"
      >
        <Menu width="auto" size="small">
          <div class="tip" style="float:left">
            <p class="tooltip" @click="tooltipClick">
              所有产品型号
              <Icon type="ios-arrow-down" style="margin-left:5px;"></Icon>
            </p>
            <div class="tooltipslot" v-show="tooptipShow">
              <p v-for="(item,index) in cpxhpz" @click="selectClick(index)">{{item.mc}}</p>
            </div>
          </div>
          <div style="float:right;margin:15px 0;">
            <Input icon="ios-search" placeholder="请输入内容" style="width: 200px;margin-right:20px;"></Input>
          </div>
          <!-- 取消关联 -->
          <div class="gl_detail">
            <div style="float:left;">
              <p class="xh">www</p>
              <p class="xhbm">
                型号编码：
                <span>123434</span>
              </p>
            </div>
            <Button style="float:right;margin:10px 20px 0 0;">已关联</Button>
            <hr />
            <div class="tip">
              <p class="tooltip" @click="gltooltiplick()">
                关联的仓库产品型号
                <Icon type="ios-arrow-down" style="margin-left:5px;"></Icon>
              </p>
              <div class="tooltipslot" v-show="tooptipglShow" style="height:60px;">
                <p>取消关联</p>
              </div>
              <div class="glxh">
                <span>111</span>
                <span>222</span>
                <span>333</span>
                <span>444</span>
              </div>
            </div>
          </div>
          <!-- 去关联 -->
          <div class="gl_detail">
            <div style="float:left;">
              <p class="xh">www</p>
              <p class="xhbm">
                型号编码：
                <span>123434</span>
              </p>
            </div>
            <Button style="float:right;margin:10px 20px 0 0;">已关联</Button>
            <hr />
            <div style="margin:10px 0;" class="tip">
              <p style="color:#8d8d8d">关联的仓库产品型号</p>
              <div class="wglxh">
                <span @click="gorelation()">
                  <Icon type="ios-plus-empty" style="margin:0 10px;"></Icon>去关联
                </span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
          <!-- 去关联页面 -->
          <Modal v-model="qglmodal" width="800" class="modal">
            <p class="p1">关联仓库产品型号</p>
            <p class="p2">
              将
              <span>xxxxxxxxxx</span>关联到
            </p>
            <div class="div1">
              <Input
                icon="ios-search"
                placeholder="请输入内容"
                style="width: 200px;float:right;margin-bottom:10px;"
              ></Input>
              <Table ref="selection" :columns="glxx_columns" :data="glxx_data" style="clear:both"></Table>
            </div>
          </Modal>
        </Menu>
      </Content>
    </Layout>
  </div>
</template>
<script>
import silderInput from "../../public-components/silder-input.vue";
export default {
  name: "modelConfig",
  components: {
    silderInput
  },
  data() {
    return {
      tooptipShow: false,
      tooptipglShow: false,
      qglmodal: false,
      cpxhpz: [
        {
          mc: "所有类型仓库"
        },
        {
          mc: "成品库"
        },
        {
          mc: "工程物资库"
        },
        {
          mc: "固定资产库"
        }
      ],
      glxx_columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
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
          title: "主计量1",
          key: "zjl"
        },
        {
          title: "发货数量",
          key: "fhsl",
          render: (h, params) => {
            return h("div", [
              h(silderInput, {
                props: {
                  // job_id: params.row.id
                },
                on: {}
              })
            ]);
          }
        }
      ],
      glxx_data: [
        {
          chbm: "John Brown",
          chmc: 18,
          ggxh: "New York No",
          zjl: "个"
        }
      ]
    };
  },
  methods: {
    tooltipClick() {
      this.tooptipShow = !this.tooptipShow;
    },
    gltooltiplick() {
      this.tooptipglShow = !this.tooptipglShow;
    },
    selectClick(index) {
      // alert(index);
    },
    gorelation() {
      this.qglmodal = true;
    }
  },
  computed: {
    scrollHeight(){
      let h = 0;
       h=(document.body.scrollHeight-120)+'px'
      return h;
    },   
  },
};
</script>

<style>
@import '../assetmanage.css';
</style>