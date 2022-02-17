import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient();

    this.client.on('error', (error) => {
      console.log(`Redis client not connected to server: ${error}`);
    });
  }

  isAlive() {
    return (this.client.connected);
  }

  async get(key) {
    const asyncGetter = promisify(this.client.get).bind(this.client);
    const value = await asyncGetter(key);
    return value;
  }

  async set(key, value, time) {
    const asyncSetter = promisify(this.client.set).bind(this.client);
    await asyncSetter(key, value);
    await this.client.expire(key, time);
  }

  async del(key) {
    const asyncDel = promisify(this.client.del).bind(this.client);
    await asyncDel(key);
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
