<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="卡密" prop="cardKey">
            <el-input v-model="queryParams.cardKey" placeholder="请输入卡密" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="卡密类型" prop="cardType">
            <el-select v-model="queryParams.cardType" placeholder="请选择卡密类型" clearable>
              <el-option
                v-for="dict in card_carmi_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
              <el-option
                v-for="dict in card_carmi_status"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['card:carmi:add']">生成卡密</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['card:carmi:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['card:carmi:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="carmiList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="卡密id" align="center" prop="cardId" v-if="true" />
        <el-table-column label="卡密" align="center" prop="cardKey" />
        <el-table-column label="卡密类型" align="center" prop="cardType">
          <template #default="scope">
            <dict-tag :options="card_carmi_type" :value="scope.row.cardType"/>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="card_carmi_status" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="创建者" align="center" prop="createBy" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['card:carmi:remove']"></el-button>
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
    <!-- 添加或修改卡密对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="carmiFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="卡密数量" prop="cardNum">
          <el-input v-model="form.cardNum" placeholder="请输入卡密数量" />
        </el-form-item>
        <el-form-item label="卡密前缀" prop="cardPre">
          <el-input v-model="form.cardPre" placeholder="请输入卡密前缀" />
        </el-form-item>
        <el-form-item label="卡密类型" prop="cardType">
          <el-select v-model="form.cardType" placeholder="请选择卡密类型">
            <el-option
                v-for="dict in card_carmi_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
                v-for="dict in card_carmi_status"
                :key="dict.value"
                :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
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
  </div>
</template>

<script setup name="Carmi" lang="ts">
import { listCarmi, getCarmi, delCarmi, addCarmi, updateCarmi } from '@/api/card/carmi';
import { CarmiVO, CarmiQuery, CarmiForm } from "@/api/card/carmi/types";
import { ComponentInternalInstance } from 'vue';
import { ElForm } from 'element-plus';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { card_carmi_type, card_carmi_status } = toRefs<any>(proxy?.useDict('card_carmi_type', 'card_carmi_status'));

const carmiList = ref<CarmiVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref(ElForm);
const carmiFormRef = ref(ElForm);

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: CarmiForm = {
  cardId: undefined,
  cardNum: undefined,
  cardPre: undefined,
  cardType: undefined,
  status: undefined,
  remark: undefined
}

const data = reactive<PageData<CarmiForm, CarmiQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    cardKey: undefined,
    cardType: undefined,
    status: undefined,
  },
  rules: {
    cardId: [
      { required: true, message: "卡密id不能为空", trigger: "blur" }
    ],
    cardNum: [
      { required: true, message: "卡密数量不能为空", trigger: "blur" }
    ],
    cardType: [
      { required: true, message: "卡密类型不能为空", trigger: "change" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ],
  }
});


const { queryParams, form, rules } = toRefs(data);

/** 查询卡密列表 */
const getList = async () => {
  loading.value = true;
  const res = await listCarmi(queryParams.value);
  carmiList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  carmiFormRef.value.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: CarmiVO[]) => {
  ids.value = selection.map(item => item.cardId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  dialog.visible = true;
  dialog.title = "生成卡密";
  nextTick(() => {
    reset();
  });
}

/** 提交按钮 */
const submitForm = () => {
  carmiFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      await addCarmi(form.value).finally(() =>  buttonLoading.value = false);
      proxy?.$modal.msgSuccess("生成卡密成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: CarmiVO) => {
  const _cardIds = row?.cardId || ids.value;
  await proxy?.$modal.confirm('是否确认删除卡密编号为"' + _cardIds + '"的数据项？').finally(() => loading.value = false);
  await delCarmi(_cardIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('card/carmi/export', {
    ...queryParams.value
  }, `carmi_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
