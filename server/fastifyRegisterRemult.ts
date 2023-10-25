import type {FastifyInstance, FastifyPluginOptions, DoneFuncWithErrOrRes} from 'fastify'
import {readFileSync} from "fs";
import {remultFastify} from "remult/remult-fastify";
import options, {openApiDocOpts} from "./remultOptions";

const api = remultFastify(options)

export default async function (fastify: FastifyInstance, opts: FastifyPluginOptions, done: DoneFuncWithErrOrRes){
    fastify.get("/api/openApi.json", (req, res) =>
        api.openApiDoc(openApiDocOpts)
    );
    fastify.get("/api/docs", (req, res) => {
        res.header("Content-Type", "text/html; charset=UTF-8")
        return readFileSync('server/swagger.html')
    });

    await fastify.register(api)
    done()
}