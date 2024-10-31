import { FastifyReply, FastifyRequest } from 'fastify'
import { app } from '../../app'
import { z } from 'zod'

export async function correctAnswer(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    questionId: z.string(),
    points: z.number(),
  })

  const { points, questionId } = bodySchema.parse(request.body)

  const userId = request.user.id

  await app.pg.query(
    `UPDATE users 
     SET points = points + $1, 
         rightQuestions = array_append(rightQuestions, $2) 
     WHERE id = $3`,
    [points, questionId, userId]
  );

  return reply.status(200).send('Pontuou')
}