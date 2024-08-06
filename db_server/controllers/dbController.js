import { shards } from '../utils/shardUtils.js';
import { resetAllData } from '../utils/migration/createSchema.js';

export const migration = async () => {
  for (const shard of Object.values(shards)) {
    console.log(shard);
    await resetAllData(shard);
  }
};
