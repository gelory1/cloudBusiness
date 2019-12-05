<template>
  <div class="person layout">
    <Layout>
      <Tabs size="small" style="background:#fff;minHeight:900px">
        <TabPane label="基本资料">
          <Form ref="jbzlform" :model="jbzlform" :rules="jbzlrule" :label-width="80" class="formTop">
            <Row>
              <Col span="16">
                <FormItem label="所属企业" prop="ssqy">
                  <Select v-model="jbzlform.ssqy" placeholder>
                    <Option value="1">南京</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
                <FormItem label="登陆账户" prop="dlzh">
                  <Input v-model="jbzlform.dlzh" placeholder disabled></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
                <FormItem label="真实姓名" prop="zsxm">
                  <Input v-model="jbzlform.zsxm" placeholder disabled></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
                <FormItem label="所属企业" prop="js">
                  <Select v-model="jbzlform.js" placeholder>
                    <Option value="1">军事</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
                <FormItem label="性别" prop="gender">
                  <RadioGroup v-model="jbzlform.gender">
                    <Radio label="male">男</Radio>
                    <Radio label="famale">女</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
                <FormItem label="职位名称" prop="zwmc">
                  <Input v-model="jbzlform.zwmc" placeholder></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
                <FormItem label="绑定手机" prop="tel">
                  <Input v-model="jbzlform.tel" placeholder disabled></Input>
                </FormItem>
              </Col>
              <Col span="8" style="margin-left:40px;">
                <Button>重新绑定</Button>
              </Col>
            </Row>
            <Row>
              <Col span="8">
                <FormItem label="微信" prop="wechat">
                  <Input v-model="jbzlform.wechat" placeholder></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
                <FormItem label="邮箱" prop="email">
                  <Input v-model="jbzlform.email" placeholder></Input>
                </FormItem>
              </Col>
            </Row>
            <FormItem>
              <Button type="primary" @click="handleSubmit()">保存</Button>
            </FormItem>
          </Form>
        </TabPane>
        <TabPane label="修改头像">
          <div class="chang_h">
            <p style="width:60px;" class="left">
              <b class="red">*</b>头像
            </p>
            <div class="left">
              <p>
                <span class="gray">
                  <Icon type="information-circled" class="icon"></Icon>仅支持JPG、PNG格式,文件小于1M(方形图)
                </span>
              </p>
              <section class="head_img"></section>
              <div class="sc_but">
                <Button>上传头像</Button>
                <Button>恢复默认</Button>
              </div>
              <Button type="primary">保存</Button>
            </div>
          </div>
        </TabPane>
        <TabPane label="修改密码">
          <Form ref="changemmform" :model="changemmform" :label-width="80" class="formTop">
            <Row>
              <Col span="8">
                <FormItem label="当前密码" prop="dqmm">
                  <Input v-model="changemmform.dqmm" placeholder></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
                <FormItem label="新密码" prop="xmm">
                  <Input v-model="changemmform.xmm" placeholder></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
                <FormItem label="确认新密码" prop="qrxmm">
                  <Input v-model="changemmform.qrxmm" placeholder></Input>
                </FormItem>
              </Col>
            </Row>
            <FormItem>
              <Button type="primary" @click="handleSubmit()">保存</Button>
            </FormItem>
          </Form>
        </TabPane>
      </Tabs>
    </Layout>
  </div>
</template>

<script>
export default {
  name: "person",
  data() {
    return {
      changemmform:{
        dqmm:"",
        xmm:"",
        qrxmm:""
      },
      jbzlform: {
        ssqy: "",
        dlzh: "",
        zsxm: "",
        js: "",
        gender: "male",
        zwmc: "",
        tel: "",
        wechat: "",
        email: ""
      },
      jbzlrule: {
        ssqy: [
          {
            required: true,
            message: "The ssqy cannot be empty",
            trigger: "blur"
          }
        ],
        dlzh: [
          {
            required: true,
            message: "The dlzh cannot be empty",
            trigger: "blur"
          }
        ],
        zsxm: [
          {
            required: true,
            message: "The zsxm cannot be empty",
            trigger: "blur"
          }
        ],
        js: [
          {
            required: true,
            message: "The js cannot be empty",
            trigger: "blur"
          }
        ],
        tel: [
          {
            required: true,
            message: "The tel cannot be empty",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    andleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$Message.success("Success!");
        } else {
          this.$Message.error("Fail!");
        }
      });
    }
  },
  mounted() {}
};
</script>

<style>
@import "./setting.css";
</style>