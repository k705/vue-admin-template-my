<template>
  <div>
    <el-card shadow="hover" v-if="showTree">
      <el-form inline>
        <el-form-item>
          <el-input
            placeholder="角色名称"
            v-model="roleInfo.roleName"
          ></el-input>
        </el-form-item>
        <el-button
          type="primary"
          size="default"
          @click="searchRole"
          icon="el-search"
          >查询</el-button
        >
        <el-button @click="resetRole">清空</el-button>
      </el-form>

      <!-- card body -->
      <div>
        <template>
          <el-button type="primary" @click="showAddRole = true">添加</el-button>
          <el-button type="danger">批量删除</el-button>
        </template>
      </div>

      <el-table
        border
        stripe
        style="margin-top: 20px; width: 960px"
        :data="roleInfo"
        v-loading="listLoading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="序号" type="index" width="80">
        </el-table-column>
        <el-table-column label="角色名称">
          <template v-slot="{ row }">
            <template v-if="row.edit">
              <el-input v-model="row.roleName" size="small"></el-input>
              <el-button
                type="warning"
                size="small"
                icon="el-icon-refresh"
                @click="cancelEdit(row)"
                >取消</el-button
              >
            </template>
            <span v-else>{{ row.roleName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template v-slot="{ row }">
            <el-button
              type="info "
              icon="el-icon-info"
              size="small"
              title="分配权限"
              @click="
                $router.push(
                  `/acl/role/auth?id=${row.id}&roleName=${row.roleName}`
                )
              "
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-check"
              size="small"
              title="更新角色"
              @click="updateRole(row)"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              title="修改角色"
              @click="row.edit = true"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              title="删除角色"
              @click="deleteRole(row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="sizeChange"
        @current-change="currentChange"
        :page-sizes="[3, 5, 7]"
        :current-page="current"
        :page-size="pageSize"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
      >
      </el-pagination>
      <el-dialog title="添加角色" width="30%" :visible.sync="showAddRole">
        <p>请输入新名称</p>
        <el-input v-model="addRoleName"></el-input>
        <template>
          <span>
            <el-button @click="showAddRole = false">取消</el-button>
            <el-button type="primary" @click="addRole">确认</el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>

    <el-card v-else>
      <el-input disabled :value="$route.query.roleName"></el-input>
      <el-tree
        style="margin: 20px 0"
        ref="treeRef"
        :data="allPermissions"
        node-key="id"
        show-checkbox
        default-expand-all
        :props="defaultProps"
      />
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-card>
  </div>
</template>

<script>
import {
  reqGetRoleInfoByPage,
  reqSaveRole,
  reqUpdateRole,
  reqDeleteRole,
  reqPermissionToAssign,
} from "@/api/role";

export default {
  name: "trademark",
  data() {
    return {
      total: 0,
      current: 1, // 当前页码
      pageSize: 5, // 每页数量
      roleInfo: [
        {
          id: "",
          gmtCreate: "",
          gmtModified: "",
          roleName: "",
          // remark: "",
          originRoleName: "",
        },
      ],
      dialogUserVisible: false,
      listLoading: false,
      messageType: "",
      searchRoleName: "",
      listLoading: false,
      showAddRole: false,
      addRoleName: "",
      allRolePermission: [],
      showRolePermission: false,
      selectedRoles: [],

      allRolePermission: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
    };
  },

  mounted() {
    //1. 初始化品牌列表
    this.getRoleInfoByPage();

    this.init();
  },

  methods: {
    //1. 初始化请求品牌列表数据函数封装
    async getRoleInfoByPage() {
      this.listLoading = true;
      try {
        const result = await reqGetRoleInfoByPage(this.current, this.pageSize, {
          roleName: this.searchRoleName,
        });
        this.roleInfo = result.data.items.map((item) => {
          item.edit = false; // 用于标识是否显示编辑输入框的属性
          item.originRoleName = item.roleName; // 缓存角色名称, 用于取消
          return item;
        });
        // console.log(this.roleInfo);
        this.total = result.data.total;
        this.listLoading = false;
      } catch (e) {}
    },
    // 监听分页器当前页码变化
    currentChange(v) {
      this.current = v;
      this.getRoleInfoByPage();
    },
    // 监听分页器每页显示条数变化
    sizeChange(v) {
      this.pageSize = v;
      this.getRoleInfoByPage();
    },
    searchRole() {
      this.searchRoleName = this.roleInfo.roleName;
      this.getRoleInfoByPage();
    },
    resetRole() {
      this.searchRoleName = "";
      this.roleInfo.roleName = "";
      this.getRoleInfoByPage();
    },

    cancelEdit(row) {
      row.roleName = row.originRoleName;
      row.edit = false;
    },

    async updateRole(data) {
      await reqUpdateRole(data);
      this.getRoleInfoByPage();
    },
    async addRole() {
      await reqSaveRole(this.addRoleName);
      console.log(this.addRoleName);
      this.getRoleInfoByPage();
      this.showAddRole = false;
      this.addRoleName = "";
    },
    // 删除
    async deleteRole(row) {
      // console.log(row);
      await reqDeleteRole(row.id);
      this.getRoleInfoByPage();
    },
    // 批量删除
    handleSelectionChange(selection) {
      this.selectedRoles = selection;
    },



    init() {
      const roleId = this.$route.query.id;
      getPermissions(roleId);
    },
    //1. 初始化请求品牌列表数据函数封装
    async getAllRolePermission(roleId) {
      const res = await reqGetAssignRole(roleId);
      this.allRolePermission = res.data.children;
      const checkedIds = this.getCheckedIds(allPermissions);
      this.$refs.treeRef.setCheckedKeys(checkedIds);
    },

    getCheckedIds(auths, initArr) {
      auths.forEach((item) => {
        if (item.select && item.level === 4) {
          initArr.push(item.id);
        } else if (item.children) {
          getCheckedIds(item.children, initArr);
        }
      });
      return initArr;
    },

    /*
  保存权限列表
  */
    save() {
      // 得到所有全选的id
      const checkedIds = this.$refs.treeRef?.getCheckedKeys();
      // 得到所有半选的id
      const halfCheckedIds = this.$refs.treeRef?.getHalfCheckedKeys();
      // 合并全选和半选的id， 并用逗号连接成串
      var ids = checkedIds?.concat(halfCheckedIds).join(",");

      reqAssignRole(this.$route.query.id, ids).then(async () => {
        // 跳转到角色列表页面
        this.$router.replace("/acl/role/list");
        // 跳转完成后, 如果分配的是当前用户角色的权限, 刷新一下浏览器
        // const roleName = this.$route.query.roleName;
        /* if (userInfoStore.userInfo.roles.includes(roleName)) {
          window.location.reload();
        } */
      });
    },

    /*
  取消
  */
    cancel() {
      // 跳转到角色列表
      this.$router.replace("/acl/role/list");
    },
  },
  watch: {},
  computed: {
    // categoryIsShow() {},
  },
};
</script>

<style scoped></style>
