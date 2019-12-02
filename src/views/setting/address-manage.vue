<template>
  <div class="address layout">
    <Layout style="background:#fff;min-height:800px">
      <p class="ad_p">收货地址列表</p>
      <div>
        <div v-for="(item,index) in shdzData" class="ad_div">
          <p class="p_span">
            <b>{{item.company}}</b>
            <span class="ad_span" v-if="index == 0">默认</span>
            <!--  -->
            <span class="icon">
              <Dropdown  style="float:right;text-align:center">
                <a href="javascript:void(0)">
                  <Icon type="android-more-vertical"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem>编辑</DropdownItem>
                  <DropdownItem>设为默认</DropdownItem>
                  <DropdownItem>删除</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </span>
          </p>
          <p class="p_span1">
            <span>{{item.name}}</span>
            <span>&#x3000;{{item.tel}}</span>
          </p>
          <p>{{item.address}}</p>
        </div>
      </div>
      <div class="add_adress">
        <p @click="addadressmodal = true" style="cursor:pointer">+&#x3000;添加新地址</p>
      </div>
    </Layout>
    <!-- 添加地址弹框 -->
    <Modal v-model="addadressmodal" width="800" class="aa">
      <p class="ad_p">添加新地址</p>
      <Form
        ref="addadressform"
        :model="addadressform"
        :rules="addadressrule"
        :label-width="150"
        class="formTop"
      >
        <Row>
          <Col span="15">
            <FormItem label="地址标识" prop="dzbs">
              <Input v-model="addadressform.dzbs" placeholder></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="15">
            <FormItem label="联系人姓名" prop="name">
              <Input v-model="addadressform.name" placeholder></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="15">
            <FormItem label="联系电话" prop="tel">
              <Input v-model="addadressform.tel" placeholder></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="20">
            <FormItem label="详细地址" prop="xxdz">
              <Input
                v-model="addadressform.xxdz"
                type="textarea"
                :autosize="{minRows: 2,maxRows: 5}"
                placeholder
              ></Input>
            </FormItem>
          </Col>
        </Row>
        <FormItem style="margin:40px 0 30px 160px;">
          <Button type="primary" @click="saveSubmit('addadressform')">保存</Button>
          <Button type="primary" @click="addadressmodal = false" style="margin-left:20px">取消</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
export default {
  name: "addressmanage",
  data() {
    return {
      addadressmodal: false,
      addadressform: {
        dzbs: "",
        name: "",
        tel: "",
        xxdz: ""
      },
      shdzData: [
        {
          company: "南京还挺鲲鹏工程物资库",
          name: "刘协",
          tel: "1234567890",
          address: "苏州高新区蓝天白云路"
        },
        {
          company: "南京还挺鲲鹏工程物资库",
          name: "刘协",
          tel: "1234567890",
          address: "苏州高新区蓝天白云路"
        },
        {
          company: "南京还挺鲲鹏工程物资库",
          name: "刘协",
          tel: "1234567890",
          address: "苏州高新区蓝天白云路"
        }
      ],
      addadressrule: {
        dzbs: [
          {
            required: true,
            message: "The dzbs cannot be empty",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "The name cannot be empty",
            trigger: "blur"
          }
        ],
        tel: [
          {
            required: true,
            message: "The tel cannot be empty",
            trigger: "blur"
          }
        ],
        xxdz: [
          {
            required: true,
            message: "The xxdz cannot be empty",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    czClick() {},
    saveSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$Message.success("Success!");
        } else {
          this.$Message.error("Fail!");
        }
      });
    }
  },
  mounted() {
    $(".ad_div").hover(
      function() {
        $(this).css({ border: "1px solid #3896f5" });
        $(this)
          .find(".icon")
          .css({ display: "inline" });
      },
      function() {
        $(this).css({ border: "1px solid #e6e4e4" });
        $(this)
          .find(".icon")
          .css({ display: "none" });
      }
    );
  }
};
</script>

<style>
@import "./setting.css";
.aa .ivu-modal-footer {
  display: none;
}
</style>