import { FastifyReply, FastifyRequest } from 'fastify'
import { app } from '../../app'
import { z } from 'zod'

export async function changeDifficulty(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    dificuldades: z.number().array(),
  })

  const { dificuldades } = bodySchema.parse(request.body)
  
  const userId = request.user.id
  
  await app.pg.query(
    'UPDATE users SET dificuldade = $1 WHERE id = $2 RETURNING *',
    [dificuldades, userId]
  );


  return reply.status(204).send(dificuldades)
}