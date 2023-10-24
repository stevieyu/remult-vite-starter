import type { Plugin } from 'vite'
import fastifyApp from "./fastifyApp";

interface pluginOption {
}

export default function (userOptions: Partial<pluginOption> = {}) {
    let app = null;

    const middleware = async (req, res, next) => {
        if(!/^\/api/i.test(req.url) || !app) return next()
        app.routing(req, res)
    }

    return <Plugin>{
        name: 'server',
        async config(config, env){
            if(env.command === 'serve'){
                app = await fastifyApp()
            }
        },
        configureServer(server) {
            server.middlewares.use(middleware)
        },
        configurePreviewServer(server){
            server.middlewares.use(middleware)
        }
    }
}
