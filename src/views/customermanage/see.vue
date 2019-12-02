<template>
  <div class="see">
    <Layout class="layout">
      <div class="header_top" @click="goBack">
        <Icon type="ios-arrow-left"></Icon>
        <span>返回</span>
      </div>
      <header class="header_mid">
        <h2>{{data.name}}</h2>
        <p>{{((data||{}).data||{}).customer_no}}</p>
        <div class="header_div">
          <div>
            <span class="icon">
              <Icon type="person-stalker"></Icon>
            </span>
            <span>{{data.nature}}</span>
          </div>
          <div>
            <span class="icon">
              <Icon type="ribbon-a"></Icon>
            </span>
            <span>{{data.level}}</span>
          </div>
          <div>
            <span class="icon">
              <Icon type="ios-location-outline"></Icon>
            </span>
            <span>{{data.city}}</span>
          </div>
          <div>
            <span class="icon">
              <Icon type="ios-person-outline"></Icon>
            </span>
            <span>{{data.salesman}}</span>
          </div>
        </div>
      </header>
      <div>
        <div style="width:80%;float:left;">
          <content class="header_con">
            <p class="header_p">基本信息</p>
            <div class="select">
              <section>
                <p>客户简称：</p>
                <p>{{((data||{}).data||{}).customer_abbreviation}}</p>
              </section>
              <section>
                <p>客户性质：</p>
                <p>{{data.nature}}</p>
              </section>
              <section>
                <p>客户等级：</p>
                <p>{{data.level}}</p>
              </section>
              <section>
                <p>省份/城市：</p>
                <p>{{data.city}}</p>
              </section>
            </div>
            <div class="select">
              <section>
                <p>行业：</p>
                <p>{{industryMap[((data||{}).data||{}).industry]}}</p>
              </section>
              <section>
                <p>注册资金：</p>
                <p>{{((data||{}).data||{}).registered_capital}}</p>
              </section>
              <section>
                <p>法定代表人：</p>
                <p>{{((data||{}).data||{}).charge_person}}</p>
              </section>
              <section>
                <p>授权资质：</p>
                <p>{{empower_city}}</p>
              </section>
            </div>
            <div class="select1">
              <section>
                <p>通讯地址：</p>
                <p>{{((data||{}).data||{}).mail_address}}</p>
              </section>
              <section style="width:25%">
                <p>
                  保证金:
                  <span class="eye" @click="eyeClick">
                    <Icon type="eye"></Icon>
                  </span>
                </p>
                <p v-show="eye1Show">{{((data||{}).data||{}).bond_amount}}</p>
                <p v-show="eyeShow">********</p>
              </section>
            </div>
            <div class="select2">
              <section>
                <p class="sele2">关联平台账户：</p>
                <span class="bg_p" v-for="(item,index) in ((data||{}).data||{}).platformuser_list" :key="index" style="margin:0 5px">({{item.platform_id}}){{item.platform_name}}</span>
              </section>
            </div>
          </content>
          <footer>
            <p class="header_p">开票信息</p>
            <div class="kpxx" v-for="(item,index) in ((data||{}).data||{}).ticket_list" :key="index">
              <div class="kpxx_head">
                <p>{{item.ticket_customer}}</p>
                <p>{{item.dutyparagraph}}</p>
                <p
                  style="width:20%;float:right"
                  class="headP"
                  @click="shrinkClick"
                  v-if="kpxxShow == true"
                >
                  <span>收起</span>
                  <span>
                    <Icon type="ios-arrow-up"></Icon>
                  </span>
                </p>
                <p
                  style="width:20%;float:right"
                  class="headP"
                  @click="shrinkClick"
                  v-if="kpxxShow == false"
                >
                  <span>展开</span>
                  <span>
                    <Icon type="ios-arrow-down"></Icon>
                  </span>
                </p>
              </div>
              <div class="kpxx_con" v-show="kpxxShow">
                <div class="kpxx_sec">
                  <section>
                    <p>客户名称：</p>
                    <p>{{item.ticket_unit}}</p>
                  </section>
                  <section>
                    <p>税号：</p>
                    <p>{{item.dutyparagraph}}</p>
                  </section>
                  <section>
                    <p>电话：</p>
                    <p>{{item.phone}}</p>
                  </section>
                </div>
                <div class="kpxx_sec">
                  <section>
                    <p>开户银行：</p>
                    <p>{{item.bank_name}}</p>
                  </section>
                  <section>
                    <p>银行账户：</p>
                    <p>{{item.bank_account}}</p>
                  </section>
                  <section>
                    <p>开票地址：</p>
                    <p>{{item.ticket_address}}</p>
                  </section>
                </div>
                <div class="kpxx_sec">
                  <section>
                    <p>邮寄信息：</p>
                    <p>{{item.post_info}}</p>
                    <p>
                      <span class="kpxx_span">{{item.ticket_contacts}}</span>
                    </p>
                  </section>
                </div>
                <div style="clear:both"></div>
              </div>
            </div>
          </footer>
        </div>
        <div class="lxr_right" style="minHeight:820px">
          <div style="padding:10px;border-bottom:1px solid black;">联系人</div>
          <div class="lxr"   v-for="(item,index) in ((data||{}).data||{}).contacts_list" :key="index">
            <p class="lxr_icon">
              <Icon type="ios-person" />
            </p>
            <div class="lxr_xq" style="height:35px;">
              <p>
                <span>{{item.contact_name}}</span>
                <span class="lxr_cor">{{item.position_name}}</span>
              </p>
              <p>{{item.phone}}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  </div>
