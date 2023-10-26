import {App} from 'uWebSockets.js'
import {createRemultServer} from "remult/server";
import type {GenericRequestInfo, GenericResponse} from "remult/server";
import options, {openApiDocOpts} from "./remultOptions";
import {readFileSync} from "fs";


const api = createRemultServer(options, {
    buildGenericRequestInfo: r => r,
    getRequestBody: (req) => new Promise(resolve => {
        let data = ''
        req.on('data', chunk => data += chunk);
        req.on('end', () => resolve(JSON.parse(data)));
    }),
})

const app = App()


app.any('/api/*', async (res, req) => {
    const gReq: GenericRequestInfo = {
        url: req.getUrl(),
        method: req.getMethod(),
        query: req.getQuery(),
        params: ''
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
        res.writeStatus('200')
        res.writeHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(api.openApiDoc(openApiDocOpts)))
        return
    }

    if (/docs$/.test(gReq.url)) {
        res.writeStatus('200')
        res.writeHeader('Content-Type', 'text/html; charset=UTF-8')
        res.end(readFileSync('server/swagger.html').toString())
        return
    }
    const ret = await api.handle(gReq, gRes)
    if(!ret) {
        res.writeStatus('404')
        res.writeHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({
            message: 'Not found'
        }))
    }
})

app.get('/**', (res, req) => {
    res.writeStatus('200 OK').writeHeader('IsExample', 'Yes').end('Hello there!');
})

const port = 3000
app.listen(port, (listenSocket) => {
    if (listenSocket) {
        console.log(`http://localhost:${port}`)
    }

})