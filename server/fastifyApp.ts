import fastify from 'fastify';

import fastifyRegisterRemult from './fastifyRegisterRemult'



export default async (plugins = []) => {
    const app = fastify();

    await Promise.all([
        ...plugins.map((plugin) => {
            let opts = {}
            if(Array.isArray(plugin)) {
                opts = plugin[1] || {}
                plugin = plugin[0]
            }
            return app.register(plugin, opts)
        }),
        app.register(fastifyRegisterRemult),
        app.ready()
    ])

    return app
}