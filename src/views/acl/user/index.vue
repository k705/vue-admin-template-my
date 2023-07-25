<template>
  <el-card shadow="hover">
    <el-form inline>
      <el-form-item>
        <el-input
          v-model="paramsState.username"
          placeholder="用户名"
        ></el-input>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="searchUserInfo"
        >查询</el-button
      >
      <el-button el-icon="el-Delete" @click="emptySearchUserInfo"
        >清空</el-button
      >
    </el-form>
    <div>
      <el-button type="primary" @click="showAddOrEditUser()">添加</el-button>
      <el-button
        type="danger"
        @click="batchDeleteUserById"
        :disabled="tableState.selectedIds.length === 0"
        >批量删除</el-button
      >
    </div>
    <el-table
      :data="tableState.users"
      stripe
      v-loading="listLoading"
      border
      style="margin-top: 20px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" type="index" width="88" />
      <el-table-column prop="username" label="用户名" width="180">
      </el-table-column>
      <el-table-column prop="nickName" label="用户昵称" width="180">
      </el-table-column>
      <el-table-column prop="roleName" label="角色列表" width="220">
      </el-table-column>
      <el-table-column prop="gmtCreate" label="创建时间" width="220">
      </el-table-column>
      <el-table-column prop="gmtModified" label="更新时间" width="220">
      </el-table-column>
      <el-table-column label="操作" width="270">
        <template v-slot="{ row }">
          <el-button
            type="info "
            icon="el-icon-user"
            title="分配角色"
            size="small"
            @click="assignRole(row)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            title="修改用户"
            @click="showAddOrEditUser(row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            title="删除用户"
            @click="deleteUserById(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="paramsState.current"
      :page-size="paramsState.pageSize"
      :total="tableState.total"
      :page-sizes="[5, 10, 20, 30]"
      style="padding: 20px 0"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="currentChange"
      @size-change="sizeChange"
    />

    <el-dialog
      :title="messageType"
      :visible.sync="userState.dialogUserVisible"
      width="30%"
    >
      <el-form
        ref="userFormRef"
        :model="userState.user"
        label-width="80px"
        :rules="userRules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userState.user.username"></el-input>
        </el-form-item>
        <el-form-item
          v-if="messageType != '分配角色'"
          label="用户昵称"
          prop="nickName"
        >
          <el-input v-model="userState.user.nickName"></el-input>
        </el-form-item>
        <el-form-item
          v-if="messageType == '添加用户'"
          label="用户密码"
          prop="password"
        >
          <el-input v-model="userState.user.password"></el-input
        ></el-form-item>

        <el-form-item
          v-if="messageType == '分配角色'"
          label="角色列表"
          size="normal"
        >
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            >全选
          </el-checkbox>
          <div style="margin: 15px 0"></div>
          <el-checkbox-group
            v-model="assignRolesId"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox
              v-for="item in assignRolesList"
              :key="item.id"
              :label="item.id"
            >
              {{ item.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item>
          <template>
            <div>
              <el-button
                @click="userState.dialogUserVisible = false"
                v-if="messageType != '分配角色'"
                >取消</el-button
              >
              <el-button v-else @click="resetRoleData">取消</el-button>
              <el-button
                type="primary"
                @click="addOrEditUserInfo"
                v-if="messageType != '分配角色'"
                >确认</el-button
              >

              <el-button v-else type="primary" @click="doAssignRoleById"
                >确认</el-button
              >
            </div>
          </template>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script>
import {
  reqGetUserInfoByPage,
  reqSaveOrUpdateUser,
  reqAssignRoleByUserId,
  reqDoAssignRoleById,
  reqDeleteUserById,
  reqBatchDeleteUserById,
} from "@/api/users";

export default {
  name: "trademark",
  data() {
    return {
      paramsState: {
        username: "",
        searchUsername: "",
        current: 1, // 当前页码
        pageSize: 5, // 每页数量
      },

      tableState: {
        total: 0,
        users: [],
        selectedIds: [],
      },

      userState: {
        dialogUserVisible: false,
        userLoading: false,
        user: {
          username: "",
          nickName: "",
          password: "",
          id: "",
        },
      },
      listLoading: false,
      /* validatePassword: (rule, value, callback) => {
        if (!value) {
          callback("密码必须输入");
        } else if (!value || value.length < 6) {
          callback("密码不能小于6位");
        } else {
          callback();
        }
      }, */
      messageType: "",
      userRules: {
        username: [
          { required: true, message: "用户名必须输入" },
          { min: 4, message: "用户名不能小于4位" },
        ],
        password: [{ required: true }],
      },
      assignRolesList: [],
      assignRolesId: [],
      isIndeterminate: true,
      checkAll: false,
    };
  },

  mounted() {
    //1. 初始化品牌列表
    this.getUserInfoByPage();
  },

  methods: {
    //1. 初始化请求品牌列表数据函数封装
    async getUserInfoByPage() {
      this.listLoading = true;
      const result = await reqGetUserInfoByPage(
        this.paramsState.current,
        this.paramsState.pageSize,
        {
          username: this.paramsState.searchUsername,
        }
      );
      this.listLoading = false;

      const { items, total } = result.data;
      this.tableState.users = items;
      this.tableState.total = total;
      this.tableState.selectedIds = [];
    },

    /**
     * 监听分页器的当前页码变化
     */
    currentChange(v) {
      this.paramsState.current = v;
      this.getUserInfoByPage();
    },

    /**
     * 监听分页器的每页显示条数变化
     */
    sizeChange(v) {
      this.paramsState.pageSize = v;
      this.getUserInfoByPage();
    },
    //点击查询
    searchUserInfo() {
      this.paramsState.searchUsername = this.paramsState.username;
      this.getUserInfoByPage();
    },
    // 清空查询
    emptySearchUserInfo() {
      this.paramsState.searchUsername = "";
      this.paramsState.username = "";
      this.getUserInfoByPage();
    },

    /* ------------添加------------ */
    showAddOrEditUser(data) {
      this.userState.dialogUserVisible = true;
      if (data) {
        this.messageType = "修改用户";
        this.userState.user = {
          ...data,
        };
      } else {
        this.messageType = "添加用户";
        this.userState.user = {
          username: "",
          nickName: "",
          password: "",
        };
      }
      this.$nextTick(() => {
        this.$refs.userFormRef.clearValidate();
      });
    },
    async addOrEditUserInfo() {
      await this.$refs.userFormRef.validate();
      this.userState.userLoading = true;
      const { user } = this.userState;
      await reqSaveOrUpdateUser(user);
      this.getUserInfoByPage();
      this.userState.dialogUserVisible = false;
      this.userState.userLoading = false;
    },

    /* -----分配角色----- */
    async assignRole(data) {
      this.userState.user.id = data.id;
      this.messageType = "分配角色";
      this.userState.user = {
        ...data,
      };
      this.userState.dialogUserVisible = true;
      try {
        const res = await reqAssignRoleByUserId(data.id);
        const { allRolesList, assignRoles } = res.data;
        this.assignRolesList = allRolesList;
        this.assignRolesId = assignRoles.map((item) => item.id);
        this.checkAll = allRolesList.length === assignRoles.length;
        this.isIndeterminate =
          assignRoles.length > 0 && assignRoles.length < allRolesList.length;
      } catch (e) {}
    },

    handleCheckAllChange(val) {
      // value 当前勾选状态true/false
      // 如果当前全选, userRoleIds就是所有角色id的数组, 否则是空数组
      this.assignRolesId = val
        ? this.assignRolesList.map((item) => item.id)
        : [];
      // 如果当前不是全选也不全不选时, 指定为false
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange() {
      this.checkAll =
        this.assignRolesId.length === this.assignRolesList.length &&
        this.assignRolesList.length > 0;
      this.isIndeterminate =
        this.assignRolesId.length > 0 &&
        this.assignRolesId.length < this.assignRolesList.length;
    },

    /* -----给用户分配角色----- */
    async doAssignRoleById() {
      await reqDoAssignRoleById(
        this.userState.user.id,
        this.assignRolesId.join(",")
      );
      this.getUserInfoByPage();
      this.resetRoleData();
    },

    /*
  重置用户角色的数据
  */

    resetRoleData() {
      this.userState.dialogUserVisible = false;
      this.assignRolesList = [];
      this.assignRolesId = [];
      this.isIndeterminate = false;
      this.checkAll = false;
    },

    // 删除单个

    async deleteUserById(row) {
      await reqDeleteUserById(row.id);
      this.getUserInfoByPage();
    },

    /*
  列表选中状态发生改变的监听回调
  */
    handleSelectionChange(selection) {
      this.tableState.selectedIds = selection.map((item) => item.id);
    },
    async batchDeleteUserById() {
      await reqBatchDeleteUserById(this.tableState.selectedIds);
      console.log(this.tableState.selectedIds);
      this.getUserInfoByPage();
    },
  },
  watch: {},
  computed: {
    // categoryIsShow() {},
  },
};
</script>

<style scoped></style>
