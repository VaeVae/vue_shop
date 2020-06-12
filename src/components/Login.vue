<template>
    <div class='login_container'>
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登录表单区域 -->
            <el-form ref='loginFormRef' class="login_form" :model="loginForm" :rules='loginFormRules'>
                <!-- 用户名 -->
                <el-form-item prop='username'>
                    <el-input v-model="loginForm.username" prefix-icon='iconfont icon-user'></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop='password'> 
                    <el-input v-model="loginForm.password" type="password" prefix-icon='iconfont icon-password'></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class='btns'>
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click='resetLoginForm'>重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            // 登录表单的数据绑定对象
            loginForm:{
                username:"admin",
                password:"123456"
            },
            // 登录表单验证规则对象
            loginFormRules:{
                // 验证用户名
                username:[
                    { required: true, message: "请输入登录名称", trigge: "blur"},
                    { min: 3, max: 10, message: "长度在3到10个字符", trigge: "blur"}
                ],
                // 验证密码
                password:[
                    { required: true, message: "请输入登录密码", trigge: "blur"},
                    { min: 6, max: 15, message: "长度在6到15个字符", trigge: "blur"}
                ]
            }
        }
    },
    methods:{
        // 重置表单
        resetLoginForm(){
            this.$refs.loginFormRef.resetFields();
        },
        //
        login(){
            this.$refs.loginFormRef.validate(async valid => {
                // axios请求返回的是一个Promise，使用async和await可以减少结果的层级，简化结果
                // 此结果是一个对象，有六个属性是axios自己封装的其中只有data是接口真正返回的
                // 可以使用结构得到我们想要的数据
                if(!valid) return;
                const { data: res } = await this.$http.post('login',this.loginForm);
                if(res.meta.status !== 200) return this.$Message.error('登录失败！')
                this.$message.success('登录成功！')
                // 登录成功之后得到token保存到客户端的sessionStorage中
                // 除登录之外的页面必须登录之后才能访问
                // token只有在网站打开期间生效，所以存在sessionStorage中
                // 通过编程式导航跳转到后台主页，路由地址为 /home
                window.sessionStorage.setItem('token', res.data.token);
                this.$router.push('/home');
            })
        }
    }
}
</script>
<style lang="less" scoped>
.login_container{
    background-color: #2b4b6b;
    height:100%;
    position: relative;
}

.login_box{
    width:450px;
    height:300px;
    background: #fff;
    border-radius: 3px;
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);

    .avatar_box{
        height: 130px;
        width: 130px;
        border:1px solid #eee;
        border-radius: 50%;
        overflow: hidden;
        padding:10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left:50%;
        transform: translate(-50%,-50%);
        background-color: #fff;
        img{
            width:100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
}

.login_form{
    position: absolute;
    bottom:0;
    width:100%;
    box-sizing: border-box;
    padding:0 20px;
}

.btns {
    display: flex;
    justify-content: flex-end;
}


</style>
