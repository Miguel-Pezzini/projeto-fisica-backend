import { FastifyInstance } from 'fastify'
import { fetchQuestion } from './fetchQuestions'
import { correctAnswer } from './correctAnswer'
import { createQuestion } from './createQuestion'

export async function questionsRoutes(app: FastifyInstance) {
  app.post('/questions/fetchQuestions', fetchQuestion)
  app.post('/questions/correctAnswer', correctAnswer)
  app.post('/questions/createQuestion', createQuestion)
}