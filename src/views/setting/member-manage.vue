<template>
  <div class="member">
    <Layout>
      <Sider style="background:#fff;min-height:900px">
        <p class="re_p">所有成员</p>
        <Menu active-name="1-2" :open-names="['1']" style="width:200px">
          <Submenu name="1">
            <template slot="title">
              <Icon type="arrow-down-b"></Icon>我的子账户
            </template>
            <MenuItem :name="index" v-for="(item,index) in childAccount">{{item.name}}</MenuItem>
          </Submenu>
          <Submenu name="2">
            <template slot="title">
              <Icon type="arrow-down-b"></Icon>系统通用角色
            </template>
            <MenuItem :name="index" v-for="(item,index) in systemRole">{{item.name}}</MenuItem>
          </Submenu>
        </Menu>
      </Sider>
      <Content style="background:#fff;margin-left:5px;">
        <Header :style="{background: '#fff',minWidth:'400px',padding:'0 20px'}">
          <div style="float:right;">
            <Input icon="ios-search" placeholder="请输入内容" style="width: 200px;margin-right:20px;" />
            <span class="f_gl">
              <span @click="glkhClick" class="cor">
                <Icon type="ios-flask-outline"></Icon>
                <span>过滤</span>
              </span>
              <!-- 过滤 -->
              <div v-show="glShow" class="gl" style="z-index:999">
                <p class="gl_p">过滤条件</p>
                <span @click="closeglClick" class="gl_p1">X</span>
              </div>
            </span>
            <span style="padding:0 5px">|</span>
            <span class="f-more">
              <span @click="moreClick" class="cor1">
                <Icon type="navicon-round"></Icon>
                <span>更多</span>
              </span>
              <!-- 更多 -->
              <div v-show="moreShow" class="more" style="z-index:999">
                <p @click="addRoleClick">添加角色</p>
                <p @click="addClick">添加用户</p>
              </div>
            </span>
          </div>
        </Header>
        <Table
          ref="selection"
          :columns="member_columns"
          :data="member_data"
          style="margin:20px 10px;"
          class="ww"
        ></Table>
      </Content>
    </Layout>
    <!--查看成员详情弹框 -->
    <Modal v-model="seedetailmodal" width="600" class="aa">
      <p class="ad_p">成员详情</p>
      <div class="cy_div">
        <Button class="use" type="text">启用</Button>
        <div>
          <img src alt class="li" />
          <div class="li yh_mess">
            <p>
              <!-- 图标需判断性别男女 -->
              <span class="cy_name">陈山</span>
              <!-- <Icon class="cy_icon" type="android-contact"></Icon> -->
              <Icon class="cy_icon1" type="android-person"></Icon>
            </p>
            <p class="li">
              <span>登陆账户：</span>
              <span>chengshan</span>
            </p>
          </div>
        </div>
        <div class="yh_sec">
          <section>
            <span class="widrig li">角色：</span>
            <span>{{}}</span>
          </section>
          <section>
            <span class="widrig li">所属企业：</span>
            <span>{{}}</span>
          </section>
          <section>
            <span class="widrig li">职位名称：</span>
            <span>{{}}</span>
          </section>
          <section>
            <span class="widrig li">绑定手机：</span>
            <span>{{}}</span>
            <Icon type="ios-checkmark-outline" style="color:green"></Icon>
          </section>
          <section>
            <span class="widrig li">微信：</span>
            <span>{{}}</span>
          </section>
          <section>
            <span class="widrig li">邮箱：</span>
            <span>{{}}</span>
          </section>
        </div>
        <p class="cy_eait">
          <Button type="ghost" @click="editClick">编辑</Button>
        </p>
      </div>
    </Modal>
    <!-- 添加角色权限弹框 -->
    <Modal v-model="addRolemodal" width="800" class="aa">
      <p class="ad_p" v-show="seeRoleShow">角色权限</p>
      <p class="ad_p" v-show="editRoleShow">角色权限设置</p>
      <p class="ad_p" v-show="addRoleShow">添加新的角色</p>
      <Form
        ref="addroleform"
        :model="addroleform"
        :rules="addrolerule"
        :label-width="80"
        class="formTop"
      >
        <Row>
          <Col span="15">
            <FormItem label="角色" prop="role">
              <Input v-model="addroleform.role" placeholder></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <span style="margin:0px 40px;">
            <Icon type="information-circled" style="color:#8d8d8d"></Icon>&#x3000;设置角色对应的功能权限
          </span>
        </Row>
        <Table
          ref="selection"
          :columns="role_columns"
          :data="role_data"
          style="margin:20px 10px;"
          class="pp"
        ></Table>
        <FormItem style="margin:40px 0 30px 250px;" v-show="seeRoleShow">
          <Button type="primary" style="width:100px" @click="editroleClick">编辑</Button>
        </FormItem>
        <FormItem style="margin:40px 0 30px 250px;" v-show="editRoleShow">
          <Button type="primary" style="width:100px">保存</Button>
        </FormItem>
        <FormItem style="margin:40px 0 30px 160px;" v-show="addRoleShow">
          <Button type="primary" @click="sureaddSubmit('addroleform')">确认并添加</Button>
          <Button @click="addRolemodal = false" style="margin-left:40px;width:100px">取消</Button>
        </FormItem>
      </Form>
    </Modal>
    <!-- 添加用户弹框 -->
    <Modal v-model="addUsermodal" width="800" class="aa">
      <p class="ad_p" v-show="addShow">添加新的成员</p>
      <p class="ad_p" v-show="editShow">编辑成员信息</p>
      <Form
        ref="adduserform"
        :model="adduserform"
        :rules="adduserrule"
        :label-width="150"
        class="formTop"
      >
        <Row>
          <Col span="22">
            <FormItem label="所属企业" prop="ssqy">
              <Select v-model="adduserform.ssqy" clearable filterable>
                <Option value="one">百事可乐</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="15">
            <FormItem label="用户名" prop="name">
              <Input v-model="adduserform.name" placeholder="请输入成员真实姓名"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="15">
            <FormItem label="登陆账户" prop="dlzh">
              <Input v-model="adduserform.dlzh" placeholder></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="15">
            <FormItem label="角色" prop="role">
              <Select v-model="adduserform.role" clearable filterable>
                <Option value="one1">百事可乐</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="15">
            <FormItem label="状态">
              <i-switch v-model="adduserform.switch">
                <span slot="open">On</span>
                <span slot="close">Off</span>
              </i-switch>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="15">
            <FormItem label="性别" prop="gender">
              <RadioGroup v-model="adduserform.gender">
                <Radio label="male">男</Radio>
                <Radio label="female">女</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="15">
            <FormItem label="职位名称" prop="zwmc">
              <Input v-model="adduserform.zwmc" placeholder></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="15">
            <FormItem label="手机号" prop="tel">
              <Input v-model="adduserform.tel" placeholder></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="15">
            <FormItem label="微信" prop="wechat">
              <Input v-model="adduserform.wechat" placeholder></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="15">
            <FormItem label="邮箱" prop="email">
              <Input v-model="adduserform.eamil" placeholder></Input>
            </FormItem>
          </Col>
        </Row>
        <FormItem style="margin:40px 0 50px 70px;" v-show="addShow">
          <Button type="primary" @click="userSubmit('adduserform')">确认并添加</Button>
          <Button
            type="primary"
            @click="saveuserSubmit('adduserform')"
            style="margin:0px 20px"
          >保存并继续添加</Button>
          <Button @click="addUsermodal = false">取消</Button>
        </FormItem>
        <FormItem style="margin:40px 0 50px 170px;" v-show="editShow">
          <Button type="primary" @click="eaitsaveSubmit('adduserform')">保存</Button>
          <Button @click="addUsermodal = false" style="margin-left:20px;">取消</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
