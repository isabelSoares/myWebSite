import Axios from "axios";

const ENDPOINT = "http://localhost:8000/api/agent/text-input";

export const sendBot = async (client_message: string) => {

  let response = await Axios.post(`${ENDPOINT}`, null, {
    params: {
      message: client_message,
    }
  });

  return response.data.data[0].queryResult.fulfillmentMessages[0].text.text[0];
}