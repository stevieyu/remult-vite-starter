import app from './nhttpLandApp'
import serveStatic from "nhttp-land/serve-static";

app.use(serveStatic("dist", {spa: true}));

const port = 3000
app.listen({port});
console.log(`http://localhost:${port}`)
