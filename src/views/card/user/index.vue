<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="86px">
          <el-form-item label="用户账号" prop="userName">
            <el-input v-model="queryParams.userName" placeholder="请输入用户账号" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="用户类型" prop="userType">
            <el-select v-model="queryParams.userType" placeholder="请选择用户类型" clearable>
              <el-option
                v-for="dict in card_user_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="过期时间" style="width: 308px">
            <el-date-picker
              v-model="daterangeExpireTime"
              value-format="YYYY-MM-DD HH:mm:ss"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
            />
          </el-form-item>
          <el-form-item label="帐号状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择帐号状态" clearable>
              <el-option
                v-for="dict in sys_normal_disable"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="最后登录IP" prop="loginIp">
            <el-input v-model="queryParams.loginIp" placeholder="请输入最后登录IP" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['card:user:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['card:user:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['card:user:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['card:user:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="用户ID" align="center" prop="userId" v-if="true" />
        <el-table-column label="用户账号" align="center" prop="userName" />
        <el-table-column label="用户类型" align="center" prop="userType">
          <template #default="scope">
            <dict-tag :options="card_user_type" :value="scope.row.userType"/>
          </template>
        </el-table-column>
        <el-table-column label="过期时间" align="center" prop="expireTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.expireTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <el-switch v-model="scope.row.status" active-value="0" inactive-value="1" @change="handleStatusChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="最后登录IP" align="center" prop="loginIp" />
        <el-table-column label="最后登录时间" align="center" prop="loginDate" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.loginDate, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="续费" placement="top">
              <el-button link type="primary" icon="Wallet" @click="handleExpire(scope.row)" v-hasPermi="['card:user:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['card:user:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="重置密码" placement="top">
              <el-button link type="primary" icon="Key" @click="handleResetPwd(scope.row)" v-hasPermi="['card:user:resetPwd']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['card:user:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>
    <!-- 添加或修改用户信息对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="userFormRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="用户账号" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户账号" />
        </el-form-item>
        <el-form-item v-if="form.userId == undefined" label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入用户密码" />
        </el-form-item>
        <el-form-item label="用户类型" prop="userType">
          <el-select v-model="form.userType" placeholder="请选择用户类型">
            <el-option
              v-for="dict in card_user_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="过期时间" prop="expireTime">
          <el-date-picker clearable
                          v-model="form.expireTime"
                          type="datetime"
                          value-format="YYYY-MM-DD HH:mm:ss"
                          placeholder="请选择过期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="帐号状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in sys_normal_disable"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="最后登录IP" prop="loginIp">
          <el-input v-model="form.loginIp" placeholder="请输入最后登录IP" />
        </el-form-item>
        <el-form-item label="最后登录时间" prop="loginDate">
          <el-date-picker clearable
                          v-model="form.loginDate"
                          type="datetime"
                          value-format="YYYY-MM-DD HH:mm:ss"
                          placeholder="请选择最后登录时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 用户续费对话框 -->
    <el-dialog :title="expiredialog.title" v-model="expiredialog.visible" width="500px" append-to-body>
      <el-form ref="userFormRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="用户账号" prop="userName">
          <el-input v-model="form.userName" disabled placeholder="请输入用户账号" />
        </el-form-item>
        <el-form-item label="卡密" prop="cardKey">
          <el-input v-model="form.cardKey" placeholder="请输入卡密" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitExpireForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="User" lang="ts">
import { listUser, getUser, delUser, addUser, updateUser, changeUserStatus, expireUser,resetUserPwd } from "@/api/card/user";
import { UserVO, UserQuery, UserForm, UserexpireVo } from "@/api/card/user/types";
import { ComponentInternalInstance } from 'vue';
import { ElForm } from 'element-plus';
import { to } from "await-to-js";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { card_user_type, sys_normal_disable } = toRefs<any>(proxy?.useDict('card_user_type', 'sys_normal_disable'));

const userList = ref<UserVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const daterangeExpireTime = ref([]);

const queryFormRef = ref(ElForm);
const userFormRef = ref(ElForm);

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const expiredialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const newForm:UserexpireVo = {
  userId: undefined,
  userName: undefined,
  cardKey : undefined
}

const initFormData: UserForm = {
  userId: undefined,
  userName: undefined,
  userType: undefined,
  password: undefined,
  expireTime: undefined,
  status: undefined,
  loginIp: undefined,
  loginDate: undefined,
  remark: undefined,
  cardKey: undefined,
}
const data = reactive<PageData<UserForm, UserQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userName: undefined,
    userType: undefined,
    expireTime: undefined,
    status: undefined,
    loginIp: undefined,
  },
  rules: {
    userId: [
      { required: true, message: "用户ID不能为空", trigger: "blur" }
    ],
    userName: [
      { required: true, message: "用户账号不能为空", trigger: "blur" }
    ],
    password: [
      { required: true, message: "密码不能为空",trigger:"blur"}
    ],
    userType: [
      { required: true, message: "用户类型不能为空", trigger: "change" }
    ],
    expireTime: [
      { required: true, message: "过期时间不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "帐号状态不能为空", trigger: "change" }
    ],
    cardKey: [
      { required: true, message: "卡密不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询用户信息列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.params = {};
  if (null != daterangeExpireTime && '' != daterangeExpireTime) {
    queryParams.value.params["beginExpireTime"] = daterangeExpireTime.value[0];
    queryParams.value.params["endExpireTime"] = daterangeExpireTime.value[1];
  }
  const res = await listUser(queryParams.value);
  userList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 用户状态修改  */
const handleStatusChange = async (row: UserVO) => {
  let text = row.status === "0" ? "启用" : "停用"
  try {
    await proxy?.$modal.confirm('确认要"' + text + '""' + row.userName + '"用户吗?');
    await changeUserStatus(row.userId, row.status);
    proxy?.$modal.msgSuccess(text + "成功");
  } catch (err) {
    row.status = row.status === "0" ? "1" : "0";
  }
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
  expiredialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  userFormRef.value.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  daterangeExpireTime.value = [];
  queryFormRef.value.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: UserVO[]) => {
  ids.value = selection.map(item => item.userId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 续费 */
const handleExpire = (row?: UserexpireVo) => {
  console.log(row);
  expiredialog.visible = true;
  expiredialog.title = "用户续费";
  nextTick(async () => {
    reset();
    const _userId = row?.userId || ids.value[0]
    const res = await getUser(_userId);
    loading.value = false;
    Object.assign(form.value, res.data);
  });
}

/** 重置密码按钮操作 */
const handleResetPwd = async (row: UserVO) => {
  const [err, res] = await to(ElMessageBox.prompt('请输入"' + row.userName + '"的新密码', "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    closeOnClickModal: false,
    inputPattern: /^.{5,20}$/,
    inputErrorMessage: "用户密码长度必须介于 5 和 20 之间",
  }))
  if (!err) {
    await resetUserPwd(row.userId, res.value);
    proxy?.$modal.msgSuccess("修改成功，新密码是：" + res.value);
  }
}

/** 新增按钮操作 */
const handleAdd = () => {
  dialog.visible = true;
  dialog.title = "添加用户信息";
  nextTick(() => {
    reset();
  });
}

/** 修改按钮操作 */
const handleUpdate = (row?: UserVO) => {
  loading.value = true
  dialog.visible = true;
  dialog.title = "修改用户信息";
  nextTick(async () => {
    reset();
    const _userId = row?.userId || ids.value[0]
    const res = await getUser(_userId);
    loading.value = false;
    Object.assign(form.value, res.data);
  });
}

/** 提交按钮 */
const submitForm = () => {
  userFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.userId) {
        await updateUser(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addUser(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

const submitExpireForm = () => {
  userFormRef.value.validate(async (valid:boolean)=>{
    if (valid){
      buttonLoading.value = true;
      newForm.userName  = form.value.userName;
      newForm.cardKey = form.value.cardKey;
      await expireUser(newForm).finally(() =>  buttonLoading.value = false);
      proxy?.$modal.msgSuccess("续费成功");
      expiredialog.visible = false;
      await getList();
    }
  })
}

/** 删除按钮操作 */
const handleDelete = async (row?: UserVO) => {
  const _userIds = row?.userId || ids.value;
  await proxy?.$modal.confirm('是否确认删除用户信息编号为"' + _userIds + '"的数据项？').finally(() => loading.value = false);
  await delUser(_userIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('card/user/export', {
    ...queryParams.value
  }, `user_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
