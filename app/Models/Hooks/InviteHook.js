'use strict'

const User = use('App/Models/User')
const Kue = use('Kue')
const Job = use('App/Jobs/InvitationEmail')
const Env = use('Env')

const InviteHook = exports = module.exports = {}

InviteHook.sendInvitationEmail = async (invite) => {
  const { email } = invite
  const invited = await User.findBy('email', email)
  if (invited) {
    await invited.teams().attach(invite.team_id)
  } else {
    const user = await invite.user().fetch()
    const team = await invite.team().fetch()
    const link = `${Env.get('FRONT_URL')}/signup`

    Kue.dispatch(Job.key, { user, team, email, link }, { attemps: 3 })
  }
}