export default {
  data() {
    const validatePhone = (rule, value, callback) => {
      if (this.adduserform.tel !== "") {
        var expression = /^1(3|4|5|7|8)\d{9}$/;
        if (expression.test(value) == false) {
          callback(new Error("请输入正确的电话号码"));
        }
      } else {
        callback(new Error("请输入电话号码"));
      }
      callback();
    };
    return {
      glShow: false,
      moreShow: false,
      addRolemodal: false,
      addUsermodal: false,
      seedetailmodal: false,
      editRoleShow: false,
      seeRoleShow: false,
      addRoleShow: false,
      addShow: false,
      editShow: false,
      addroleform: {
        role: ""
      },
      adduserform: {
        ssqy: "",
        name: "",
        dlzh: "",
        role: "",
        switch: true,
        gender: "male",
        zwmc: "",
        tel: "",
        wechat: "",
        email: ""
      },
      adduserrule: {
        ssqy: [
          {
            required: true,
            message: "请选择所属企业",
            trigger: "change"
          }
        ],
        dlzh: [
          {
            required: true,
            message: "请输入登陆账户",
            trigger: "blur"
          }
        ],
        role: [
          {
            required: true,
            message: "请选择角色",
            trigger: "change"
          }
        ],
        tel: [
          {
            required: true,
            trigger: "blur",
            validator: validatePhone
          }
        ]
      },
      role_columns: [
        {
          title: "功能模块",
          key: "mode",
          align: "left",
          width: 100
        },
        {
          title: "功能模块",
          key: "coop",
          align: "left",
          render: (h, params) => {
            let arr = [];
            params.row.coop.forEach((item, index) => {
              arr.push(
                h(
                  "Checkbox",
                  {
                    props: {
                      size: "large",
                      value: item.status,
                      disabled: item.disabled
                    },
                    style: {
                      margin: "10px",
                      marginRight: "30px"
                    },
                    on: {
                      "on-change": () => {
                        console.log(item, index);
                      }
                    }
                  },
                  item.key
                )
              );
            });
            return h("div", arr);
          }
        },
        {
          title: "全选",
          type:"selection",
          key: "allselect",
          align: "right",
          width: 150,
          render: (h, params) => {
            return h("div", [
              h("Checkbox", {
                props: {
                  size: "large",
                  value: params.row.allselect
                },
                style: {
                  marginRight: "5px"
                },
                on: {
                  "on-change": () => {
                    console.log(params.index);
                  }
                }
              })
            ]);
          }
        }
      ],
      role_data: [
        {
          mode: "可见范围",
          coop: [
            { key: "合作企业数据", status: false, disabled: true },
            { key: "自营业务数据", status: true }
          ],
          allselect: false
        },
        {
          mode: "客户管理",
          coop: [
            { key: "客户信息查询", status: true, disabled: true },
            { key: "添加客户档案", status: false },
            { key: "编辑客户档案", status: false },
            { key: "添加联系人", status: false },
            { key: "添加开票信息", status: false },
            { key: "导出客户档案", status: false }
          ],
          allselect: false
        },
        {
          mode: "合同管理",
          coop: [
            { key: "合同台账查询", status: false },
            { key: "申请开票", status: false },
            { key: "下载附件", status: false },
            { key: "合同台账编辑", status: false },
            { key: "查看更新记录", status: false },
            { key: "上传附件", status: false }
          ],
          allselect: false
        },
        {
          mode: "订单管理",
          coop: [
            { key: "订单查询", status: true },
            { key: "导出订单", status: false },
            { key: "申请备货", status: false },
            { key: "支付备货金", status: false }
          ],
          allselect: false
        },
        {
          mode: "资产管理",
          coop: [
            { key: "设备资产查询", status: false },
            { key: "出入库单查询", status: false },
            { key: "发货管理", status: false },
            { key: "查询发货方案", status: false },
            { key: "新建发货方案", status: false },
            { key: "编辑发货方案", status: false },
            { key: "产品型号配置", status: false }
          ],
          allselect: false
        }
      ],
      addrolerule: {
        role: [
          {
            required: true,
            message: "请输入角色名",
            trigger: "blur"
          }
        ]
      },
      member_columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "姓名",
          key: "name",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "a",
                {
                  style: {
                
                  },
                  on: {
                    click: () => {
                      this.seedetailmodal = true;
                    }
                  }
                },
                params.row.name
              )
            ]);
          }
        },
                {
          title: " ",
          width: "50",
          align:"center",
          render: (h, params) => {
            return h(
              "Dropdown",
              {
                // class: "iconShow",
                props: {
                  trigger: "click"
                },
                style: {
                  textAlign: "center"
                },
                on: {
                  "on-click": value => {
                    if (value == "查看") {
                      this.seedetailmodal = true;
                    } else if (value == "编辑") {
                      this.addUsermodal = true;
                      this.editShow = true;
                      this.addShow = false;
                    } else if (value == "删除") {
                      this.$confirm(
                        "此操作将永久删除该文件, 是否继续?",
                        "提示",
                        {
                          confirmButtonText: "确定",
                          cancelButtonText: "取消",
                          type: "warning"
                        }
                      )
                        .then(() => {
                          this.$message({
                            type: "success",
                            message: "删除成功!"
                          });
                        })
                        .catch(() => {
                          this.$message({
                            type: "info",
                            message: "已取消删除"
                          });
                        });
                    }
                  }
                }
              },
              [
                h("a", [
                  h("span", ""),
                  h("Icon", {
                    class:"iconshow",
                    props: {
                      type: "android-more-vertical",
                      size: "18",
                    },
                    
                  })
                ]),
                h(
                  "DropdownMenu",
                  {
                    slot: "list"
                  },
                  this.dropdownItems.map(function(type) {
                    return h(
                      "DropdownItem",
                      {
                        props: {
                          name: type.val
                        }
                      },
                      type.val
                    );
                  })
                )
              ]
            );
          }
        },
        {
          title: "登陆账户",
          key: "accound",
          align: "center"
        },
        {
          title: "职务",
          key: "job",
          align: "center"
        },
        {
          title: "所属企业",
          key: "company",
          align: "center"
        },
        {
          title: "角色",
          key: "role",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "a",
                {
                  style: {
                   
                  },
                  on: {
                    click: () => {
                      this.addRolemodal = true;
                      this.addRoleShow = false;
                      this.seeRoleShow = true;
                      this.editRoleShow = false;
                    }
                  }
                },
                params.row.role
              )
            ]);
          }
        },
        {
          title: "状态",
          key: "state",
          align: "center"
        },
      ],
      member_data: [
        {
          name: "小王",
          role: "军师"
        },
        {
          name: "司马懿",
          role: "军师"
        }
      ],
      childAccount: [
        {
          name: "角色1"
        },
        {
          name: "角色1"
        }
      ],
      systemRole: [
        {
          name: "合作伙伴"
        },
        {
          name: "公司销售"
        },
        {
          name: "综合管控"
        },
        {
          name: "公司财务"
        },
        {
          name: "运营管理员"
        },
        {
          name: "VIP用户（领导）"
        },
        {
          name: "系统管理员"
        }
      ],
      dropdownItems: [
        {
          val: "查看"
        },
        {
          val: "编辑"
        },
        {
          val: "删除"
        }
      ]
    };
  },
  computed:{
  },
  methods: {
    closeglClick() {
      this.glShow = false;
      if (!this.filterStatus) $(".cor").css({ color: "#000000" });
    },
    sureaddSubmit() {},
    userSubmit() {},
    eaitsaveSubmi() {},
    // 更多里面的添加用户
    addClick() {
      this.addUsermodal = true;
      this.addShow = true;
      this.editShow = false;
    },
    // 查看成员详情里面的编辑
    editClick() {
      this.addUsermodal = true;
      this.editShow = true;
      this.addShow = false;
    },
    addRoleClick() {
      this.addRolemodal = true;
      this.addRoleShow = true;
      this.seeRoleShow = false;
      this.editRoleShow = false;
    },
    editroleClick() {
      this.addRolemodal = true;
      this.addRoleShow = false;
      this.seeRoleShow = false;
      this.editRoleShow = true;
    },
    eaitsaveSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$Message.success("Success!");
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    saveuserSubmit() {},
    glkhClick() {
      this.glShow = !this.glShow;
      this.moreShow = false;
      if (this.glShow || this.filterStatus) {
        $(".cor").css({ color: "#4a9af5" });
        $(".cor1").css({ color: "#000000" });
      } else {
        $(".cor").css({ color: "#000000" });
      }
    },
    moreClick() {
      this.moreShow = !this.moreShow;
      this.glShow = false;
      if (this.moreShow) {
        $(".cor1").css({ color: "#4a9af5" });
      } else {
        $(".cor1").css({ color: "#000000" });
      }
    }
  },
  mounted() {

  }
};
</script>

<style>
@import "./setting.css";
@import "../customermanage/customer.css";
.aa .ivu-modal-footer {
  display: none;
}
.pp td.ivu-table-column-left {
  padding: 10px 0;
}
.member .ivu-icon-ios-arrow-down:before {
  display: none;
}
.iconshow{
  display: none;
}
.ivu-table-row:hover .iconshow{
  display: inline-block;
}
</style>