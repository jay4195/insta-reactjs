import React, { useState, useEffect } from "react";
import useInput from "../hooks/useInput";
import Loader from "../components/PostPreview";
import { client } from "../utils";
import styled from "styled-components";
import { EmojiIcon, DownChevronIcon } from "../components/Icons";
import Avatar from "../styles/Avatar";
import Message from "../components/Message";
import { useParams } from "react-router-dom";

const Wrapper = styled.div`
  display: flex;
  width:70%;
  height: 100%;
  position: relative;
  margin: auto;
  font-size: 14px;

  .message-info {
    flex: 1;
    border: 1px solid ${(props) => props.theme.borderColor};
  }

  .contact-list-wrapper {
    width:30%;
		display: flex;
		// align-items: center;
    flex-direction: column;
  }

  .contact-list-header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    border-top: 1px solid ${(props) => props.theme.borderColor};
    border-left: 1px solid ${(props) => props.theme.borderColor};
  }

  .down-icon {
    // display: inline-box;
    transform: rotate(180deg);
    height: 32px;
    width: 32px;
  }

  .contact-list {
    flex: 1;
    border-top: 1px solid ${(props) => props.theme.borderColor};
    border-left: 1px solid ${(props) => props.theme.borderColor};
    border-bottom: 1px solid ${(props) => props.theme.borderColor};
  }

  .message-header-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid ${(props) => props.theme.borderColor};
  }

  .message-header {
    display: flex;
    align-items: center;
    padding: 0 20px;
  }

  .post-actions-stats {
    padding: 1rem;
    padding-bottom: 0.1rem;
  }

  .post-actions {
    display: flex;
    align-items: center;
    padding-bottom: 0.5rem;
  }

  .post-actions svg:last-child {
    margin-left: auto;
  }

  .chat-username {
    font-weight: 600;
    font-size: 16px;
  }

  .chat-message-box {
    padding-top: 0.2rem;
    padding-bottom: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
    height: 400px;
    overflow-x: hidden;
    overflow-y: auto;
    scrollbar-width: none;
  }

  .button-area {
    margin: auto;
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .input-area-wrapper {
    width: 100%;
    padding-bottom: 20px;
    padding-top:20px;
    padding-left: 20px;
    padding-right:20px;
    border: none;
    justify-self: flex-end;
  }

  .chat-input-area {
    border: solid;
    border-width: 1px;
    border-radius: 2rem;
    border-color: #dbdbdb;
    display: flex;
    justify-content: space-between;
  }

  .comments::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  svg {
    margin-right: 1rem;
  }

  .text-area {
    flex: 1;
  }

  .emoji {
    padding: 0.5rem 0 0 1rem;
    margin: auto;
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  textarea {
    height: 100%;
    width: 100%;
    background: ${(props) => props.theme.bg};
    border: none;
    resize: none;
    padding: 0.5rem 0 0 0rem;
    left:1px;
    font-size: 1rem;
    display: inline-block;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  }

  .send-button {
    border: none;
    font-weight: 500;
    color: rgba(var(--d69,0,149,246),1);
    background-color:transparent;
    font-size:1rem;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    padding: 0.5rem 1rem 0.5rem 1rem;
  }

  .send-noinput-button {
    border: none;
    font-weight: 500;
    color: rgba(var(--d69,0,149,246),1);
    background-color:transparent;
    font-size:1rem;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    padding: 0.5rem 1rem 0.5rem 1rem;
    opacity: 0.3;
    cursor: auto;
  }

  @media screen and (max-width: 840px) {
    display: flex;
    flex-direction: column;

    .comments {
      height: 100%;
    }
  }
`;

const Direct = () => {
  // username : undefinded / username;
    const { username } = useParams();
    // console.log(username === undefined);
    const [loading, setLoading] = useState(true);
    const message = useInput("");
    var hasValue = message.value !== "";
    const [row, setRow] = useState(1);
    const maxTextAreaHeight = 116;
    const [messageList, setMessageList] = useState([]);
    var tempArea = document.getElementById("message-box");
    var date1 = new Date();
    date1.setMinutes(12);

    const scrollToBottom = () => {
      if (tempArea !== null) {
        // console.log(tempArea.scrollTop + " " +tempArea.scrollHeight);
        tempArea.scrollTop = tempArea.scrollHeight;
        // console.log(tempArea.scrollTop + " " +tempArea.scrollHeight);
      }
    }

    var tempMesg = {
      isSender: false,
      sender: "jay4195",
      receiver: "lisi",
      text: "フォローしてくれてありがとう💖もしよかったらLINEとかも交換しませんか？あたし遊び友達とかもインスタで募集してるので😋大丈夫そうだったら友達追加お願いします💖",
      createdAt: date1
    }

    tempMesg = {
      isSender: true,
      sender: "jay4195",
      receiver: "lisi",
      text: "笑笑。追加してもいいですよ。でも私は日本人にいませんので、中国人です",
      createdAt: new Date()
    }

    // scrollToBottom();
    
    const messageChange = (message) => {
      console.log("on change");
      var tempArea = document.getElementById("textarea");
      if (tempArea !== null) {
        tempArea.style.height = 'auto';
        if (tempArea.scrollHeight >= maxTextAreaHeight) {
          tempArea.style.height = maxTextAreaHeight + 'px';
        } else {
          tempArea.style.height = tempArea.scrollHeight + 'px';
        }
      }
      return message.onChange;
    };

    const handleSendMessage = () => {
      console.log("send message");
      tempMesg = {
        isSender: true,
        sender: "jay4195",
        receiver: username,
        text: message.value,
        createdAt: new Date()
      }
      // console.log(tempMesg.text);
      messageList.push(tempMesg);
      message.setValue("");
      // console.log(messageList);
      setTimeout(() => {
        scrollToBottom();
        var tempArea = document.getElementById("textarea");
        tempArea.style.height = 'auto';
      }, 0);
    }
  
    useEffect(() => {
        setLoading(false);
      }, []);

    if (loading) {
      return <Loader />;
    };

    // setTimeout(() => {
    //   scrollToBottom();
    // }, 10);
  
    return (
      <Wrapper>
        <div className = "contact-list-wrapper">
          <div className="contact-list-header">
            <div className="chat-username">
              username
            </div>
            <span className="down-icon">
              <DownChevronIcon/>
            </span>
          </div>
          <div className="contact-list">
          </div>
        </div>
  
        <div className="message-info">
          <div className="message-header-wrapper">
            <div className="message-header">
              <Avatar
                // onClick={() => history.push(`/${post.user?.username}`)}
                className="pointer avatar"
                src={"http://localhost:8080/upload/src=http___b-ssl.duitang._20210801151533.jpg"}
                alt="avatar"
              />
              <div className="chat-username">
                username
              </div>
            </div>
          </div>
        
          <div id="message-box" className="chat-message-box">
            <Message message={messageList} ></Message>
          </div>
          <div className="input-area-wrapper">
              <div className="chat-input-area">
                <div className="emoji">
                  <EmojiIcon/>
                </div>
                <div className="text-area">
                  <textarea
                    id="textarea"
                    rows={row}
                    columns="20"
                    placeholder="Message..."
                    value={message.value}
                    onChange={messageChange(message)}
                    wrap="hard"
                  ></textarea>
                </div>
                <div className = "button-area">
                  {!hasValue && (
                    <button className="send-noinput-button" disabled>Send</button> 
                  )}
                  {hasValue && (
                    <button className="send-button" onClick={handleSendMessage}>Send</button> 
                  )}
                </div>
              </div>
          </div>
        </div>
      </Wrapper>
    );
  };
  
  export default Direct;