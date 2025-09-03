import { Query } from "mongoose";
import { excludeField } from "../modules/tour/tour.constant";

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly Query: Record<string, string>;
  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.Query = query;
  }
  filter(): this {
    const filter = { ...this.Query };
    for (const field of excludeField) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete filter[field];
    }
    this.modelQuery = this.modelQuery.find(filter);
    return this;
  }
  search(tourSearchableFields: string[]): this {
    const searchTerm = this.Query.searchTerm || "";
    const searchQuery = {
      $or: tourSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    };
    this.modelQuery = this.modelQuery.find(searchQuery);
    return this;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sort(): any {
    const sort = this.Query.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }
  fields(): this {
    const fields = this.Query.fields?.split(",").join(" ") || "";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }
  paginate(): this {
    const page = Number(this.Query.page) || 1;
    const limit = Number(this.Query.limit) || 10;
    const skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }
  build() {
    return this.modelQuery;
  }
  async getMeta() {
    const totalDocuments = await this.modelQuery.model.countDocuments();
    const page = Number(this.Query.page) || 1;
    const limit = Number(this.Query.limit) || 10;
    const totalPage = Math.ceil(totalDocuments / limit);
    return { page, limit, total: totalDocuments, totalPage };
  }
}
