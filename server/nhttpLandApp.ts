import nhttp from 'nhttp-land'
import {createRemultServer} from "remult/server";
import options, {openApiDocOpts} from "./remultOptions";
import {readFileSync} from "fs";

const api = createRemultServer(options)

const app = nhttp();

app.get("/api/openApi.json", ({ response }) =>
    response.send(api.openApiDoc(openApiDocOpts))
);
app.get("/api/docs", ({response}) => {
    response.header("Content-Type", "text/html; charset=UTF-8")
    response.send(readFileSync('server/swagger.html'))
});
app.use(async (rev, next) => {
    const res = await api.handle(rev.request, rev.response)
    if(!res) next()
});


export default app
