import { CriptoReferenceResponseDto } from '../../transaction/dto/transaction-response.dto';
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

  static fromModelToReferenceResponseDto(
    model: Omit<CriptoModel, 'criptoId'>,
  ): CriptoReferenceResponseDto {
    return {
      symbol: model.symbol,
      name: model.name,
      precision: model.precision,
      currentUnitPrice: model.currentUnitPrice,
    };
  }
}
