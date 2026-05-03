import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true, collection: 'categories' })
export class Category extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ default: true })
  pcBuilderVisible: boolean;

  // Dùng MongooseSchema.Types.Mixed cho mảng chứa dữ liệu linh hoạt (Array)
  @Prop({ type: [MongooseSchema.Types.Mixed], default: [] })
  compatibilityAttributes: any[];

  // Cờ xóa mềm
  @Prop({ default: false })
  isDeleted: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
