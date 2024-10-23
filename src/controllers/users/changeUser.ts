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

  // Mudou os 2 dados
  if(user.email !== email && user.username !== username) {
    const userAlreadyExists = (await app.pg.query('SELECT username FROM users WHERE username = $1', [username])).rows.length > 0;
    const emailAlredyExists = (await app.pg.query('SELECT email FROM users WHERE email = $1', [email])).rows.length > 0;

    if(userAlreadyExists) {
      return reply.status(401).send({message: 'username alredy exists', success: false})
    }
    if(emailAlredyExists) {
      return reply.status(401).send({message: 'email alredy exists', success: false})
    }
  }
  // E-mail não mudou
  if(user.email == email) {
    const userAlreadyExists = (await app.pg.query('SELECT username FROM users WHERE username = $1', [username])).rows.length > 0;

    if(userAlreadyExists) {
      return reply.status(401).send({message: 'username alredy exists', success: false})
    }
  }
  // Username não mudou
  if(user.username == username) {
    const emailAlredyExists = (await app.pg.query('SELECT email FROM users WHERE email = $1', [email])).rows.length > 0;

    if(emailAlredyExists) {
      return reply.status(401).send({message: 'email alredy exists', success: false})
    }
  }

  await app.pg.query(
    'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING *',
    [username, email, userId]
  );


  return reply.status(200).send({username, email, success: true})
}