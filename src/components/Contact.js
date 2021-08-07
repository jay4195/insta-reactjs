import React, { useContext, useState } from "react";
import styled from "styled-components";
import Avatar from "../styles/Avatar";
import { useHistory } from "react-router-dom";

const ContactWrapper = styled.div`
    .contact-box {
        display: flex;
        width: 100%;
        height: 50px;
        padding-top: 0.2rem;
        padding-bottom: 0.2rem;
        padding-left: 0.5rem;
        padding-right: 0.2rem;
        border: none;
    }

    .avatar-wrapper {
        position: relative;
        transform:translateY(10%);
    }

    .contact-box:hover {
        background-color: rgba(128,128,128,0.1);
    }

    .contact-name {
        position: relative;
        transform:translateY(15%);
    }
`;

const Contact = (contact) => {
    const history = useHistory();
    var contactList = contact.contactList;
    const contactBox = (contact) => {
        return (
            <div className = "contact-box" onClick={() => history.push(`/direct/${contact?.username}`)}>
                <div className="avatar-wrapper">
                    <Avatar
                        onClick={() => history.push(`/direct/${contact?.username}`)}
                        className="pointer avatar"
                        src={contact?.avatar}
                        alt="avatar"
                    />
                </div>
                <div className="contact-name">
                    {contact?.username}
                </div>
            </div>
        );
    };

    return (
        <ContactWrapper>
            {contactList?.map((list) => (
                contactBox(list)
            ))}
        </ContactWrapper>
    );
};

export default Contact;