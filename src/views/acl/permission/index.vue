<template>
  <div>菜单管理</div>
</template>

<script>
import { reqGetTrademarkList } from "@/api/trademarkList";

export default {
  name: "trademark",
  data() {
    return {
      //品牌数组
      trademarkList: [],
    };
  },

  mounted() {
    //1. 初始化品牌列表
    this.getTrademarkList();
  },

  methods: {
    //1. 初始化请求品牌列表数据函数封装
    async getTrademarkList() {
      try {
        const result = await reqGetTrademarkList(this.current, this.pageSize);
      } catch (e) {}
      this.trademarkList = result.data.records;
    },
  },
  watch: {},
  computed: {
    categoryIsShow() {},
  },
};
</script>

<style scoped></style>
