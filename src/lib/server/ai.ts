//Open Ai library connection
import { OpenRouter } from "@openrouter/sdk";

//Function fot getting the client secret
function getClientData(){
  //Client id (Secret Key)
  const client = process.env.OPEN_ROUTER_CLIENT_ID;

  //Returns an error if the client id isn't registed
  if(!client) throw new Error("Open Router client id isn't registed");

  //Returns the client id
  return client;
}

//Deepseek client connection
const openRouter = new OpenRouter({
  apiKey: getClientData()
});

//Returns the client connection
export default openRouter;