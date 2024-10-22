import fastify from 'fastify'
import fastifyPostgres from '@fastify/postgres'
import fastifyJwt from '@fastify/jwt'
import cors from '@fastify/cors'

import { usersRoutes } from './controllers/users/routes'
import { questionsRoutes } from './controllers/questions/routes'

export const app = fastify()

app.register(cors, {
  origin: '*',
  methods: ['GET', 'POST']
})


app.register(fastifyPostgres, {
  connectionString: 'postgres://docker:docker@localhost:5432/projetofisica'
})

app.register(fastifyJwt, {
  secret: 'agadorjgjoadthaodtjhoiadt',
})

app.addHook("onRequest", async (request, reply) => {
  if(request.routeOptions.url == '/users/login' || request.routeOptions.url == '/users/register') {
    return;
  }
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.send(err)
  }
})

app.register(usersRoutes)
app.register(questionsRoutes)