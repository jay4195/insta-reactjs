import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ProfileForm from "../components/ProfileForm";
import { useHistory, useParams } from "react-router-dom";


const Wrapper = styled.div`
  width: 100%;
  height: 700px;
  border: 1px solid ${(props) => props.theme.borderColor};
  display: flex;
  background: ${(props) => props.theme.white};
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif

  .tabs {
    border-right: 1px solid ${(props) => props.theme.borderColor};
    padding: 1rem;
  }

  .profile-form-container {
    display: flex;
    justify-content: center;
    margin-left: 50px;
  }

  .labels-wrapper {
    list-style:none;
    width: 25%;
    border-right: 1px solid #dbdbdb;
  }

  .labels {
    border-left-color: rgba(var(--f75,38,38,38),1);
    // font-weight: 600;
    border-left: 2px solid transparent;
    display: block;
    font-size: 16px;
    height: 100%;
    padding: 16px 16px 16px 30px;
    line-height: 20px;
    list-style:none;
  }

  .labels: hover {
    border-left-color: #dbdbdb;
    background-color: rgba(200,200,200,0.1);
  }

  .labels-select {
    border-left-color: rgba(var(--f75,38,38,38),1);
    font-weight: 600;
    border-left: 2px solid;
    display: block;
    font-size: 16px;
    height: 100%;
    padding: 16px 16px 16px 30px;
    line-height: 20px;
    list-style:none;
  }



  @media screen and (max-width: 970px) {
    width: 90%;
  }

  @media screen and (max-width: 700px) {
    width: 98%;
  }

  @media screen and (max-width: 550px) {
    width: 99%;
  }
`;

const EditProfile = () => {
  const history = useHistory();
  console.log(history.location.pathname);
  var currentPathName = history.location.pathName;
  var pathName = new Array("/accounts/edit", 
                           "/accounts/password/change");
  console.log(history);     
  console.log(pathName);                 
  for (var path of pathName) {
    console.log(path);
    console.log("/accounts/edit" === currentPathName);
  }
  const setItemStyle = (tabindex) => {
  }

  return (
    <Wrapper>
      <div className="labels-wrapper">
        <li>
          <a className="labels-select" href="/accounts/edit/" >Edit Profile</a>
        </li>
        <li>
          <a className="labels" href="/accounts/password/change/" >Change Password</a>
        </li>
      </div>
      <div className="profile-form-container">
        <ProfileForm />
      </div>
    </Wrapper>
  );
};

export default EditProfile;
