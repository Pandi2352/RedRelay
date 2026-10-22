import { MongoMemoryReplSet } from 'mongodb-memory-server';

export interface TestMongo {
  uri: string;
  stop: () => Promise<void>;
}

/** In-memory single-node replica set, so transactions work in tests like they do on Atlas. */
export async function startTestMongo(dbName = 'test'): Promise<TestMongo> {
  process.env.MONGOMS_MD5_CHECK ??= '0';
  const replSet = await MongoMemoryReplSet.create({
    replSet: { count: 1 },
    binary: { checkMD5: false },
  });
  return {
    uri: replSet.getUri(dbName),
    stop: async () => {
      await replSet.stop();
    },
  };
}
