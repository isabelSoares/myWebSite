import React, { useState, useEffect } from "react";
import { ApplicationStore } from "./../../store";
import { FiSend, FiX } from "react-icons/fi";
import { observer, inject } from "mobx-react";
import { toJS } from "mobx";
import './Chatbot.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot } from '@fortawesome/free-solid-svg-icons';

const center = {
  display: "flex",
  jusitfyContent: "center",
  alignItems: "center",
};

interface IProps {
  closeChatwindow: () => void,
  isOpen:boolean,
  ApplicationStore: ApplicationStore
}

const Chatbot = (props: IProps) => {
  const { closeChatwindow, isOpen } = props;
  const [Message, setMessage] = useState("");

  const {
    handleConversation,
    agentMessages,
    isLoadingChatMessages,
  } = props.ApplicationStore;

  useEffect(() => {
    handleConversation();
  }, []);

  const data = toJS(agentMessages);
  console.log(data);
 
  return (
        <div className="chatbot-box">
          <div className="chatbot-top-bar">
            <div className="title">
              <h5> IsabelChatbot {isLoadingChatMessages && "is typing ..."} </h5>
            </div>
            <div className="close-icon">
              <FiX onClick={(_) => closeChatwindow()} />
            </div>
          </div>
          <div className="chatbot-body">
            <ul>
              {data.map(({ fulfillmentText, userMessage }) => (
                <li className={"dialog-line" + (fulfillmentText ? " bot-line" : "") + (userMessage ? " user-line" : "")}>
                  {userMessage && (
                    <div className="chatbot-bubble">
                      <div className="chatbot-text" key={userMessage}>
                        <p>{userMessage}</p>
                      </div>
                      <FontAwesomeIcon icon={faRobot} className="icon-style"/>
                    </div>
                  )}
                  {fulfillmentText && (
                    <div  className="chatbot-bubble"
                    >
                      <FontAwesomeIcon icon={faRobot} className="icon-style"/>
                      <div key={fulfillmentText} className="chatbot-text">
                        <p>{fulfillmentText}</p>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <hr style={{ background: "#fff" }} />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleConversation(Message);
              }}
              className="chatbot-input-container"
            >
              <input
                className="chatbot-input"
                type="text"
                onChange={(e) => setMessage(e.target.value)}
                value={Message}
                placeholder="Begin a conversation with our agent"
              />
              <div className="send-icon">
                <div
                  className="hover"
                  onClick={() => handleConversation(Message)}
                >
                  <FiSend style={{ transform: "rotate(50deg)" }} />
                </div>
              </div>
            </form>
          </div>
        </div>
     );
};

export default inject("ApplicationStore")(observer(Chatbot));