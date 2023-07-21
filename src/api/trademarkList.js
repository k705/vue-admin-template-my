import request from '@/utils/request'
// http://gmall-h5-api.atguigu.cn/admin/product/baseTrademark/{page}/{limit}

export const reqGetTrademarkList = (page=1,limit=5) => {
  return request.get(`/admin/product/baseTrademark/${page}/${limit}`);
};

// http://gmall-h5-api.atguigu.cn/admin/product/baseTrademark/save

export const reqAddTrademarkList = (data) => {
  return request.post(`/admin/product/baseTrademark/save`,data);
};

// http://gmall-h5-api.atguigu.cn/admin/product/baseTrademark/update
export const reqUpdateTrademarkList = (data) => {
  return request.put(`/admin/product/baseTrademark/update`,data);
};

// http://gmall-h5-api.atguigu.cn/admin/product/baseTrademark/remove/{id}
export const reqDeleteTrademarkList = (id) => {
  return request.delete(`/admin/product/baseTrademark/remove/${id}`);
};
