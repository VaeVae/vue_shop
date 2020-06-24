<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input clearable v-model="params.query" @clear='getUserList' placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 数据表格区域 -->
      <el-table :data="userList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch @change="userStateChange(scope.row)" v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-tooltip class="item" effect="dark" content="修改" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 删除 -->
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 分配角色 -->
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
              <el-button type="warning" icon="el-icon-s-tools" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 数据分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户弹窗 -->
    <el-dialog
        title="添加用户" @close='addDialogClose'
        :visible.sync="addDialogVisible"
        width="50%">
        <!-- 弹窗内容部分 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item label="用户名称" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password">
            <el-input v-model="addForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="用户手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 弹窗底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户信息弹窗 -->
      <el-dialog
        title="修改用户信息" @close='editDialogClose'
        :visible.sync="editDialogVisible"
        width="50%">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
          <el-form-item label="用户名称">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="用户手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserConfirm">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    // 验证邮箱
    let checkEmail = (rule,value,callback)=>{
      // 正则：
      let rEmail=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if(rEmail.test(value)){
        return callback();
      }
      callback(new Error('邮箱格式不正确！'))
    }
    // 验证手机号
    let checkMobile = (rule,value,callback)=>{
      let rMobile=/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if(rMobile.test(value)){
        return callback()
      }
      callback(new Error('电话号码格式不正确！'))
    }
    return {
      // 获取用户列表请求参数
      params: {
        // 搜索参数
        query: '',
        // 当前页码
        pagenum: 1,
        // 当前页数据条数
        pagesize: 5
      },
      // 用户列表
      userList: [],
      total: 0,
      // 添加用户弹窗显示与隐藏
      addDialogVisible:false,
      // 添加用户表单数据
      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:'',
      },
      // 添加用户表单验证
      addFormRules:{
        username:[
          { required: true , message: '请输入用户名！' , trigger: 'blur' },
          { min: 3 , max: 10 , message: '用户名在3~10个字符之间' , trigger: 'blur' }
        ],
        password:[
          { required: true , message: '请输入用户密码！' , trigger: 'blur' },
          { min: 6 , max: 15 , message: '用户名在6~15个字符之间' , trigger: 'blur' }
        ],
        email:[
          { required: true , message: '请输入用户邮箱！' , trigger: 'blur' },
          { validator: checkEmail , trigger: 'blur' }
        ],
        mobile:[
          { required: true , message: '请输入用户手机！' , trigger: 'blur' },
          { validator: checkMobile , trigger: 'blur' }
        ],
      },
      // 修改弹窗显示隐藏控制
      editDialogVisible:false,
      // 查询到的用户数据
      editForm:{},
      // 编辑用户表单验证
      editFormRules:{
        email:[
          { required: true , message: '请输入用户邮箱！' , trigger: 'blur' },
          { validator: checkEmail , trigger: 'blur' }
        ],
        mobile:[
          { required: true , message: '请输入用户手机！' , trigger: 'blur' },
          { validator: checkMobile , trigger: 'blur' }
        ],
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.params
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败！')
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听 pagesize 改变事件
    handleSizeChange(val){
        this.params.pagesize = val ;
        this.getUserList();
    },
    // 监听 page 改变事件
    handleCurrentChange(val){
        this.params.pagenum = val ;
        this.getUserList();
    },
    // 监听开关按钮状态改变
    async userStateChange(row){
        // users/:uId/state/:type
        // 使用模板字符串进行拼接
        const { data: res } = await this.$http.put(`users/${row.id}/state/${row.mg_state}`);
        if(res.meta.status !== 200){
            return this.$message.error('更新用户状态失败！')
        }
        this.$message.success('更新用户状态成功！')

    },
    // 关闭弹窗重置表单
    addDialogClose(){
      this.$refs.addFormRef.resetFields()
    },
    // 点击确定添加用户
    addUser(){
      this.$refs.addFormRef.validate((async valid=>{
        // 当校验不通过则不进行下一步的添加操作
        if(!valid) return;
        // 发起添加的操作
        // async 在紧邻的函数上，使用解构将data重命名为res
        const { data:res } = await this.$http.post('users',this.addForm);
        if(res.meta.status !== 201) return this.$message.error('添加用户失败！');
        this.$message.success('添加用户成功！');
        // 关闭弹窗
        this.addDialogVisible = false;
        // 重新获取用户列表，渲染
        this.getUserList();
      }))
    },
    // 点击修改用户信息
    // 修改信息时，列表中返回5个属性可能实际修改的属性大于5个此时就需要重新调用对应的接口来获取该用户对应的需要修改的信息
    async editUser(id){
      console.log(id,typeof id)
      // 通过id来获取对应的用户所需要修改的信息
      const { data:res } = await this.$http.get('users/'+id);
      if(res.meta.status !== 200) return this.$message.error('用户信息查询失败！')
      this.editForm = res.data ;
      // 显示编辑用户弹窗
      this.editDialogVisible = true ;
    },
    // 监听编辑用户弹窗关闭
    editDialogClose(){
      this.$refs.editFormRef.resetFields()
    },
    // 确认修改用户信息
    editUserConfirm(){
      this.$refs.editFormRef.validate(async valid=>{
        if(!valid) return 
        // 验证通过，发起请求
        const { data:res } = await this.$http.put('users/'+this.editForm.id,{
          email:this.editForm.email,
          mobile:this.editForm.mobile
        })
        if(res.meta.status !==200 ) return this.$message.error('修改用户信息失败！')
        // 请求成功之后
        // 关闭弹窗
        this.editDialogVisible=false;
        // 重新请求列表
        this.getUserList();
        // 提示修改成功
        this.$message.success('用户信息修改成功！');
      })
    },
    // 根据用户ID删除用户信息
    async removeUserById(id){
      // this.$confirm返回的是一个promise，成功/确定返回一个字符串，失败/取消则返回一个错误，所以需要使用catch来捕获它返回出去
      // 这样，点击确认之后返回的将会是confirm字符串，而点击取消会返回cancel字符串
      const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err);
      if( result !=='confirm' ) return this.$message.info('已取消删除！')   
      // 点击确认之后，向后台发送请求
      const { data:res } = await this.$http.delete('users/'+id);
      if(res.meta.status !==200 ) return this.$message.error('删除用户失败！')
      this.$message.success('删除用户成功！');
      this.getUserList();
    },
  }
}
</script>
<style lang="less" scoped>
.el-table {
  margin-top: 15px;
  font-size: 12px;
}

.el-pagination {
    margin-top: 15px;
}
</style>