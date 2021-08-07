import React, { useContext, useState } from "react";
import styled from "styled-components";
import Avatar from "../styles/Avatar";

const MessageWrapper = styled.div`
    .message-timestamp {
        margin:auto;
        font-size: 0.5rem;
        text-align:center;
        padding-top: 0.2rem;
        padding-bottom: 0.5rem;
        color: rgba(var(--f52,142,142,142),1);
        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    }
    .receive-box {
        display: flex;
        flex-direction: row;
        width : 100%;
        margin-bottom: 0.3rem;
    }

    .receive-message {
        width : 60%;
        font-size: 12px;
        border-radius: 1rem;
        border: 1px solid ${(props) => props.theme.borderColor};
        padding-left: 1rem;
        padding-right: 0.5rem;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
    }

    .send-box {
        display: flex;
        flex-direction: row-reverse;
        width : 100%;
        margin-bottom: 0.3rem;
        height: 100%;
        overflow: hidden;
    }

    .send-message {
        width : 60%;
        float: right;
        font-size: 12px;
        border-radius: 1rem;
        border: 1px solid ${(props) => props.theme.borderColor};
        padding-left: 1rem;
        padding-right: 0.5rem;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        background: #dbdbdb;
    }

`;

const printDoubleDigit = (time) => {
    if (time < 10) {
        return "0" + time;
    } else {
        return time;
    }
};

const printHHMM = (hour, minute) => {
    if (hour < 12) {
        return printDoubleDigit(hour) + ":" + printDoubleDigit(minute) + " am";
    } else if (hour === 12) {
        return printDoubleDigit(hour) + ":" + printDoubleDigit(minute) + " pm";
    } else {
        return printDoubleDigit(hour - 12) + ":" + printDoubleDigit(minute) + " pm";
    }
};

const printDate = (date) => {
    const monthsInEng = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    var currentYear = new Date().getFullYear();
    if (currentYear === date.getFullYear()) {
        var currentMonth = new Date().getMonth();
        var currentDate = new Date().getDate();
        if (currentMonth === date.getMonth() && currentDate === date.getDate()) {
            return printHHMM(date.getHours(), date.getMinutes()); 
        } else {
            return monthsInEng[date.getMonth()] + " " + date.getDate() + " " + printHHMM(date.getHours(), date.getMinutes());
        }
    } else {      
      return monthsInEng[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " " + printHHMM(date.getHours(), date.getMinutes());
    }
  };

const Message = (message) => {  
    // console.log(message);
    const showTimeInterval = 15;
    var lastMessage = null;
    var msgList = message.message;

    const messageBox = (mes) => {
        var printTimeStamp = false;
        /**
         * 15分钟之内回复不加时间戳
         * 如果是当天的只显示小时和分钟
         * 如果是当年的，只显示月、日
        */
        if (lastMessage === null) {
            printTimeStamp = true;
        } else {
            var secondsElapsed = Math.floor((mes.createdAt.getTime() - lastMessage.createdAt.getTime()) / 1000);
            var minutesElapsed = Math.floor(secondsElapsed / 60);
            if (minutesElapsed > showTimeInterval) {
                printTimeStamp = true;
            }
        }
        lastMessage = mes;
        if (mes.isSender) {
            return (
                <div>
                    {printTimeStamp && (
                    <div className = "message-timestamp">
                        {printDate(mes.createdAt)}
                    </div>)}
                    <div className="send-box">
                        <div className="send-message">
                            <span className="message-text">{mes.text}</span>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    {printTimeStamp && (
                    <div className = "message-timestamp">
                        {printDate(mes.createdAt)}
                    </div> )}
                    <div className="receive-box">
                        <Avatar
                        // onClick={() => history.push(`/${post.user?.username}`)}
                            className="pointer avatar"
                            src={"http://localhost:8080/upload/src=http___b-ssl.duitang._20210801151533.jpg"}
                            alt="avatar"
                        />
                        <div className="receive-message">
                            <span className="message-text">{mes.text}</span>
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <MessageWrapper>
            {msgList.map((msg) => (
                messageBox(msg)
            ))}
        </MessageWrapper>
    );
};

export default Message;
