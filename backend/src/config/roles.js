const allRoles = {
  user: [],
  admin: ['getUsers', 'manageUsers', 'apiKey'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
