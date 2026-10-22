import { MongoMemoryReplSet } from 'mongodb-memory-server';

export interface TestMongo {
  uri: string;
  stop: () => Promise<void>;
}

/** In-memory single-node replica set, so transactions work in tests like they do on Atlas. */
export async function startTestMongo(dbName = 'test'): Promise<TestMongo> {
  const replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  return {
    uri: replSet.getUri(dbName),
    stop: async () => {
      await replSet.stop();
    },
  };
}
