'use strict'
const User = use('App/Models/User')
class SessionController {
  async store ({ request, auth }) {
    const { email, password } = request.all()
    const token = await auth.attempt(email, password)
    if (token) {
      const user = await User.query()
        .where('email', email).first()
      return { token: token.token, user }
    }
    return token
  }
}

module.exports = SessionController
