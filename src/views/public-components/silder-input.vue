<template>
  <div class="block">
    <el-slider v-model="value" class="slider" show-input></el-slider>
  </div>
</template>

<script>
export default {
  name: "silder-input",
  data() {
    return {
      value: 0
    };
  }
};
</script>

<style>
.block .el-slider__button-wrapper .el-tooltip,
.el-slider__button-wrapper:after {
  display: none;
}
.block .el-slider__input {
  width: 100px;
}
</style>