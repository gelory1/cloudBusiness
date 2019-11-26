<template>
  <div class="datepicker">
      <DatePicker v-model="dksj" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="请选择时间" style="width: 100px"></DatePicker>
  </div>
</template>

<script>
export default {
    name:"datepicker",
    data(){
        return{
            props:{
                dksj:{}
            }
        }
    },
    mothods:{

    },
    mounted(){

    }
}
</script>

<style>

</style>