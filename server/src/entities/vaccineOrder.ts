import { prop, getModelForClass } from '@typegoose/typegoose';
import { Field, InputType, Int, ObjectType, registerEnumType } from 'type-graphql';

@ObjectType()
export class VaccineOrder {
  @Field()
  @prop({ required: true })
  id!: string;

  @Field(() => Int)
  @prop({ required: true })
  orderNumber!: number;

  @Field()
  @prop({ required: true })
  responsiblePerson!: string;

  @Field()
  @prop({ required: true })
  healthCareDistrict!: string;

  @Field()
  @prop({ required: true })
  vaccine!: Vaccine;

  @Field(() => Int)
  @prop({ required: true })
  injections!: number;

  @Field()
  @prop({ required: true })
  arrived!: string;
}

export const VaccineOrderModel = getModelForClass(VaccineOrder);

export enum Vaccine {
  ANTIQUA = 'Antiqua',
  ZERPFY = 'Zerpfy',
  SOLAR_BUDDHICA = 'SolarBuddhica',
}
registerEnumType(Vaccine, {
  name: 'Vaccine',
  description: 'Vaccine producers',
});

@InputType()
export class VaccineInput {
  @Field()
  vaccineProducer!: Vaccine;
}
