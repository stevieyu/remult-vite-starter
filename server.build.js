import {build as esbuild} from 'esbuild'

import {existsSync, writeFileSync} from 'fs'
import {join} from 'path'


const depsToEsmshBundle = {
    name: 'depsToEsmshBundle',
    setup(build) {
        const deps = [
            '@paralleldrive/cuid2',
        ]
        const depsRegexp = new RegExp(`^${deps.join('|').replace(/([./])/g, '\\$1')}$`)

        build.onResolve({filter: depsRegexp}, async (args) => {
            const outfile = `node_modules/${args.path}/esbuild-bundle.mjs`
            if(!existsSync(outfile)){
                await fetch(`https://esm.sh/${args.path}?bundle-deps`)
                    .then(async (res) => {
                        const pathname = (await res.text()).replace(/.*?"([^"]+?.mjs).*/s, '$1')

                        return fetch(new URL(res.url).origin + pathname).then(res => res.text())
                    })
                    .then(text => writeFileSync(outfile, text))
            }
            
            //https://esm.sh/@paralleldrive/cuid2@2.2.2?bundle-deps
            // return {path: args.path, external: true}
            return {path: join(import.meta.dirname, outfile)}
        })
    },
  }
  

esbuild({
    entryPoints: ['server/nhttpLand.ts'],
    outfile: 'dist/server.js',
    bundle: true,
    minify: true,
    platform: 'node',
    target: 'node21',
    format: 'esm',
    external: [],
    plugins: [
        depsToEsmshBundle,
    ],
})

