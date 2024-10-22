import { FastifyReply, FastifyRequest } from 'fastify'
import { app } from '../../app'
import { z } from 'zod'

export async function fetchQuestion(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    conteudo: z.string(),
  })

  const { conteudo } = bodySchema.parse(request.body)

  const userId = request.user.id

  const resultUser = await app.pg.query('SELECT * FROM users WHERE id = $1', [userId])

  const userDificuldades = resultUser.rows[0].dificuldade

  const result = await app.pg.query(
    `
    SELECT *
    FROM questions
    WHERE conteudo = $1
    AND ARRAY_LENGTH(ARRAY(
      SELECT unnest(dificuldade) 
      INTERSECT 
      SELECT unnest($2::int[])
    ), 1) > 0;
    `,
    [conteudo, userDificuldades]
  );

  const question = result.rows[0]

  const questionToFront = {
    text: question.content,
    conteudo: question.conteudo,
    answers: [question.alternativa_a, question.alternativa_b, question.alternativa_c, question.alternativa_d, question.alternativa_e],
    correctAnswer: question.answer,
    dificuldades: question.dificuldade,
    points: question.points,
  }

  return reply.status(200).send(questionToFront)
}