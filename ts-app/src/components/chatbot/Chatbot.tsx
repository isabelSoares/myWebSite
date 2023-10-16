// ./chatComponent.js

import React, { useState, useEffect } from "react";
import { ApplicationStore } from "./../../store";
import { FiSend, FiX } from "react-icons/fi";
import { observer, inject } from "mobx-react";
import { toJS } from "mobx";

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
        <div className="chat-container">
          <div className="chat-head">
            <div style={{ ...center }}>
              <h5> IsabelChatbot {isLoadingChatMessages && "is typing ..."} </h5>
            </div>
            <div style={{ ...center }} className="hover">
              <FiX onClick={(_) => closeChatwindow()} />
            </div>
          </div>
          <div className="chat-body">
            <ul className="chat-window">
              {data.map(({ fulfillmentText, userMessage }) => (
                <li>
                  {userMessage && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <p style={{ opacity: 0 }}> . </p>
                      <div
                        key={userMessage}
                        style={{
                          background: "red",
                          color: "white",
                        }}
                        className="chat-card"
                      >
                        <p>{userMessage}</p>
                      </div>
                    </div>
                  )}
                  {fulfillmentText && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div key={fulfillmentText} className="chat-card">
                        <p>{fulfillmentText}</p>
                      </div>
                      <p style={{ opacity: 0 }}> . </p>
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