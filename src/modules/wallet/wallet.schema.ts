import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type WalletDocument = Wallet & Document;

@Schema({ collection: "wallet" })
export class Wallet {
  _id?: Types.ObjectId;

  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, default: 0.00 })
  balance?: number;

  @Prop({ required: true, default: 0.00 })
  total_amount_spent?: number;

  @Prop({ required: true, default: 0.00 })
  total_amount_topup?: number;

  @Prop()
  createdAt?: number;

  @Prop()
  updatedAt?: number;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
