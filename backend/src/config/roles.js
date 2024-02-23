const rightsEnum = {
  GET_USERS: 'get-users',
  MANAGE_USERS: 'manage-users',
  API_KEY: 'api-key',
  MANAGE_PRODUCTS: 'manage-products',
}

const allRoles = {
  user: [],
  admin: [rightsEnum.GET_USERS, rightsEnum.MANAGE_USERS, rightsEnum.API_KEY, rightsEnum.MANAGE_PRODUCTS],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
  rightsEnum,
};
