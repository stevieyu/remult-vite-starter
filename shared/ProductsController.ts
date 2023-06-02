import { BackendMethod, remult, Controller, Fields } from "remult"
import { ProductEntity } from "./ProductEntity"

@Controller("ProductsController")
export class ProductsController {
    @BackendMethod({ allowed: true })
    static async rename(name: string) {
        const ProductRepo = remult.repo(ProductEntity)

        const arr = []
        for (const product of await ProductRepo.find()) {
            arr.push(await ProductRepo.save({ ...product, name }))
        }
        return arr
    }

    @Fields.string()
    name = ''

    @BackendMethod({ allowed: true })
    async updateCompleted() {
        this.name += '1'
        for await (const product of remult.repo(ProductEntity).query()) {
            product.name += this.name
            await product.save()
        }
    }
}