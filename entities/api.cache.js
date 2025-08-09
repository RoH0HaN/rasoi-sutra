import { EntitySchema } from "typeorm";

const ApiCache = new EntitySchema({
  name: "ApiCache",
  tableName: "api_cache",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    endpoint: {
      type: "varchar",
    },
    params: {
      type: "json",
    },
    response_data: {
      type: "json",
    },
    cached_at: {
      type: "timestamp",
      createDate: true,
    },
    expires_at: {
      type: "timestamp",
      nullable: true,
    },
  },
});

export { ApiCache };
