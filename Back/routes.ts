import z from 'zod'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { randomUUID } from 'crypto'

interface User {
  id: string
  name: string
}

const users: User[] = []

export const Routes: FastifyPluginAsyncZod = async (app) => {

  app.post('/users', {
    schema: {
      tags: ['users'],
      description: 'Create User',
      operationId:'createUser',
      body: z.object({
        name: z.string()
      }),
      response: {
        201: z.object({})
      }
    }
  }, async (request, reply) => {
    const { name } = request.body

    users.push({
      id: randomUUID(),
      name
    })

    return reply.status(201).send({})
  })

  app.get('/users/:id', {
    schema: {
      tags: ['users'],
      description: 'Get an user',
      operationId:'GetUser',
      params: z.object({
        id:z.string()
      }),
      response: {
        200: z.object({
          id: z.string(),
          name: z.string()
        }),
        404: z.object({
          message: z.string()
        })
      }
    }
  }, async (request, reply) => {

    const {id} = request.params
    const user = users.find(user=> user.id === id)

    if(!user){
      return reply.status(404).send({message: 'User not found'})
    }

    return user
  })

  app.get('/users', {
    schema: {
      tags: ['users'],
      description: 'List users',
      operationId:'GetUsers',
      response: {
        200: z.array(
          z.object({
            id: z.string(),
            name: z.string()
          }))
      }
    }
  }, async () => {
    return users
  })
}