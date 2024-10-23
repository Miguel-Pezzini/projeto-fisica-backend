import { FastifyReply, FastifyRequest } from 'fastify'
import { app } from '../../app'

export async function fetchUser(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.id

  const result = (await app.pg.query('SELECT * FROM users WHERE id = $1', [userId]));

  const user = result.rows[0];
  if(!user) {
    return reply.status(404).send('User not found')
  }

  const userToFront = {
    username: user.username,
    email: user.email,
    dificuldades: user.dificuldade
  }

  return reply.status(200).send({user: userToFront, success: true})
}