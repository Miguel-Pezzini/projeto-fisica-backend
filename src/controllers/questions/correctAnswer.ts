import { FastifyReply, FastifyRequest } from 'fastify'
import { app } from '../../app'
import { z } from 'zod'

export async function correctAnswer(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    points: z.number(),
  })

  const { points } = bodySchema.parse(request.body)

  const userId = request.user.id

  await app.pg.query('UPDATE users SET points = points + $1 WHERE id = $2', [points, userId])

  return reply.status(200).send('Pontuou')
}