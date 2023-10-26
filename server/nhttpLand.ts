import nhttp from 'nhttp-land'
import {createRemultServer} from "remult/server";
import type {GenericResponse} from "remult/server";
import options, {openApiDocOpts} from "./remultOptions";
import {readFileSync} from "fs";
import serveStatic from "nhttp-land/serve-static";

const api = createRemultServer(options, {
    buildGenericRequestInfo: (r) => r,
    getRequestBody: (req) => req.json()
})

const app = nhttp();

app.get("/api/openApi.json", ({ response }) =>
    response.send(api.openApiDoc(openApiDocOpts))
);
app.get("/api/docs", ({response}) => {
    response.header("Content-Type", "text/html; charset=UTF-8")
    response.send(readFileSync('server/swagger.html'))
});
app.any('/api/*',async ({response, newRequest, respondWith}) => {
    const gRes: GenericResponse = {
        json(data){
            response.json(data)
        },
        status(statusCode){
            response.status(statusCode)
            return gRes
        },
        end(){}
    }
    const res = await api.handle(newRequest, gRes)
    if(!res) response
        .status(404)
        .send({
            message: 'Not found'
        });
});

app.use(serveStatic("dist", {spa: true}));

const port = 3000
app.listen({port});
console.log(`http://localhost:${port}`)
