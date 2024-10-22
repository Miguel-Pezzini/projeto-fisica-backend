//import { authenticate } from './authenticate'
import { login } from './authenticate'
import { changeDifficulty } from './changeDifficulty'
import { changeUser } from './changeUser'
import { fetchUser } from './fetchUser'
import { fetchUsersRanking } from './fetchUserRanking'
import { register } from './register'
import { FastifyInstance } from 'fastify'

export async function usersRoutes(app: FastifyInstance) {
  // Posts
  app.post('/users/register', register)
  app.post('/users/login', login)

  // Put
  app.put('/users/changeUser', changeUser)

  // Patch

  app.patch('/users/changeDifficulty', changeDifficulty)

  // Get

  app.get('/users/fetchUser', fetchUser)
  app.get('/users/fetchUsersRanking', fetchUsersRanking)
}