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
    return () => handleConversation()
  }, []);

  const data = toJS(agentMessages);
  console.log(data);
 
  return (
        <div className="chatbot-box">
          <div className="chatbot-top-bar">
              <h5> IsabelChatbot {isLoadingChatMessages && "is typing ..."} </h5>
              <FiX onClick={(_) => closeChatwindow()} />
          </div>
          <div className="chatbot-body">
            <ul>
              {data.map(({ fulfillmentText, userMessage }) => (
                <li>
                  {userMessage && (
                    <div className="chatbot-window">
                      <FontAwesomeIcon icon={faRobot} className="icon-style"/>
                      <div className="chatbot-card" key={userMessage}>
                        <p>{userMessage}</p>
                      </div>
                    </div>
                  )}
                  {fulfillmentText && (
                    <div  className="chatbot-window"
                    >
                      <div key={fulfillmentText} className="chat-card">
                        <p>{fulfillmentText}</p>
                      </div>
                      <FontAwesomeIcon icon={faRobot} className="icon-style"/>
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
              className="input-container"
            >
              <input
                className="input"
                type="text"
                onChange={(e) => setMessage(e.target.value)}
                value={Message}
                placeholder="Begin a conversation with our agent"
              />
              <div className="send-btn-ctn">
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