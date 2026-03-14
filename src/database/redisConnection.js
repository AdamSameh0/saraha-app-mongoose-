import { createClient } from "redis"
import { redisUrl } from "../../config/index.js";

export const client = createClient({
  url: redisUrl
});

client.on("error", function(err) {
  throw err;
});

export let redisConnection = async()=>{
    try{
      client.connect()
      console.log("redis is connected");
    }catch(error){ 
   console.log(error);
    }
}