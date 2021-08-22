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
  const [tagIndex, setTagIndex] = useState(0);

  const history = useHistory();
  const handleSwitchTag = (tagId) => {
    setTagIndex(tagId);
  }
  var curPath = history.location.pathname;
  if (!curPath.endsWith("/")) {
    curPath = curPath + "/";
  }
  var pathList = new Array("/accounts/edit/", "/accounts/password/change/");
  for (var i = 0; i < pathList.length; i++) {
    if (curPath === pathList[i] && i !== tagIndex) {
      setTagIndex(i);
    }
  }

  const isSelect = (tagId) => {
    return tagIndex === tagId;
  }
  
  return (
    <Wrapper>
      <div className="labels-wrapper">
        <li>
          <a className={isSelect(0)? "labels-select" : "labels" } href="/accounts/edit/" >Edit Profile</a>
        </li>
        <li>
          <a className={isSelect(1)? "labels-select" : "labels" } href="/accounts/password/change/" >Change Password</a>
        </li>
      </div>
      <div className="profile-form-container">
        {isSelect(0) && <ProfileForm />}
      </div>
    </Wrapper>
  );
};

export default EditProfile;
