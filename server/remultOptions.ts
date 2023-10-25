import type {RemultServerOptions} from 'remult/server';
import {ProductEntity} from '../shared/ProductEntity';
import {ProductsController} from "../shared/ProductsController";

export default <RemultServerOptions<any>>{
    entities: [
        ProductEntity
    ],
    controllers: [
        ProductsController
    ]
}

export const openApiDocOpts = {
    title: "remult-vite-demo",
    version: '0.0.1',
}