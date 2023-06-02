import fastify from 'fastify';

import fastifyRegisterRemult from './fastifyRegisterRemult'



export default async (plugins = []) => {
    const app = fastify();

    await Promise.all([
        ...plugins.map((plugin) => {
            let opts = {}
            if(Array.isArray(plugin)) {
                plugin = plugin[0]
                opts = plugin[1] || {}
            }
            return app.register(plugin, opts)
        }),
        app.register(fastifyRegisterRemult),
        app.ready()
    ])

    return app
}