</template>

<script>
import api from "@/api/axios";
const industryMap = {
    1: '公共事业及管理组织',
    2: '工业',
    3: '商业住宿餐饮',
    4: '金融房地产及居民服务',
    5: '运输仓储邮政',
    6: '信息计算机和软件',
    7: '农林牧渔水利',
    8: '建筑业',
    9: '军工保密',
    10: '其他'
  };
export default {
  name: "see",
  data() {
    return {
      khda: {
        mc: "海天酱油海天酱油",
        bh: "CDFF3333",
        khxz: "合作",
        jb: "AAAA",
        dz: "南京",
        fr: "张三"
      },
      jbxx: {
        hy: "批发",
        zczj: "6666666666万",
        fr: "郭嘉",
        sqzz: "郑州",
        txdz: "南京",
        bzj: "5000000万"
      },
      kpxx: {
        sh: "3241424324",
        dh: "23443242424",
        khyh: "中国银行",
        yhzh: "2341222312432424",
        kpdz: "南京雨花台",
        yjdz: "南京江宁",
        yjr: "司马懿",
        yjdh: "21657890987"
      },
      lxr:[{
          xm:"郭嘉",
          zc:"军师",
          dh:"123243546546"
      },{
          xm:"郭嘉kkk",
          zc:"军师",
          dh:"123243546546"
      }],
      eye1Show: false,
      eyeShow: true,
      kpxxShow: false,
      citys: [],
      industryMap:industryMap
    };
  },
  methods: {
    shrinkClick() {
      this.kpxxShow = !this.kpxxShow;
    },
    eyeClick() {
      this.eye1Show = !this.eye1Show;
      this.eyeShow = !this.eyeShow;
    },
    goBack() {
      var _self = this;
      _self.$router.go(-1);
    },
    getCity(){
      let request = {
        typeid: 27003,
        data: [
          {
            province:this.$store.state.user.customerInfo.data.empower_province
          }
        ]
      };
      api.XLSELECT(request).then(response => {
        let res = response.data.result.data;
        this.citys = res;
      });
    }
  },
  mounted() {
    this.getCity();
  },
  computed: {
    data(){
      return this.$store.state.user.customerInfo;
    },
    empower_city(){
      let province = this.$store.state.app.provinces.find(c => c.id === ((this.data||{}).data||{}).empower_province)||{};
      let city = this.citys.find(c => c.id === ((this.data||{}).data||{}).empower_city)||{};
      return (province.name||'') + ' ' + (city.name||'');
    }
  }
};
</script>

<style>
@import "./customer.css";
</style>