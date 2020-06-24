<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src='../assets/home_header_logo.png'/>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse?'64px':'200px'">
            <!-- 伸缩菜单 -->
            <div class="toggle_btn" @click="toggleCollapse">
                <!-- el-icon-s-fold el-icon-s-unfold     -->
                <i :class="!isCollapse?'el-icon-s-fold':'el-icon-s-unfold'"></i>
            </div>
            <!--侧边栏菜单区域  -->
            <el-menu :default-active="activePath" router :collapse-transition=false :collapse='isCollapse' unique-opened background-color="#333744" text-color="#fff" active-text-color="#409bff">
                <!-- 一级菜单 -->
                <el-submenu :index="'/'+item.path" v-for="item in menuList" :key='item.id'>
                    <!-- 一级菜单模板区域 -->
                    <template slot="title">
                        <!-- 图标 -->
                        <i :class="iconList[item.id]"></i>
                        <!-- 文本 -->
                        <span>{{item.authName}}</span>
                    </template>
                    <!-- 二级菜单 -->
                    <el-menu-item @click="saveNavState('/'+subMenu.path)" :index="'/'+subMenu.path" v-for='subMenu in item.children' :key='subMenu.id'>
                        <template slot="title">
                            <!-- 图标 -->
                            <i class="el-icon-menu"></i>
                            <!-- 文本 -->
                            <span>{{subMenu.authName}}</span>
                        </template>
                    </el-menu-item>
                </el-submenu>
            </el-menu>
        </el-aside>
        <!-- 右侧内容主体 -->
        <el-main>
            <!-- 路由占位符 -->
            <router-view></router-view>
        </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
    data(){
        return{
            // 菜单列表
            menuList:[],
            // 菜单icons
            iconList:{
                '125':'iconfont icon-data',
                '103':'iconfont icon-danju-tianchong',
                '101':'iconfont icon-goodsfill',
                '102':'iconfont icon-danju-tianchong',
                '145':'iconfont icon-data2'
            },
            // 折叠菜单控制
            isCollapse:false,
            // 当前激活路由
            activePath:'',
        }
    },
    created(){
        this.getMenuList();
        this.activePath = window.sessionStorage.getItem('activePath');
        console.log(this.activePath)
    },
    methods: {
        // 退出
        logout() {
            // 点击退出清楚sessionStorage里面的token，并且路由跳转到login
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        // 获取左侧菜单
        async getMenuList(){
            const { data: res } = await this.$http.get('menus');
            if(res.meta.status !==200 ) return this.$message.error(res.meta.msg)
            this.menuList=res.data;
        },
        // 点击切换菜单
        toggleCollapse(){
            this.isCollapse = !this.isCollapse;
        },
        // 存储当前激活菜单
        saveNavState(activePath){
            window.sessionStorage.setItem('activePath',activePath)
            this.activePath=activePath;
        }
    }
}
</script>
<style lang="less" scoped>
.home_container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
        margin-left: 15px;
    }
  }
}

.el-aside {
    background-color: #333744;
    .toggle_btn {
        background-color: #4A5064;
        text-align: center;
        font-size: 16px;
        line-height: 24px;
        color:#fff;
        text-align: center;
        cursor: pointer;
    }
    .el-menu {
        border-right:none;
    }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
    margin-right: 10px;
}
</style>