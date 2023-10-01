<template>
  <el-card shadow="never">
    <el-row v-if="flag">
      <el-col :span="24" style="text-align: center">
        <svg t="1691665399558" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4965" width="200" height="200"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#07C160" p-id="4966"></path><path d="M457.728 686.08c-8.192 0-17.408-3.072-23.552-10.24l-174.08-174.08a33.9968 33.9968 0 0 1 0-48.128c13.312-13.312 34.816-13.312 48.128 0l149.504 149.504 258.048-258.048c13.312-13.312 34.816-13.312 48.128 0 13.312 13.312 13.312 34.816 0 48.128L482.304 676.864c-7.168 6.144-15.36 9.216-24.576 9.216z" fill="#FFFFFF" p-id="4967"></path></svg>
      </el-col>
    </el-row>
    <el-row v-if="!flag">
      <el-col :span="24" style="text-align: center">
        <svg t="1691665637176" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6936" width="200" height="200"><path d="M512.260431 5.116531C231.865323 5.116531 4.636089 232.376465 4.636089 512.740874c0 280.33371 227.229235 507.624343 507.624343 507.624343 280.396131 0 507.625366-227.291656 507.624343-507.624343C1019.885797 232.376465 792.656563 5.116531 512.260431 5.116531zM691.775968 647.330198c12.393261 12.393261 12.393261 32.502251 0 44.893466-12.391215 12.393261-32.531927 12.393261-44.923142 0L512.446673 557.790906l-135.333268 135.332245c-12.516058 12.485359-32.718169 12.485359-45.235251 0-12.516058-12.485359-12.516058-32.718169 0-45.205575L467.211423 512.555655 332.745918 378.119827c-12.393261-12.362562-12.393261-32.469506 0-44.833091 12.392238-12.393261 32.531927-12.393261 44.86379 0l134.465504 134.404106 136.325875-136.324852c12.516058-12.486382 32.718169-12.486382 45.234227 0 12.516058 12.486382 12.516058 32.718169 0 45.203528l-136.324852 136.355551L691.775968 647.330198z" fill="#C80000" p-id="6937"></path></svg>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" style="text-align: center">
        {{ msg }}
      </el-col>
    </el-row>
    <el-row v-if="flag">
      <el-col :span="24" style="text-align: center">
        <el-button @click="handleGetCarmi()">支付成功，点击提取卡密</el-button>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import router from "@/router";
import { onMounted } from "vue";
import { getCarmiByOrder } from "@/api/card/carmi";
import { ElMessage } from "element-plus";
const flag = ref(false)
const msg = ref("")
const data = ref()
onMounted(()=>{
  console.log(router.currentRoute.value?.query);
  if (router.currentRoute.value?.query != null && router.currentRoute.value?.query != undefined && router.currentRoute.value?.query.trade_status === "TRADE_SUCCESS"){
    msg.value = "支付成功"
    flag.value = true
    data.value = router.currentRoute.value?.query
  }else {
    msg.value = "支付失败"
    flag.value = false
  }
})

const handleGetCarmi = async () => {
  if (data.value != null){
    const rs = await getCarmiByOrder(data.value);
    if (rs?.code == 200 ){
      if (rs.data != null){
        ElMessage.success(rs.data?.cardKey)
      }else {
        ElMessage.error("获取失败！")
      }
    }else {
      ElMessage.error("获取失败！")
    }
    console.log(rs);
  }else {
    ElMessage.error("获取失败！")
  }
};

</script>

<style scoped lang="scss">
.el-row {
  margin-bottom: 20px;
}

.el-col {
  border-radius: 4px;
}
</style>
