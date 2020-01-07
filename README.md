# Adonis SaaS Project Manager - Backend

## What is this project?

This is a personal project made with AdonisJs with the only purpose of learning the Adonis framework and ACL's in a Multi-tenant system. This is only the API, the frontend can be found [here](https://github.com/igorsouza-dev/adonis-saas-frontend).
This software is a project management tool that allows users to manage multiple teams, projects and its members.

## Features

- ACL (adonis-acl)
- Token Authentication
- Queue for mail sending (adonis-kue and Redis)
- Mysql database

## Setup

1. Run `yarn` to install the dependencies
2. Run `cp .env.example .env`
3. At the `.env` file, setup your SMTP configuration and your database config. Don't forget to create your database through your DBMS.
4. The variable `FRONT_URL` is used in the mail template, you should inform your front end base url here
5. Run `adonis migration:run` to create the database tables. Your tables should look like this:
```
+-----------------------+
| invites              |
| permission_role      |
| permission_user_team |
| permissions          |
| projects             |
| role_user_team       |
| roles                |
| teams                |
| tokens               |
| user_teams           |
| users                |
+-----------------------+
```
6. Run `adonis seed` to create the admin user and the default Team. The following row will be added to your database. You can log in with user `admin@gmail.com` and password `123456`.
7. Install Redis and inform your access data in the `.env` file. If you use docker you can run:
``` 
docker run --name redis-name -p 6379:6379 -d -t redis:alpine
```

## Starging server

- Run `adonis serve` to start the api and `adonis kue:listen` to start the Redis Queue

## Routes

- You can import the `Insomnia.json` into [Insomnia](https://insomnia.rest/download/) to test the API without a frontend

| Route         | Verb(s)   | Handler                   | Middleware |
|---------------|-----------|---------------------------|------------|
| /sessions     | POST      | SessionController.store   | av:Session |
| /users        | POST      | UserController.store      | av:User    |
| /register     | HEAD,GET  | UserController.create     |            |
| /teams        | HEAD,GET  | TeamController.index      | auth       |
| /teams        | POST      | TeamController.store      | auth,av:Team|
| /teams/:id    | HEAD,GET  | TeamController.show       | auth       |
| /teams/:id    | PUT,PATCH | TeamController.update     | auth,av:Team|
| /teams/:id    | DELETE    | TeamController.destroy    | auth       |
| /roles        | HEAD,GET  | RoleController.index      | auth       |
| /invites      | POST      | InviteController.store    | auth,team,av:Invite,can:invites_create   |
| /projects     | HEAD,GET  | ProjectController.index   | auth,team  |
| /projects     | POST      | ProjectController.store   | auth,team,av:Project,can:projects_create |
| /projects/:id | HEAD,GET  | ProjectController.show    | auth,team  |
| /projects/:id | PUT,PATCH | ProjectController.update  | auth,team,av:Project,can:projects_create |
| /projects/:id | DELETE    | ProjectController.destroy | auth,team  |
| /members      | HEAD,GET  | MemberController.index    | auth,team  |
| /members/:id  | PUT       | MemberController.update   | auth,team,is:administrator|
| /permissions  | HEAD,GET  | PermissionController.show | auth,team  |

## Middlewares

- Auth = Demands token in header.
- Team = Demands a team slug informed in a TEAM header. This middleware injects a Team object in the request and in the Auth object as the current selected team.
- Can = Middleware for permission checking. Example: `can:projects_create`
- Is = Middleware for role checking. Example: `is:administrator`

## Business Model

- A user can be in multiple teams and a team can have multiple members
- Users can create teams
- Users can create projects inside teams
- Users can only sign up if they have an invitation to be a member of a team
