import { injectable } from "inversify";
import {
  Model as MongooseModel,
  SchemaDefinition,
  model,
  Schema,
  Document,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
  SchemaOptions,
  IndexOptions,
  IndexDefinition,
  HydratedDocument,
  Query,
  PipelineStage,
  Aggregate,
} from "mongoose";
import { ObjectId } from "../utils/ObjectId";

@injectable()
export default abstract class AbstractModel<ModelData, DbModel extends Document> {
  protected Model: MongooseModel<DbModel>;
  private name: string;

  public constructor(
    schemaDef: SchemaDefinition,
    schemaOptions?: SchemaOptions,
    indexOptions?: { fields: IndexDefinition; options?: IndexOptions }
  ) {
    this.name = this.constructor.name.replace("Collection", "");
    let options: SchemaOptions = {
      collection: this.name,
      timestamps: { createdAt: "_created", updatedAt: "_modified" },
    };

    if (schemaOptions) {
      options = { ...options, ...schemaOptions };
    }

    const schema = new Schema(schemaDef, options);

    if (indexOptions) {
      schema.index(indexOptions.fields, indexOptions.options);
    }
    this.Model = model<DbModel>(this.name, schema);
  }

  public async all(): Promise<DbModel[]> {
    return await this.Model.find({});
  }

  public async deleteAll(): Promise<void> {
    await this.Model.deleteMany();
  }

  public async deleteById(id: ObjectId): Promise<void> {
    await this.Model.deleteOne({ _id: id });
  }

  public async deleteByField(filter?: FilterQuery<ModelData>): Promise<void> {
    await this.Model.deleteOne(filter);
  }

  public async findOne(
    filter?: FilterQuery<ModelData> | undefined,
    projection?: any,
    options?: QueryOptions | null | undefined
  ): Promise<ModelData | null> {
    const res = await this.Model.findOne(filter, projection, options);
    return res ? this.mapToData(res) : null;
  }

  public queryByField(
    filter: FilterQuery<ModelData>
  ): Query<
    HydratedDocument<DbModel, Record<string, unknown>, Record<string, unknown>>[],
    HydratedDocument<DbModel, Record<string, unknown>, Record<string, unknown>>,
    Record<string, unknown>,
    DbModel
  > {
    const res = this.Model.find(filter);
    return res;
  }

  public queryOne(
    filter: FilterQuery<ModelData>
  ): Query<
    HydratedDocument<DbModel, Record<string, unknown>, Record<string, unknown>> | null,
    HydratedDocument<DbModel, Record<string, unknown>, Record<string, unknown>>,
    Record<string, unknown>,
    DbModel
  > {
    return this.Model.findOne(filter);
  }

  public async aggregate(pipeline?: PipelineStage[] | undefined): Promise<Aggregate<Array<DbModel>>> {
    return this.Model.aggregate(pipeline);
  }

  public async save(
    data: Partial<ModelData>,
    refs?: { [P in keyof Partial<ModelData>]: string | ObjectId | string[] | ObjectId[] }
  ): Promise<ModelData> {
    let objPayload = data;
    if (refs) {
      objPayload = { ...objPayload, ...refs };
    }

    const newDocument = new this.Model(objPayload);
    const savedResult = await newDocument.save();
    return this.mapToData(savedResult);
  }

  public async findOneAndUpdate(
    filter?: FilterQuery<ModelData> | undefined,
    update?: UpdateQuery<ModelData> | undefined,
    options?: QueryOptions | null | undefined
  ): Promise<ModelData> {
    return this.mapToData((await this.Model.findOneAndUpdate(filter, update, options)) as DbModel);
  }

  private mapToData(model: DbModel): ModelData {
    const cleanObj: any = model.toJSON();
    cleanObj.id = cleanObj._id;
    delete cleanObj._id;
    delete cleanObj.__v;
    return cleanObj as ModelData;
  }
}
