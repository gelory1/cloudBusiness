<template>
  <div class="see">
    <Layout class="layout" style="color:black;font-size:15px">
      <div style="margin:10px 0 30px 0;display:flex;justify-content:space-between;align-items:center">
        <span @click="goBack" style="cursor:pointer;"><Icon type="ios-arrow-left"></Icon> 返回</span>
        <span @click="goEdit" style="cursor:pointer;background-color: #EBF5FE;padding:2px 6px;border-radius:5px" >
          <Icon  type="compose" size="22" style="color: #54A3F6"></Icon>
        </span>
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
            <span v-show="!((data||{}).data||{}).wareHouseAddressCount" style="color:#000000;">暂无</span>
            <span style="color:#4a9af5;cursor:pointer" v-show="((data||{}).data||{}).wareHouseAddressCount>0" @click="seeAdress">查看{{((data||{}).data||{}).wareHouseAddressCount}}条收货地址</span>
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
              <section v-if="data.nature == '合作伙伴'">
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
                <p>运营公司：</p>
                <p
                  v-show="!((data||{}).data||{}).manage_company_cn"
                  style="color:#000000;"
                >暂无</p>
                <p>{{((data||{}).data||{}).manage_company_cn}}</p>
              </section>
            </div>
            <div class="select1">
              <section style="width:23%;">
                <p>通讯地址：</p>
                <p
                  v-show="!((data||{}).data||{}).mail_address||((data||{}).data||{}).mail_address.length===0"
                  style="color:#000000;"
                >暂无</p>
                <el-tooltip effect="dark" :content="((data||{}).data||{}).mail_address" placement="top">
                  <div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                    <span>{{((data||{}).data||{}).mail_address}}</span>
                  </div>
                </el-tooltip>
              </section>
              <section style="width:23%;" v-if="data.nature == '合作伙伴'">
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
              <section style="width:23%;float:left;margin-bottom:0px;" v-if="data.nature !== '合作伙伴'">
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
              <section style="width:23%;float:left">
                <p class="sele2">邮政编码：</p>
                <p v-show="!((data||{}).data||{}).post_code||((data||{}).data||{}).post_code.length===0" style="color:#000000;">暂无</p>
                <p>{{((data||{}).data||{}).post_code}}</p>
              </section>
            </div>
            <div class="select2" v-if="data.nature == '合作伙伴'">
              <section style="width:95%;float:left;margin-top:15px;">
                <p class="sele2">合作协议（附件）：</p>
                <div>
                  <div style="border:1px solid #ccc;padding:10px;border-radius:5px" v-if="data.nature == '合作伙伴'&&((data.data||{}).areaList||[]).length>0">
                    <div style="margin-bottom:10px">
                      <span style="font-weight:200;color:black;margin-right:10px">相关授权协议</span>
                    </div>
                    <ul>
                      <li v-for="item in contracts" :key="item.id">
                        <div style="display:flex;justify-content: space-between;align-items:baseline;padding:10px;background-color: #F7F7F7;margin-top:5px">
                          <div style="margin-right:20px">
                            <Icon type="ios-list-outline" size="18"></Icon>
                          </div>
                          <div style="width:180px;text-align:center;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;">
                            <el-tooltip placement="top">
                            <span style="vertical-align: text-bottom">{{item.contact_no}}</span>
                              <div slot="content">
                                <p>{{item.contact_no}}</p>
                              </div>
                            </el-tooltip>
                          </div>
                          <div style="width:170px;text-align:center">
                            <span style="vertical-align: text-bottom;">{{item.startTime.split(' ')[0]}} 至 {{item.endTime.split(' ')[0]}}</span>
                          </div>
                          <div style="width:140px;text-align:center;">
                            <el-tooltip placement="top">
                            <p style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;"><span v-for="(i,index) in item.city" :key="index">{{i[0] + ' ' + (i[1]||'') + ' ' + (i[2]||'')}}</span></p>
                              <div slot="content">
                                <p v-for="(i,index) in item.city" :key="index">{{i[0] + ' ' + (i[1]||'') + ' ' + (i[2]||'')}}</p>
                              </div>
                            </el-tooltip>
                          </div>
                         <div style="width:180px;text-align:center;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;">
                            <a :href="item.url" v-if="item.url">
                              <Icon type="ios-download-outline" size="18"></Icon>
                              <el-tooltip placement="top">
                                <span style="vertical-align: text-bottom;">{{item.name}}</span>
                                <div slot="content">
                                  <p>{{item.name}}</p>
                                </div>
                              </el-tooltip>
                              
                            </a>
                            <span v-else>无协议</span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <p v-else>暂无</p>
                </div>
              </section>
            </div>
            
          </content>
          <footer style="clear:both;padding-top:10px;">
            <p class="header_p" style="border-bottom:1px solid #d2d2d2;padding-bottom:5px;">开票信息</p>
            <p
              v-show="(((data||{}).data||{}).ticket_list||[]).length===0"
              style="color:#8d8d8d;text-align:center;margin-top:30px;"
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
                <div class="kpxx_sec"  style="clear:both;">
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
          <div style="padding:10px;border-bottom:1px dashed #a3a0a0;">联系人</div>
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
      industryMap: this.$option.customer.industryMap,
      contracts:[]
    };
  },
  methods: {
    seeAdress(){
      this.$router.push({ path: "/setting/addressManage",query:{name:(this.data||{}).name,no:((this.data||{}).data||{}).customer_no} });
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
    goEdit(){
      if(!this.$store.state.app.authority.find(a => a.id === 702)){
        this.$Message.error('权限不足！');
        return;
      }
      this.$router.push('/customermanage/edit');
    }
  },
  mounted() {
    (((this.data || {}).data || {}).areaList||[]).forEach(a => {
        let item = {};
        item.name = a.fileName;
        item.contact_no = a.protocolNumber;
        item.url = a.fileAddress;
        if(!this.contracts.find(c => c.contact_no === item.contact_no )){
          item.city = [];
          item.city.push([
            a.empowerProvince,a.empowerCity,a.empowerArea
          ])
        }else{
          let obj = this.contracts.find(c => c.contact_no === item.contact_no );
          obj.city.push([
            a.empowerProvince,a.empowerCity,a.empowerArea
          ])
        }
        item.startTime = a.empowerStartTime;
        item.endTime = a.empowerEndTime;
        if(!this.contracts.find(c => c.contact_no === item.contact_no )) this.contracts.push(item);
      })
  },
  computed: {
    data() {
      if (Object.keys(this.$store.state.user.customerInfo).length > 0) {
        return this.$store.state.user.customerInfo;
      }
      return JSON.parse(localStorage.getItem("customInfo")) || {};
    }
  }
};
</script>

<style>
@import "./customer.css";
@import "../contractmanage/contract.css";
</style>