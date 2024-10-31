import { FastifyReply, FastifyRequest } from 'fastify'
import { app } from '../../app'
import { z } from 'zod'

export async function createQuestion(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    content: z.string(),
    conteudo: z.enum(['cinematica', 'dinamica', 'estatica', 'gravitacao']),
    points: z.number(),
    alternativa_a: z.string(),
    alternativa_b: z.string(),
    alternativa_c: z.string(),
    alternativa_d: z.string(),
    alternativa_e: z.string(),
    answer: z.enum(['a', 'b', 'c', 'd', 'e']),
    dificuldade: z.array(z.number()),
  })

  const { content, conteudo, points, alternativa_a, alternativa_b, alternativa_c, alternativa_d, alternativa_e, answer, dificuldade } = bodySchema.parse(request.body)

  await app.pg.query(
    `
    INSERT INTO questions (content, conteudo, points, alternativa_a, alternativa_b, alternativa_c, alternativa_d, alternativa_e, answer, dificuldade)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
`,  [content, conteudo, points, alternativa_a, alternativa_b, alternativa_c, alternativa_d, alternativa_e, answer, dificuldade]);


  return reply.status(200)
}