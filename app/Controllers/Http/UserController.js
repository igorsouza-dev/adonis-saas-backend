'use strict'

const User = use('App/Models/User')
const Invite = use('App/Models/Invite')

class UserController {
  async store ({ request, response, auth }) {
    const data = request.only(['email', 'name', 'password'])

    const teamsQuery = Invite.query().where('email', data.email)
    const teams = await teamsQuery.pluck('team_id')
    if (teams.length === 0) {
      return response.status(401).send({
        error: { message: 'You were not invited to any team' }
      })
    }
    const user = await User.create(data)
    await user.teams().attach(teams)
    await teamsQuery.delete()
    const token = await auth.attempt(data.email, data.password)
    return token
  }

  async create ({ view }) {
    return view.render('register')
  }
}

module.exports = UserController
