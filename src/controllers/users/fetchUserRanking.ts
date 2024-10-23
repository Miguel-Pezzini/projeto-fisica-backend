import { FastifyReply, FastifyRequest } from 'fastify'
import { app } from '../../app'

export async function fetchUsersRanking(request: FastifyRequest, reply: FastifyReply) {
  const result = await app.pg.query(
    'SELECT * FROM users ORDER BY points DESC LIMIT 10'
  );

  const users = result.rows

  const userToFront = users.map((user: { username: String; points: Number; }) => ({
    username: user.username,
    points: user.points,
  }));

  return reply.status(200).send({users: userToFront, success: true})
}