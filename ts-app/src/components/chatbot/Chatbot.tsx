import React from 'react';
import './Chatbot.scss';

import { Widget, addResponseMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';

import { sendBot } from "./../../store";

interface IProps {}

export const Chatbot = (props: IProps) => {   

    const handleNewUserMessage = (newMessage:string) => {
        console.log(`New message incoming! ${newMessage}`);
        sendBot(newMessage).then((response) => {
          addResponseMessage(response);
        });
      };

    return(
        <div>
            <Widget className="chatbot"
            handleNewUserMessage={handleNewUserMessage}
            title="Isabel Chatbot"
            subtitle="If you feel lazy today, you can ask me something about Isabel..."
            emojis={true}
            />
        </div>
    ) 
}