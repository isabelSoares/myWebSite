import Axios from "axios";

const ENDPOINT_BASE = "http://ec2-54-166-158-169.compute-1.amazonaws.com:8080";
const ENDPOINT = `${ENDPOINT_BASE}/api/agent/text-input`;

export const sendBot = async (client_message: string) => {

  let response = await Axios.post(`${ENDPOINT}`, null, {
    params: {
      message: client_message,
    }
  });

  return response.data.data[0].queryResult.fulfillmentMessages[0].text.text[0];
}