import { remult } from 'remult';
import { ProductEntity } from '../shared/ProductEntity';
import { ProductsController } from '../shared/ProductsController';

export const productsRepo = remult.repo(ProductEntity);

ProductsController.rename('1');

const pc = new ProductsController()
pc.name = 'abc ' + (Math.random() * 1000).toFixed(0)
pc.updateCompleted();