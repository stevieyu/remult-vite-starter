import type {Plugin} from 'vite'
import {createRemultServer} from "remult/server";
import options, {openApiDocOpts} from "./remultOptions";
import http from "http";
import {readFileSync} from "fs";


interface pluginOption {
}

export default function (userOptions: Partial<pluginOption> = {}) {
    let api = null;

    const middleware = async (
        req: http.IncomingMessage,
        res: http.ServerResponse,
        next: Function
    ) => {
        if (!/^\/api/i.test(req.url)) return next()

        if(!api) {
            api = createRemultServer(options, {
                buildGenericRequestInfo: (r) => r,
                getRequestBody: (req) => new Promise(resolve => {
                    let data = ''
                    req.on('data', chunk => {
                        data += chunk;
                    });
                    req.on('end', () => {
                        resolve(JSON.parse(data));
                    });
                }),
            })
        }

        if (/openApi.json$/.test(req.url)) {
            res.writeHead(200, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify(api.openApiDoc(openApiDocOpts)))
        }

        if (/docs$/.test(req.url)) {
            res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
            return res.end(readFileSync('server/swagger.html').toString())
        }

        Object.assign(res, {
            json: (data) => {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(data))
            },
        });
        const ret = await api.handle(req, res)
        if (!ret) next()
    }

    return <Plugin>{
        name: 'server',
        configureServer(server) {
            server.middlewares.use(middleware)
        },
        configurePreviewServer(server) {
            server.middlewares.use(middleware)
        }
    }
}
