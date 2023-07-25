import request from "@/utils/request"

// GET /admin/acl/role/{page}/{limit}

export function reqGetRoleInfoByPage(page = 1, limit = 5, searchParams) {
  return request.get(`/admin/acl/role/${page}/${limit}`, { params: searchParams })
}


// POST /admin/acl/role/save

export const reqSaveRole = (roleName) => {
  return request.post(`/admin/acl/role/save`, { roleName });
};

// PUT /admin/acl/role/update
export const reqUpdateRole = (role) => {
  return request.put(`/admin/acl/role/update`, role);
};

// DELETE /admin/acl/role/remove/{id}
export const reqDeleteRole = (id) => {
  return request.delete(`/admin/acl/role/remove/${id}`);
};

// http://gmall-h5-api.atguigu.cn/admin/acl/permission/toAssign/{roleId}
export const reqGetAssignRole = (roleId) => {
  return request.get(`/admin/acl/permission/toAssign/${roleId}`);
};

export const reqAssignRole = (roleId,permissionId) => {
  return request.post(`/admin/acl/permission/doAssign`, null, {
    params:{roleId,permissionId}
  });
};


