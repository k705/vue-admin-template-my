<template>
  <div>
    <el-input disabled :value="$route.query.roleName"></el-input>
    <el-tree
      style="margin: 20px 0"
      ref="treeRef"
      :data="allRolePermission"
      node-key="id"
      show-checkbox
      default-expand-all
      :props="defaultProps"
    />
    <el-button type="primary" @click="save">保存</el-button>
    <el-button @click="cancel">取消</el-button>
  </div>
</template>

<script>
import { reqGetAssignRole, reqAssignRole } from "@/api/role";
import { state } from "@/store/modules/user.js";

export default {
  name: "trademark",
  data() {
    return {
      //品牌数组
      allRolePermission: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      const roleId = this.$route.query.id;
      console.log(roleId);
      this.getAllRolePermission(roleId);
    },
    //1. 初始化请求品牌列表数据函数封装
    async getAllRolePermission(roleId) {
      const res = await reqGetAssignRole(roleId);
      this.allRolePermission = res.data.children;
      const checkedIds = this.getCheckedIds(this.allRolePermission);
      this.$refs.treeRef.setCheckedKeys(checkedIds);
    },

    getCheckedIds(auths, initArr = []) {
      auths.forEach((item) => {
        if (item.select && item.level === 4) {
          initArr.push(item.id);
        } else if (item.children) {
          this.getCheckedIds(item.children, initArr);
        }
      });
      return initArr;
    },

    /*
  保存权限列表
  */
    async save() {
      // 得到所有全选的id
      const checkedIds = this.$refs.treeRef.getCheckedKeys();
      // 得到所有半选的id
      const halfCheckedIds = this.$refs.treeRef.getHalfCheckedKeys();
      // 合并全选和半选的id， 并用逗号连接成串
      var ids = checkedIds.concat(halfCheckedIds).join(",");

      await reqAssignRole(this.$route.query.id, ids);
      this.$router.replace("/role");
      // 跳转完成后, 如果分配的是当前用户角色的权限, 刷新一下浏览器
     /*  const roleName = this.$route.query.roleName;
      if (state.roles.includes(roleName)) {
        console.log(state.roles);
        window.location.reload();
      } */

      //  .then(async () => {
      // 跳转到角色列表页面
      //  this.$router.replace("/acl/role/list");
      // 跳转完成后, 如果分配的是当前用户角色的权限, 刷新一下浏览器
      // const roleName = this.$route.query.roleName;
      /* if (userInfoStore.userInfo.roles.includes(roleName)) {
          window.location.reload();
        } */
      // });
    },

    // 取消

    cancel() {
      // 跳转到角色列表
      this.$router.replace("/role");
    },
  },
  watch: {},
  computed: {
    // categoryIsShow() {},
  },
};
</script>

<style scoped></style>
