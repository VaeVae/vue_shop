<template>
    <div>
        <el-button type="info" @click="logout">退出</el-button>
    </div>
</template>
<script>
export default {
    methods:{
        logout(){
            // 点击退出清楚sessionStorage里面的token，并且路由跳转到login
            window.sessionStorage.clear();
            this.$router.push('/login')
        }
    }
}
</script>
<style lang="less" scoped>

</style>