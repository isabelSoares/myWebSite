// store.js

import Axios from "axios";
import { action, observable, makeObservable, configure } from "mobx";

const ENDPOINT = "http://localhost:8000/api/agent/text-input";

export class ApplicationStore {
  constructor() {
    makeObservable(this);
  }

  @observable isChatWindowOpen: boolean = false;

  @observable
  isLoadingChatMessages: boolean = false;

  @observable
  agentMessages: any[] = [];

  @action
  setChatWindow = (state: boolean) => {
    this.isChatWindowOpen = state;
  };

  @action
  handleConversation = (message?: string) => {
    if (this.agentMessages.length != 0 && !message) {
      return;
    }

    this.isLoadingChatMessages = true;
    this.agentMessages.push({ userMessage: message });

    Axios.post(`${ENDPOINT}`, null, {
      params: {
        message: message || "Hi",
      }
    })
      .then((res) => {
        this.agentMessages.push({
          fulfillmentText: res.data.data[0].queryResult.fulfillmentMessages[0].text.text[0]
        });
        this.isLoadingChatMessages = false;
      })
      .catch((e) => {
        this.isLoadingChatMessages = false;
        console.log(e);
      });
  };
}

export const store = new ApplicationStore();