<template>
  <div class="dropdown">
    <Dropdown placement="bottom-start" @on-click="dropDownClick">
      <a href="javascript:void(0)" name="ck">
        <Icon type="android-more-vertical" style="font-size:20px;color:black"></Icon>
      </a>
      <DropdownMenu slot="list">
        <DropdownItem name="ck">查看</DropdownItem>
        <DropdownItem name="bj">编辑</DropdownItem>
        <DropdownItem name="sc">删除</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
export default {
  name: "dropdown",
  data() {
    return {};
  },
  methods: {
    dropDownClick(name) {
      var _self = this;
      if (name == "ck") {
        _self.$router.push({ path: "/customermanage/see" });
      } else if (name == "bj") {
        _self.$router.push({ path: "/customermanage/edit" });
      } else if (name == "sc") {
      }
    }
  }
};
</script>

<style>
.ivu-dropdown .ivu-select-dropdown {
  text-align: center;
}
</style>