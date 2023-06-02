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