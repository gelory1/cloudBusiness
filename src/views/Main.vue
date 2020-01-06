<style lang="less">
@import "./main.less";
</style>
<template>
  <div class="main" :class="{'main-hide-text': shrink}">
    <div
      class="sidebar-menu-con"
      :style="{width: shrink?'60px':'250px', overflow: shrink ? 'visible' : 'auto'}"
    >
      <scroll-bar ref="scrollBar">
        <shrinkable-menu
          :shrink="shrink"
          @on-change="handleSubmenuChange"
          :theme="menuTheme"
          :before-push="beforePush"
          :open-names="openedSubmenuArr"
          :menu-list="menuList"
        >
          <div slot="top" class="logo-style" style="background:#528DFF;height:70px;">
            <img src="../images/xllogo.png" alt style="text-align:left;width:50px;margin-top:10px;" />
            <p
              style="color:#ffffff;padding:8px 0 0 0;font-size:20px;display:inline-block;vertical-align:top;margin-top:14px"
            >新联云商务中心</p>
          </div>
        </shrinkable-menu>
      </scroll-bar>
    </div>
    <!-- <div class="main-header-con" :style="{paddingLeft:'190px'}" style="margin:0px 0px 0 10px;height:0px;padding:0">
            <div style="height:70px;background:#528DFF;"></div>
            <div>
                <div>
                    <div class="main-breadcrumb">
                        <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
                    </div>
                </div>
            </div>
    </div> -->
    <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'250px'}">
      <div style="height:70px;background:#528DFF;">
        <div class="header-avator-con">
          <div class="user-dropdown-menu-con">
            <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
              <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown" style="margin-top:20px;">
                <a href="javascript:void(0)" style="color:#ffffff;margin-right:30px;font-size:18px;">
                  <span class="main-user-name">{{ userName }}</span>
                  <Icon type="arrow-down-b"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <!-- <DropdownItem name="ownSpace">个人中心</DropdownItem> -->
                  <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Avatar :src="avatorPath" style="background: #619fe7;margin-left: 10px;"></Avatar>
            </Row>
          </div>
        </div>
      </div>
      <div class="main-breadcrumb">
        <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
      </div>
    </div>
    <!-- 右侧内容页 -->
    <div class="single-page-con" :style="{left: shrink?'60px':'250px'}" ref="content">
      <div class="single-page">
        <keep-alive :include="cachePage">
          <router-view></router-view>
        </keep-alive>
      </div>
    </div>
  </div>
</template>
<script>
import shrinkableMenu from "./main-components/shrinkable-menu/shrinkable-menu.vue";
import tagsPageOpened from "./main-components/tags-page-opened.vue";
import breadcrumbNav from "./main-components/breadcrumb-nav.vue";
import fullScreen from "./main-components/fullscreen.vue";
import lockScreen from "./main-components/lockscreen/lockscreen.vue";
import messageTip from "./main-components/message-tip.vue";
import themeSwitch from "./main-components/theme-switch/theme-switch.vue";
import Cookies from "js-cookie";
import util from "@/libs/util.js";
import scrollBar from "@/views/my-components/scroll-bar/vue-scroller-bars";
import axios from "../api/axios"

