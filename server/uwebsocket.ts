import {App} from 'uWebSockets.js'
import type {HttpResponse} from 'uWebSockets.js'
import {createRemultServer} from "remult/server";
import type {GenericRequestInfo, GenericResponse} from "remult/server";
import options, {openApiDocOpts} from "./remultOptions";
import {readFileSync, existsSync} from "fs";
import mime from 'mime-types'


const api = createRemultServer(options, {
    buildGenericRequestInfo: r => r,
    getRequestBody: (req) => req.json(),
})

const app = App()

interface GenericRequest extends GenericRequestInfo{
    json?: () => Promise<string|object>;
}

app.any('/api/*', async (res, req) => {
    res.onAborted(() => res.aborted = true);
    const gReq: GenericRequest = {
        url: req.getUrl(),
        method: req.getMethod(),
        query: Object.fromEntries(new URLSearchParams(req.getQuery())),
        json: () => readJson(res)
    }

    const gRes: GenericResponse = {
        json(data: any): any {
            res.writeStatus('200')
            res.writeHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data))
        },
        status(statusCode: number): GenericResponse {
            res.writeStatus(statusCode.toString())
            return gRes
        },
        end: res.end
    }
    if (/openApi.json$/.test(gReq.url)) {
        res.writeHeader('Content-Type', 'application/json')
            .end(JSON.stringify(api.openApiDoc(openApiDocOpts)))
        return
    }

    if (/docs$/.test(gReq.url)) {
        res.writeHeader('Content-Type', 'text/html; charset=UTF-8')
            .end(readFileSync('server/swagger.html'))
        return
    }
    const ret = await api.handle(gReq, gRes)
    if (!ret) {
        res.writeStatus('404')
            .writeHeader('Content-Type', 'application/json')
            .end(JSON.stringify({
                message: 'Not found'
            }))
    }
})

app.get('/**', (res, req) => {
    let path = req.getUrl();
    if (/\/$/.test(path)) path += 'index.html'

    path = 'dist' + path
    if (!existsSync(path)) {
        res.writeStatus('404')
            .writeHeader('Content-Type', 'text/html; charset=UTF-8')
            .end('Not found');
        return
    }

    res.writeHeader('Content-Type', mime.lookup(path))
        .end(readFileSync(path));
})

const port = 3000
app.listen(port, (listenSocket) => {
    if (listenSocket) {
        console.log(`http://localhost:${port}`)
    }
})


const readJson = (res: HttpResponse): Promise<string | object> => new Promise((resolve, reject) => {
    let buffer: Buffer;
    res.onData((ab, isLast) => {
        buffer = Buffer.concat(
            [buffer, Buffer.from(ab)].filter(i => i)
        );

        if (isLast) {
            try {
                resolve(JSON.parse(buffer.toString()));
            } catch (e) {
                res.close();
                resolve(buffer.toString())
            }
        }
    });

    res.onAborted(reject);
});