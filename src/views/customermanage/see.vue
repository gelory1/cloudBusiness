<template>
  <div class="see">
    <Layout class="layout" style="color:black;font-size:15px">
      <div class="header_top">
        <Icon type="ios-arrow-left" @click="goBack"></Icon>
        <span @click="goBack">返回</span>
        <Button
          type="primary"
          size="large"
          style="float:right;width:80px;"
          @click="goEdit"
        >编辑</Button>
      </div>

      <header class="header_mid">
        <h2>{{data.name}}</h2>
        <p v-show="((data||{}).data||{}).customer_no.length===0" style="color:#000000;">暂无编号</p>
        <p>{{((data||{}).data||{}).customer_no}}</p>
        <div class="header_div">
          <div>
            <span class="icon">
              <Icon type="person-stalker"></Icon>
            </span>
            <span v-show="!data.nature||data.nature.length===0" style="color:#000000;">暂无</span>
            <span>{{data.nature}}</span>
          </div>
          <div>
            <span class="icon">
              <Icon type="ribbon-a"></Icon>
            </span>
            <span v-show="!data.level||data.level.length===0" style="color:#000000;">暂无</span>
            <span>{{data.level}}</span>
          </div>
          <div>
            <span class="icon">
              <Icon type="android-pin"></Icon>
            </span>
            <span v-show="!data.city||data.city.length===0" style="color:#000000;">暂无</span>
            <span>{{data.city}}</span>
          </div>
          <div>
            <span class="icon">
              <Icon type="android-person"></Icon>
            </span>
            <span v-show="!data.salesman||data.salesman.length===0" style="color:#000000;">暂无</span>
            <span>{{data.salesman}}</span>
          </div>
          <div v-if="data.nature == '合作伙伴'">
            <span class="icon">
              <Icon type="navigate"></Icon>
            </span>
            <span v-show="!data.salesman||data.salesman.length===0" style="color:#000000;">暂无</span>
            <span style="color:#4a9af5;cursor:pointer" @click="seeAdress">查看{{0}}条收货地址</span>
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
                <p
                  v-show="!((data||{}).data||{}).customer_abbreviation||((data||{}).data||{}).customer_abbreviation.length===0"
                  style="color:#000000;"
                >暂无</p>
                <p>{{((data||{}).data||{}).customer_abbreviation}}</p>
              </section>
              <section>
                <p>客户性质：</p>
                <p v-show="!data.nature||data.nature.length===0" style="color:#000000;">暂无</p>
                <p>{{data.nature}}</p>
              </section>
              <section>
                <p>客户等级：</p>
                <p v-show="!data.level||data.level.length===0" style="color:#000000;">暂无</p>
                <p>{{data.level}}</p>
              </section>
              <section>
                <p>省份/城市：</p>
                <p v-show="!data.city||data.city.length===0" style="color:#000000;">暂无</p>
                <p>{{data.city}}</p>
              </section>
            </div>
            <div class="select">
              <section>
                <p>行业：</p>
                <p
                  v-show="!industryMap[((data||{}).data||{}).industry]||industryMap[((data||{}).data||{}).industry].length===0"
                  style="color:#000000;"
                >暂无</p>
                <p>{{industryMap[((data||{}).data||{}).industry]}}</p>
              </section>
              <section>
                <p>注册资金：</p>
                <!-- <p
                  v-show="!((data||{}).data||{}).registered_capital||((data||{}).data||{}).registered_capital.length===0"
                  style="color:#000000;"
                >暂无</p> -->
                <p>{{((data||{}).data||{}).registered_capital}}</p>
              </section>
              <section>
                <p>法定代表人：</p>
                <p
                  v-show="!((data||{}).data||{}).charge_person||((data||{}).data||{}).charge_person.length===0"
                  style="color:#000000;"
                >暂无</p>
                <p>{{((data||{}).data||{}).charge_person}}</p>
              </section>
              <section>
                <p>授权资质：</p>
                <p v-show="!((data||{}).data||{}).areaList||((data||{}).data||{}).areaList.length===0" style="color:#000000;">暂无</p>
                <p v-for="(item,index) in ((data||{}).data||{}).areaList" :key="index"><span>{{item.empowerProvince_cn}} {{item.empowerCity_cn}} {{item.empowerArea_cn}}</span></p>
              </section>
            </div>
            <div class="select1">
              <section style="width:46.5%;">
                <p>通讯地址：</p>
                <p
                  v-show="!((data||{}).data||{}).mail_address||((data||{}).data||{}).mail_address.length===0"
                  style="color:#000000;"
                >暂无</p>
                <p>{{((data||{}).data||{}).mail_address}}</p>
              </section>
              <section style="width:23.2%">
                <p>协议编号：</p>
                <p
                  v-show="!((data||{}).data||{}).protocolNumber||((data||{}).data||{}).protocolNumber.length===0"
                  style="color:#000000;"
                >暂无</p>
                <p>{{((data||{}).data||{}).protocolNumber}}</p>
              </section>
              <section style="width:23%;">
                <p>
                  保证金：
                  <span class="eye" @click="eyeClick">
                    <Icon type="eye"></Icon>
                  </span>
                </p>
                <p v-show="eye1Show">{{((data||{}).data||{}).bond_amount}}</p>
                <p v-show="eyeShow">********</p>
              </section>
            </div>
            <div class="select1">
              <section style="width:46.5%;float:left;margin-bottom:0px;">
                <p class="sele2">关联平台账户：</p>
                <p
                  v-show="(((data||{}).data||{}).platformuser_list||[]).length===0"
                  style="color:#000000;margin-top:5px"
                >暂无</p>
                <span
                  class="bg_p"
                  v-for="(item,index) in ((data||{}).data||{}).platformuser_list"
                  :key="index"
                  style="margin:2px 0px"
                >({{item.platform_id}}){{item.platform_name}}</span>
              </section>
              <section style="width:23.2%;float:left" v-if="data.nature == '合作伙伴'">
                <p class="sele2">授权期限</p>
                <p  style="color:#000000;">{{((data||{}).data||{}).empowerStartTime}}-{{((data||{}).data||{}).empowerEndTime}}</p>
              </section>
              <section style="width:23%;float:left">
                <p class="sele2">邮政编码：</p>
                <p v-show="!((data||{}).data||{}).post_code||((data||{}).data||{}).post_code.length===0" style="color:#000000;">暂无</p>
                <p>{{((data||{}).data||{}).post_code}}</p>
              </section>
            </div>
            <div class="select2" v-if="data.nature == '合作伙伴'">
              <section style="width:90%;float:left;margin-top:15px;">
                <p class="sele2">合作协议（附件）：</p>
                <div>
                  <div class="fj1" v-if="file.name">
                    <section class="fj_img">
                        <img :src="file.img" alt style="width:20px;height:20px;margin:20px 40px" />
                      </section>
                      <section class="fj_sec1" style="margin:10px 0">
                        <a :href="file.address"><p>{{file.name}}</p></a>
                        <p class="fj_p1">
                          <span>{{file.size}}</span> 来自
                          <span>{{file.uploadMan}}</span> |
                          <span>{{file.date}}</span>
                        </p>
                      </section>
                  </div>
                  <p v-else>暂无</p>
                </div>
              </section>
            </div>
          </content>
          <footer style="clear:both;padding-top:10px;">
            <p class="header_p" style="border-bottom:1px solid #d2d2d2;">开票信息</p>
            <p
              v-show="(((data||{}).data||{}).ticket_list||[]).length===0"
              style="color:#8d8d8d;text-align:center;margin-top:40px;"
            >暂无开票信息</p>
            <div
              class="kpxx"
              v-for="(item,index) in ((data||{}).data||{}).ticket_list"
              :key="index"
            >
              <div class="kpxx_head">
                <p>{{item.ticket_customer}}</p>
                <p>{{item.dutyparagraph}}</p>
                <p
                  style="width:23%;float:right"
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
                  style="width:23%;float:right"
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
          <p
            v-show="(((data||{}).data||{}).contacts_list||[]).length===0"
            style="color:#8d8d8d;text-align:center;margin-top:20px;"
          >暂无联系人</p>
          <div class="lxr" v-for="(item,index) in ((data||{}).data||{}).contacts_list" :key="index">
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
export default {
  name: "see",
  data() {
    return {
      eye1Show: false,
      eyeShow: true,
      kpxxShow: false,
      citys: [],
      industryMap: this.$option.customer.industryMap
    };
  },
  methods: {
    seeAdress(){
      this.$router.push({ path: "/setting/addressManage" });
    },
    shrinkClick() {
      this.kpxxShow = !this.kpxxShow;
    },
    eyeClick() {
      this.eye1Show = !this.eye1Show;
      this.eyeShow = !this.eyeShow;
    },
    goBack() {
      this.$router.push("/customermanage/customermanage");
    },
    getCity() {
      let request = {
        typeid: 27003,
        data: [
          {
            province: (this.data.data || {}).empower_province
          }
        ]
      };
      api.XLSELECT(request).then(response => {
        let res = response.data.result.data;
        this.citys = res;
      });
    },
    goEdit(){
      if(!this.$store.state.app.authority.find(a => a.id === 702)){
        this.$Message.error('权限不足！');
        return;
      }
      this.$router.push('/customermanage/edit');
    }
  },
  mounted() {
    this.getCity();

  },
  computed: {
    data() {
      if (Object.keys(this.$store.state.user.customerInfo).length > 0) {
        return this.$store.state.user.customerInfo;
      }
      return JSON.parse(localStorage.getItem("customInfo")) || {};
    },
    file(){
      let file = {};
      if(this.data&&this.data.data&&this.data.data.enclosure){
        file.name = ((this.data || {}).data || {}).enclosure.fileName;
        file.size = ((this.data || {}).data || {}).enclosure.fileSize;
        file.size = file.size >= 1024?((file.size/1024).toFixed(2) + ' KB'): file.size >= 1024*1024?((file.size/(1024*1024)).toFixed(2) + ' MB'):(file.size + ' B');
        file.uploadMan = ((this.data || {}).data || {}).enclosure.accountName;
        file.date = ((this.data || {}).data || {}).enclosure.uploadTime;
        file.address = ((this.data || {}).data || {}).enclosure.enclosureAddress;
        file.id = (((this.data || {}).data || {}).enclosure||{}).enclosureId;
        let fileArr = file.name.split('.');
        let fileType = fileArr[fileArr.length-1];
        file.img = require('../../images/upload/wenjian.png');
        if(/^pdf$/.test(fileType)){
          file.img = require('../../images/upload/pdf.png');
        }else if(/^(txt|doc(x)?)$/.test(fileType)){
          file.img = require('../../images/upload/docx.png');
        }else if(/^(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/.test(fileType)){
          file.img = require('../../images/upload/jpg.png');
        }else if(/^xl(s|t|am)$/.test(fileType)){
          file.img = require('../../images/upload/excel.png');
        };
      }
      return file;
    }
  }
};
</script>

<style>
@import "./customer.css";
@import "../contractmanage/contract.css";
</style>