'use strict'
const Mail = use('Mail')
const Env = use('Env')

class InvitationEmail {
  static get concurrency () {
    return 1
  }

  static get key () {
    return 'InvitationEmail-job'
  }

  async handle ({ user, team, email, link }) {
    await Mail.send(
      ['emails.invitation', 'emails.invitation-text'],
      { team: team.name, user: user.name, link },
      message => {
        message
          .to(email)
          .from(Env.get('MAIL_FROM'), 'Igor | Omnistack')
          .subject(`Invitation for the team ${team.name}`)
      }
    )
  }
}

module.exports = InvitationEmail
