import { FastifyReply, FastifyRequest } from 'fastify'
import { app } from '../../app'
import { z } from 'zod'

export async function changeUser(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    username: z.string(),
    email: z.string().email(),
  })

  const { username, email } = bodySchema.parse(request.body)
  
  const userId = request.user.id

  const result = (await app.pg.query('SELECT * FROM users WHERE id = $1', [userId]));

  const user = result.rows[0];

  if(user.email !== email && user.username !== username) {
    const userAlreadyExists = (await app.pg.query('SELECT username FROM users WHERE username = $1', [username])).rows.length > 0;
    const emailAlredyExists = (await app.pg.query('SELECT email FROM users WHERE username = $1', [email])).rows.length > 0;

    if(userAlreadyExists) {
      return reply.status(401).send('username alredy exists')
    }
    if(emailAlredyExists) {
      return reply.status(401).send('E-mail alredy exists')
    }
  }

  if(user.email == email) {
    const userAlreadyExists = (await app.pg.query('SELECT username FROM users WHERE username = $1', [username])).rows.length > 0;

    if(userAlreadyExists) {
      return reply.status(401).send('User alredy exists')
    }
  }
  if(user.username == username) {
    const emailAlredyExists = (await app.pg.query('SELECT email FROM users WHERE username = $1', [email])).rows.length > 0;

    if(emailAlredyExists) {
      return reply.status(401).send('E-mail alredy exists')
    }
  }

  await app.pg.query(
    'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING *',
    [username, email, userId]
  );


  return reply.status(204).send({username, email})
}