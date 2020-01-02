'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Team extends Model {
  static boot () {
    super.boot()
    this.addTrait('@provider:Lucid/Slugify', {
      fields: {
        slug: 'name'
      },
      strategy: 'dbIncrement',
      disableUpdates: false
    })
  }

  users () {
    return this.belongsToMany('App/Models/User')
      .pivotModel('App/Models/UserTeam')
  }

  projects () {
    return this.hasMany('App/Models/Project')
  }
}

module.exports = Team
