<template>
  <div class="addinformat">
    <Layout class="layout" style="min-height:800px;">
      <p class="div_p">开票信息</p>
      <Form
        ref="formAddinformat"
        :model="formAddinformat"
        :rules="ruleAddinformat"
        :label-width="120"
      >
        <Row>
          <Col span="12">
            <FormItem label="客户档案" prop="khda">
              <Select v-model="selectedCustom" clearable filterable>
                <Option v-for="item in customerList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="" :label-width="0" >
              <p  class="newfile">没有找到客户？点击<span @click="editClick">这里新建</span></p>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="客户名称" prop="khmc">
              <Input v-model="formAddinformat.khmc" ></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="税号" prop="sh">
              <Input v-model="formAddinformat.sh" ></Input>
            </FormItem>
          </Col>
        </Row>
         <hr style="width:100%;border:1px dashed #e4e7ed;margin-bottom:25px;">
        <p style="color:#8d8d8d;margin:10px 0 30px 50px"><Icon type="information-circled"></Icon><span> 专用发票必须填写以下信息才为有效凭证</span></p>
        <Row>
          <Col span="12">
            <FormItem label="开票地址" prop="kpdz">
              <Input v-model="formAddinformat.kpdz" ></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="电话" prop="dh">
              <Input v-model="formAddinformat.dh" ></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="开户行" prop="khh">
              <Input v-model="formAddinformat.khh" ></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="银行账号" prop="yhzh">
              <Input v-model="formAddinformat.yhzh" ></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="邮寄地址" prop="yjdz">
              <Input v-model="formAddinformat.yjdz" ></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="联系人及电话" prop="rjdh">
              <Input v-model="formAddinformat.rjdh" ></Input>
            </FormItem>
          </Col>
        </Row>
        <FormItem style="margin:40px 0">
          <Button type="primary" @click="handleSubmit('formAddinformat')">确认并添加</Button>
          <Button @click="handleCancel('formAddinformat')" style="margin-left: 8px">取消</Button>
        </FormItem>
      </Form>
    </Layout>
  </div>
</template>

<script>
export default {
  name: "edit",
  data() {
    const dutyparagraph = (rule, value, callback) => {
      if (
        this.formAddinformat.dutyparagraph !== ""
      ) {
        var expression = /^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/;
        if (expression.test(value) == false) {
          callback(new Error("请出入正确的税号(15、17、18、20位数字字母组合)！"));
        }
      } else {
        callback(new Error("该字段不能为空"));
      }
      callback();
    };
    return {
      formAddinformat: {
        khda: "",
        mail: "",
        khmc:"",
        sh:"",
        kpdz:"",
        dh:"",
        khh:"",
        yhzh:"",
        yjdz:"",
        rjdh:""

      },
      ruleAddinformat: {
        khmc: [
          {
            required: true,
            message: "请填写客户名称",
            trigger: "blur"
          },
        ],
        sh: [
          {
            validator:dutyparagraph,
            trigger: "blur"
          }
        ],
        // kpdz: [
        //   {
        //     required: true,
        //     message: "请填写开票地址1",
        //     trigger: "blur"
        //   }
        // ],
        // dh: [
        //   {
        //     required: true,
        //     message: "请填写电话",
        //     trigger: "blur"
        //   }
        // ],
        // khh: [
        //   {
        //     required: true,
        //     message: "请填写开户行",
        //     trigger: "blur"
        //   }
        // ],
        // yhzh: [
        //   {
        //     required: true,
        //     message: "请填写银行账号",
        //     trigger: "blur"
        //   }
        // ],
        // yjdz: [
        //   {
        //     required: true,
        //     message: "请填写邮寄地址",
        //     trigger: "blur"
        //   }
        // ],
        // rjdh: [
        //   {
        //     required: true,
        //     message: "请填写联系人及电话",
        //     trigger: "blur"
        //   }
        // ],
      },
      customerList:[],
      selectedCustom:''
    };
  },
  methods: {
    handleSubmit(name) {
      if(this.selectedCustom === ''){
        this.$Message.error('请选择客户档案，若列表中未找到，可新增客户！');
        return;
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          let request2 = {
            "typeid":  25003,
            "data": {
              "customerNo": this.selectedCustom,
              "ticketList":[
                {
                  "ticketUnit": this.formAddinformat.khmc,
                  "ticketAddress": this.formAddinformat.kpdz,
                  "phone": this.formAddinformat.dh,
                  "bankName": this.formAddinformat.khh,
                  "bankAccount": this.formAddinformat.yhzh,
                  "postInfo": this.formAddinformat.yjdz,
                  "dutyparagraph": this.formAddinformat.sh,
                  "ticketContacts": this.formAddinformat.rjdh
                }
              ]
            }
          }
          this.$http.SETCUSTOMER(request2).then(response => {
            if(response.data.code === 0){
              this.$Message.success("添加成功!");
              this.$router.push('/customermanage/customermanage');
            }
          },error => {
            this.$Message.error('请按规则填写!');
          })
        } else {
          this.$Message.error("请按规则填写!");
        }
      });
    },
    handleCancel(name) {
      // this.$Message.error("已取消");
      this.$router.go(-1);
    },
    editClick(){
      this.$router.push({ path: "/customermanage/new" });
    },
    getAllCustom(){
      let requst = {
        typeid:27004
      }
      this.$http.XLSELECT(requst).then(response =>{
        let res = response.data.result.data;
        this.customerList = JSON.parse(JSON.stringify(res));
        // this.selectedCustom = this.customerList[0].id;
      })
    },
  },
  computed:{
    data(){
      return this.$store.state.user.customerInfo;
    },
  },
  mounted(){
    this.getAllCustom();
  }
};
</script>

<style>
@import "./customer.css";
</style>