import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  validatorCompiler,
  serializerCompiler,
  jsonSchemaTransform,
  ZodTypeProvider
} from 'fastify-type-provider-zod'
import { Routes } from './routes'
import { writeFile } from 'fs/promises'
import { resolve } from 'path'

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)


app.register(fastifyCors, {
  origin: "*"
})

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Typed full-Stack',
      version: '1.0.0'
    }
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs'
})

app.register(Routes)


app.listen({
  port: 3333
}).then((port) => {
  console.log('HTTP server is running at localhost:3333')
})

app.ready().then(()=>{
  const spec = app.swagger()

  writeFile(resolve(__dirname, 'swagger.json'), JSON.stringify(spec, null, 2), 'utf-8')
})