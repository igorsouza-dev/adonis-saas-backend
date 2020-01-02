'use strict'
const Role = use('Adonis/Acl/Role')

class RoleController {
  async index ({ request }) {
    const roles = await Role.all()
    return roles
  }
}

module.exports = RoleController
