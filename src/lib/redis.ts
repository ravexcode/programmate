//We use Redis for cache reading, making more faster and less expensive the DB requests
import Redis from "ioredis";

//We check if RedisURL is declared
function getRedisURL() {
  //If we have Redis URL we return success
  if(process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  };

  //Else will be returned an error
  throw new Error("Redis URL not found");
}

//Create the redis client
const redis : Redis = new Redis(getRedisURL());
//Exports the redis client
export default redis;