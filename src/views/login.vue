<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login" @keydown.enter="handleSubmit" style="font-size:26px;">
    <div class="" style="width:550px;margin:0px auto;padding-top:10%">
      <Card :bordered="false">
        <p slot="title" style="font-size:26px;height:50px;padding-top:18px;margin-left:20px">
          <Icon type="log-in"></Icon>欢迎登录
        </p>
        <div class="form-con">
          <Form ref="loginForm" :model="form" :rules="rules">
            <FormItem prop="userName" class="input" style="margin-top:10px">
              <Input v-model="form.userName" placeholder="请输入用户名">
                <span slot="prepend">
                  <Icon :size="30" type="person"  style="padding:0 4px"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem prop="password" class="input">
              <Input type="password" v-model="form.password" placeholder="请输入密码">
                <span slot="prepend">
                  <Icon :size="28" type="locked" style="padding:0 5px"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem class="input">
              <Button @click="handleSubmit" type="primary" long style="font-size:20px;">登录</Button>
            </FormItem>
          </Form>
          <!-- <p class="login-tip">输入用户名和密码即可</p> -->
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import api from "@/api/axios";
export default {
  data() {
    return {
      form: {
        userName: "",
        password: ""
      },
      rules: {
        userName: [
          {
            type: "string",
            required: true,
            message: "账号不能为空",
            trigger: "blur"
          }
        ],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    handleSubmit() {
      this.$refs.loginForm.validate(valid => {
        var request = {
          loginname: this.form.userName,
          password: this.form.password
        };               
        api.GetLOGIN(request).then(response => {
          // alert(JSON.stringify(response.data.code))
          if (valid) {
            if (response.data.code == 0) {
              Cookies.set("user", this.form.userName);
              Cookies.set("password", this.form.password);
              localStorage.setItem('accountId',response.data.accountId);
              this.$store.commit('setAccountId',response.data.accountId);
              this.$router.push({
                name: "home_index"
              });
            } else {
              this.$Message.error("用户名或密码不正确");
            }
          }
        });
      });
    }
  }
};
</script>

<style>
.input{
margin-left:40px;
margin-right:40px;
}
.login .ivu-input-group{
  height:50px;
  border-radius: 6px;
}
 .login .ivu-input-group>.ivu-input:last-child {
   height:50px;
   font-size:18px;
 }
 .login .ivu-btn-primary{
   height:50px;
   margin-top:20px;
   margin-bottom:30px;
 }
 .login .login-con {
    margin:0 auto;
    -webkit-transform: translateY(-60%);
    transform: translateY(-60%);
    width: 300px
    }
  .login .ivu-card{
    background-color:rgba(232, 239, 240, 0.2);
    margin:0 auto;
    /* box-shadow: 0px 0px 3px rgb(206, 205, 205); */
  }
.login .ivu-input{
  border-radius: 6px;
}
</style>
