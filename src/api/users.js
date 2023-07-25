// /admin/acl/user/{page}/{limit

import request from '@/utils/request'


export function reqGetUserInfoByPage(page = 1, limit = 5, searchParams) {
  return request.get(`/admin/acl/user/${page}/${limit}`, {
    params: searchParams
  });
}


// POST /admin/acl/user/save
export const reqSaveOrUpdateUser = (user) => {
  if (user.id) {
    return request.put(`/admin/acl/user/update`, user);
  }
  return request.post(`/admin/acl/user/save`, user);
};

// GET /admin/acl/user/toAssign/{userId}
export function reqAssignRoleByUserId(userId) {
  return request.get(`/admin/acl/user/toAssign/${userId}`);
}

// /admin/acl/user/doAssign
export function reqDoAssignRoleById(userId, roleId) {
  return request.post(`/admin/acl/user/doAssign?userId=${userId}&roleId=${roleId}`);
}
/* export function reqDoAssignRoleById(userId, roleId) {
  return request.post(`/admin/acl/user/doAssign`,null,{params:{userId,roleId}});
} */

// DELETE /admin/acl/user/remove/{id}
export function reqDeleteUserById(id) {
  return request.delete(`/admin/acl/user/remove/${id}`);
}

// POST /admin/acl/user/batchRemove
export function reqBatchDeleteUserById(idList) {
  return request.post(`/admin/acl/user/batchRemove`, idList);
}
