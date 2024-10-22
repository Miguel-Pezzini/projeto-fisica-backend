import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { app } from '../../app'
import { compare } from 'bcrypt'

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    username: z.string(),
    password: z.string(),
  })

  const { username, password } = bodySchema.parse(request.body)

  const result = await app.pg.query('SELECT * FROM users WHERE username = $1', [username]);

  console.log(result.rows[0])

  const userExists = result.rows[0];

  if(!userExists) {
    return reply.status(401).send({
      success: false,
      message: 'Invalid username or password'})
  }

  const userPassword = result.rows[0].passwordhashed

  const passwordMatch = await compare(password, userPassword)

  if(!passwordMatch) {
    return reply.status(401).send({
      success: false,
      message: 'Invalid username or password'})
  }

  const resultId = await app.pg.query('SELECT id FROM users WHERE username = $1', [username]);

  const id = resultId.rows[0].id

  const token = await reply.jwtSign({
    id
  });

  console.log('User object:', request.user);

  return reply.status(200).send({success: true, token})
}