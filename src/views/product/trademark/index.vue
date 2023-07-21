<template>
  <div>
    <el-card shadow="hover">
      <template>
        <el-button
          type="primary"
          icon="el-Plus"
          width="100"
          @click="showAddOrEditTrademarkDialog()"
          >添加</el-button
        >
      </template>
      <el-table :data="trademarkList" stripe>
        <el-table-column
          label="序号"
          type="index"
          width="190"
        ></el-table-column>
        <el-table-column
          label="品牌名称"
          prop="tmName"
          width="250"
        ></el-table-column>
        <el-table-column label="品牌LOGO" width="320">
          <template slot-scope="{ row }">
            <img :src="row.logoUrl" width="200px" /> </template
        ></el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button
              type="warning"
              icon="el-Edit"
              @click="showAddOrEditTrademarkDialog(row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-Delete"
              @click="deleteTrademarkHandler(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChange"
        @current-change="currentChange"
        :page-sizes="[5, 10, 15]"
        :page-size="pageSize"
        layout="prev,pager,next,jumper,->,sizes,total"
        :total="total"
        :current-page="current"
        style="margin-top: 20px"
      >
      </el-pagination>
    </el-card>

    <!----------------------------- 新增品牌------------------------->
    <el-dialog
      :title="messageType + '品牌'"
      :visible.sync="isShowAddOrEditTrademarkDialog"
      width="40%"
    >
      <el-form ref="formRef" :model="formData" label-width="90px" :rules="rules">
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="formData.tmName" />
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img
              v-if="formData.logoUrl"
              :src="formData.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>

      <template>
        <el-button type="primary" @click="addOrUpdateTrademarkHandler()"
          >保存</el-button
        >
        <el-button @click="isShowAddOrEditTrademarkDialog = false"
          >取消</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  reqGetTrademarkList,
  reqUpdateTrademarkList,
  reqDeleteTrademarkList,
  reqAddTrademarkList,
} from "@/api/trademarkList";

export default {
  name: "trademark",
  data() {
    return {
      //品牌数组
      trademarkList: [],
      //总页数
      total: 0,
      //每页条数
      pageSize: 5,
      //当前页码
      current: 1,
      // 编辑或添加
      messageType: "",
      //是否显示增加或编辑商标
      isShowAddOrEditTrademarkDialog: false,
      // 新增的商标数据
      formData: {
        tmName: "",
        logoUrl: "",
      },
      // uploadUrl: `${import.meta.env.VITE_API_URL}/product/upload`,
      uploadUrl: "http://gmall-h5-api.atguigu.cn/admin/product/upload",

      // 表单校验
      rules: {
        tmName: [
          {
            // type: "string",
            // pattern: '\d+'
            // min: 1,
            // max: 10,
            // enum: ["男", "女"],
            // fields: {
            //   a: {type: 'string'},
            //   b: {type: 'number'},
            // },
            required: true,
            min: 1,
            max: 20,
            message: "品牌名称必须是1-20个字符之间",
            trigger: "blur",
          },
        ],
        logoUrl: [
          {
            required: true,
            // 自定义验证的函数
            validator(rule, value, callback) {
              // console.log("当前的value", value);
              if (value === "") {
                // 调用callback表示当前验证结束，callback中传入值表示有错误，不传入任何值，表示验证成功
                callback("品牌LOGO必填");
              } else {
                const ext = value.substring(value.lastIndexOf(".") + 1);
                // console.log(ext);
                if (!["png", "jpg", "gif"].includes(ext)) {
                  callback("品牌LOGO必须是图片");
                } else {
                  callback();
                }
              }
            },
            // message: "品牌LOGO必填",
            // 当失去焦点的时候触发校验
            trigger: "blur",
          },
        ],
      },
    };
  },

  mounted() {
    //1. 初始化品牌列表
    this.getTrademarkList();
  },

  methods: {
    //1. 初始化请求品牌列表数据函数封装
    async getTrademarkList() {
      const result = await reqGetTrademarkList(this.current, this.pageSize);
      this.trademarkList = result.data.records;
      this.total = result.data.total;
      this.current = result.data.current;
      this.pageSize = result.data.size;
    },

    /**
     * 监听分页器的当前页码变化
     */
    currentChange(v) {
      this.current = v;
      this.getTrademarkList();
    },

    /**
     * 监听分页器的每页显示条数变化
     */
    sizeChange(v) {
      this.pageSize = v;
      this.getTrademarkList();
    },

    showAddOrEditTrademarkDialog(data) {
      this.isShowAddOrEditTrademarkDialog = true;
      if (data) {
        this.messageType = "修改";
        this.formData = { ...data };
      } else {
        this.messageType = "新增";
        this.formData = {
          tmName: "",
          logoUrl: "",
        };
      }
       this.$nextTick(() => {

    formRef.clearValidate();
  });
    },
    handleAvatarSuccess(response, uploadFile, uploadFiles) {
      // 把上传成功后的文件地址赋值给 formData.value.logoUrl
      if (response.code == 200) {
        this.formData.logoUrl = response.data;
      }
    },
    async addOrUpdateTrademarkHandler() {
      try {

      const res = await formRef.value.validate();

        if (this.messageType == "新增") {
          await reqAddTrademarkList(this.formData);
        } else {
          await reqUpdateTrademarkList(this.formData);
        }
        this.getTrademarkList();
        this.isShowAddOrEditTrademarkDialog = false;
      } catch (e) {}
    },
    async deleteTrademarkHandler(id) {
      try {
        await reqDeleteTrademarkList(id);
        this.getTrademarkList();
      } catch (e) {}
    },
  },
  watch: {},
  computed: {
    /*  //设置三级分类列表区域是否展示
    categoryIsShow() {
      //首先判断当前是否在首页,如果在首页则永久展示
      if (this.$route.name === "Home") return true;

      //判断鼠标在不在三级分类区域,如果在则返回true,否则返回false
      return this.mouseIsInNav;
    },*/
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
