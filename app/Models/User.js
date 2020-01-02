'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  teamJoins () {
    return this.hasMany('App/Models/UserTeam')
  }

  teams () {
    return this.belongsToMany('App/Models/Team')
      .pivotModel('App/Models/UserTeam')
  }

  async is (expression) {
    const team = await this.teamJoins()
      .where('team_id', this.currentTeam)
      .first()
    return team.is(expression)
  }

  async can (expression) {
    const team = await this.teamJoins()
      .where('team_id', this.currentTeam)
      .first()
    return team.can(expression)
  }

  async scope (required) {
    const team = await this.teamJoins()
      .where('team_id', this.currentTeam)
      .first()
    return team.scope(required)
  }
}

module.exports = User
