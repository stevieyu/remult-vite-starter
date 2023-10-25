import fastifyApp from './fastifyApp'
import fastifyStatic from '@fastify/static'
import {resolve} from 'path'

;(async () => {
    const app = await fastifyApp([
        [fastifyStatic, {
            root: resolve('dist'),
        }]
    ])

    const port = 5173
    await app.listen({ port })
    console.log(`http://localhost:${port}`)
})()



