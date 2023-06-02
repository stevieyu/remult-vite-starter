import fastifyApp from './fastifyApp'
import fastifyStatic from '@fastify/static'

;(async () => {
    const app = await fastifyApp([
        [fastifyStatic, {
            root: 'dist',
        }]
    ])

    const port = 5173
    await app.listen({ port })
    console.log(`http://localhost:${port}`)
})()



