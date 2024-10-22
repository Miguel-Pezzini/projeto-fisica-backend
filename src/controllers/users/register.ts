import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { app } from '../../app'
import { hash } from 'bcrypt'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    username: z.string(),
    password: z.string().min(6),
    email: z.string().email(),
    dificuldades: z.number().array(),
  })

  const { username, password, email, dificuldades } = bodySchema.parse(request.body)

  const userAlreadyExists = (await app.pg.query('SELECT username FROM users WHERE username = $1', [username])).rows.length > 0;
  const emailAlredyExists = (await app.pg.query('SELECT email FROM users WHERE username = $1', [email])).rows.length > 0;

  if(userAlreadyExists) {
    return reply.status(400).send({success: false, message: 'username alredy exists'})
  }
  if(emailAlredyExists) {
    return reply.status(400).send({success: false, message: 'email alredy exists'})
  }

  const passwordHashed = await hash(password, 6)

  const result = await app.pg.query(
    'INSERT INTO users (username, passwordHashed, email, dificuldade, points) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [username, passwordHashed, email, dificuldades, 0]
  );

  const id = result.rows[0].id

  const token = await reply.jwtSign({
    id
  });

  return reply.status(201).send({success: true, token})
}