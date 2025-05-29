import { Cripto } from '../entities/cripto.entity';
import { CriptoModel } from '../models/cripto.model';

export class CriptoAdapter {
  static fromEntityToModel(entity: Cripto): CriptoModel {
    const model = new CriptoModel();
    model.criptoId = entity.criptoId;
    model.symbol = entity.symbol;
    model.name = entity.name;
    model.precision = entity.precision;
    model.currentUnitPrice = entity.currentUnitPrice;
    model.wallet = entity.wallet;
    return model;
  }
}
