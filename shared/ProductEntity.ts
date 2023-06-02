import { Entity, Fields, BackendMethod, EntityBase } from "remult";

@Entity('products', {
  allowApiCrud: true
})
export class ProductEntity extends EntityBase {
  @Fields.autoIncrement()
  id = 0
  
  @Fields.string()
  name = "";

  @Fields.number()
  unitPrice = 0;

  @BackendMethod({ allowed: true })
  async appendName() {
    this.name += ' append'
    await this.save()
  }
}