export default {
  components: {
    shrinkableMenu,
    tagsPageOpened,
    breadcrumbNav,
    fullScreen,
    lockScreen,
    messageTip,
    themeSwitch,
    scrollBar
  },
  data() {
    return {
      shrink: false,
      userName: "",
      isFullScreen: false,
      openedSubmenuArr: this.$store.state.app.openedSubmenuArr
    };
  },
  computed: {
    menuList() {
      let menuList = [];
      if(this.authority&&this.authority.length>0){
        this.$store.state.app.menuList.forEach(menu => {
          let whiteList = ['/','/setting'];
          if(this.authority.find(a => (a.path).toUpperCase() === (menu.path).toUpperCase())||whiteList.indexOf(menu.path)!==-1){
            let children = [];
            children = menu.children.filter((m,i) => {
              let path = menu.path + '/' + m.name;
              if(this.authority.find(a => a.path === path)||i === 0||whiteList.indexOf(menu.path)!==-1){
                return true
              }
            });
            let address = 'f';
            if(menu.path === '/setting'){
              address = 'fs';
              if(this.authority.find(a => a.path === 'addressManage')){
                address = 't';
              }
            }
            if(address === 'f' || address === 't') menuList.push({
              component:menu.component,
              icon:menu.icon,
              name:menu.name,
              path:menu.path,
              title:menu.title,
              children
            });
          }
        })
      }
      return menuList;
    },
    authority(){
      let authority = [];
      if(JSON.parse(localStorage.getItem('authority'))||this.$store.state.app.authority){
        authority = JSON.parse(localStorage.getItem('authority'))||this.$store.state.app.authority;
      }
      return authority;
    },
    pageTagsList() {
      return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
    },
    currentPath() {
      return this.$store.state.app.currentPath; // 当前面包屑数组
    },
    avatorPath() {
      return localStorage.avatorImgPath;
    },
    cachePage() {
      return this.$store.state.app.cachePage;
    },
    lang() {
      return this.$store.state.app.lang;
    },
    menuTheme() {
      return this.$store.state.app.menuTheme;
    },
    mesCount() {
      return this.$store.state.app.messageCount;
    }
  },
  methods: {
    init() {
      let pathArr = util.setCurrentPath(this, this.$route.name);
      this.$store.commit("updateMenulist");
      if (pathArr.length >= 2) {
        this.$store.commit("addOpenSubmenu", pathArr[1].name);
      }
      this.userName = this.$store.state.user.accountName;
      let messageCount = 3;
      this.messageCount = messageCount.toString();
      this.checkTag(this.$route.name);
      this.$store.commit("setMessageCount", 3);
      if(Cookies.get('user')) this.$store.dispatch('getworkBench',{accountId:this.$store.state.user.accountId,this:this});
      setInterval(() => {
        if(Cookies.get('user')) this.$store.dispatch('getworkBench',{accountId:this.$store.state.user.accountId,this:this});
      },10000*12)
      if(this.$store.state.app.authority.length === 0){
        this.$store.commit('setAutority',this.authority);
      }
      this.getRegions();
      // var websocaket =null;
		 	// if('WebSocket' in window){
			// 	 websocaket = new WebSocket("ws://localhost:8080/WebSockt/WebSocketTest");//用于创建 WebSocket 对象。WebSocketTest对应的是java类的注解值
		 	// }
		 	// else {
			// 	alert("当前浏览器不支持");
			// }
      // //连接发生错误的时候回调方法；
      // websocaket.onerror=function(){
      //                 alert("连接错误");
      // }
      // //连接成功时建立回调方法；
      // websocaket.onopen=function(){
      //     alert("连接成功");
      // }
      // //收到消息的回调方法
      // websocaket.onmessage=function(msg){
      //   setdivInnerHTML(msg.data);
      // }
      // //连接关闭的回调方法
      // websocaket.onclose=function(){
      //   alert("关闭成功");
      // }
    },
    toggleClick() {
      this.shrink = !this.shrink;
    },
    handleClickUserDropdown(name) {
      if (name === "ownSpace") {
        util.openNewPage(this, "ownspace_index");
        this.$router.push({
          name: "ownspace_index"
        });
      } else if (name === "loginout") {
        // 退出登录
        this.$store.commit("logout", this);
        this.$store.commit("clearOpenedSubmenu");
        this.$router.push({
          name: "login"
        });
        this.$store.commit('resetWorkBenchData');
        this.$store.commit('resetShowNotice');
        let authority = [];
        localStorage.setItem('authority',JSON.stringify(authority));//本地保存列表
        this.$store.commit('setAutority',authority);//更新登录列表
        this.$notify.closeAll();
      }
    },
    checkTag(name) {
      let openpageHasTag = this.pageTagsList.some(item => {
        if (item.name === name) {
          return true;
        }
      });
      if (!openpageHasTag) {
        //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
        util.openNewPage(
          this,
          name,
          this.$route.params || {},
          this.$route.query || {}
        );
      }
    },
    handleSubmenuChange(val) {
      // console.log(val)
    },
    beforePush(name) {
      // if (name === 'accesstest_index') {
      //     return false;
      // } else {
      //     return true;
      // }
      return true;
    },
    fullscreenChange(isFullScreen) {
      // console.log(isFullScreen);
    },
    scrollBarResize() {
      if(this.$refs.scrollBar) this.$refs.scrollBar.resize();
    },
    getRegions(){
      let request = {
        typeid: 27012,
        data:[{}]
      }
      this.$http.XLSELECT(request).then(res => {
        let regions = (((res.data||{}).result||{}).dataAll||[]).filter(d => d.level === 1);
        let arr2 = (((res.data||{}).result||{}).dataAll||[]).filter(d => d.level === 2);
        let arr3 = (((res.data||{}).result||{}).dataAll||[]).filter(d => d.level === 3);
        regions.forEach(a1 => {
          a1.children = arr2.filter(a2 => a2.id - a1.id>0&&a2.id-a1.id<10000);
          (a1.children||[]).forEach(a2 => {
            a2.children = arr3.filter(a3 => a3.id - a2.id>0&&a3.id-a2.id<100);
            a2.name = a2.name.replace(/\s+/g,'|');
            let arr = a2.name.split('|');
            a2.name = arr[arr.length - 1];
            (a2.children||[]).forEach(a3 => {
              a3.name = a3.name.replace(/\s+/g,'|');
              let arr2 = a3.name.split('|');
              a3.name = arr2[arr2.length -1];
            })
            if(a2.children.length === 0){
              a2.children = undefined;
            }
          })
          if(a1.children.length === 0){
              a1.children = undefined;
            }
        })
        localStorage.setItem('regions',JSON.stringify(regions));
      });
    }
  },
  watch: {
    $route(to) {
      this.$store.commit("setCurrentPageName", to.name);
      let pathArr = util.setCurrentPath(this, to.name);
      if (pathArr.length > 2) {
        this.$store.commit("addOpenSubmenu", pathArr[1].name);
      }
      this.checkTag(to.name);
      localStorage.currentPageName = to.name;
      window.scrollTo(0, 0)
      this.$nextTick(()=>{
        this.$refs['content'].scrollTo(0,0);
      })
    },
    lang() {
      // util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
    },
    openedSubmenuArr() {
      setTimeout(() => {
        this.scrollBarResize();
      }, 250);
    },
  },
  beforeMount(){
    let accountId = Number(localStorage.accountId);
    let accountName = localStorage.accountName;
    this.$store.commit('setAccountId',accountId);
    this.$store.commit('setAccountName',accountName);
  },
  mounted() {
    this.init();
    window.addEventListener("resize", this.scrollBarResize);
  },
  created() {
    // 显示打开的页面的列表
    this.$store.commit("setOpenedList");
  },
  dispatch() {
    window.removeEventListener("resize", this.scrollBarResize);
  }
};
</script>
<style>
.ivu-avatar, .ivu-avatar>*{
    display:none;
}
.main .layout-text{
  font-size:16px;
}
</style>