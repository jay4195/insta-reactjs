import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import Button from "../styles/Button";
import Avatar from "../styles/Avatar";
import useInput from "../hooks/useInput";
import { UserContext } from "../context/UserContext";
import { client } from "../utils";

export const Wrapper = styled.div`
  padding: 1rem;

  img {
    cursor: pointer;
    margin-right: 40px;
  }

  .input-group {
    margin-top: 1.5rem;
  }

  .input-group > label {
    display: inline-block;
    width: 120px;
  }

  input,
  textarea {
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    padding: 0.4rem 1rem;
    font-size: 1rem;
    border-radius: 4px;
    border: 1px solid ${(props) => props.theme.borderColor};
    width: 350px;
  }

  .textarea-group {
    display: flex;
  }

  .change-avatar {
    margin-left: 40px;
    display: flex;
  }

  input[id="change-avatar"],
  input[id="change-avatar-link"] {
    display: none;
  }

  span {
    color: ${(props) => props.theme.blue};
    cursor: pointer;
  }

  button {
    margin-top: 1.5rem;
    margin-left: 8rem;
    margin-bottom: 1rem;
  }

  button[disabled] {
    opacity: 0.3;
  }

  @media screen and (max-width: 550px) {
    width: 98%;

    .input-group {
      display: flex;
      flex-direction: row;
    }

    label {
      padding-bottom: 0.5rem;
      font-size: 1rem;
    }

    button {
      margin-left: 0;
    }
  }

  .item-name {
    font-weight: 500;
    text-align: right;
    margin-right: 10px;
    color: rgba(var(--i1d,38,38,38),1);
  }

  @media screen and (max-width: 430px) {
    input,
    textarea {
      width: 99%;
    }
  }
`;

const ChangePassword = () => {
  const history = useHistory();
  const { user, setUser } = useContext(UserContext);

  const oldPassword = useInput("");
  const newPassword = useInput("");
  const confirmPassword = useInput("");
  const passwordMinLength = 6;
  const [buttonState, setButtonStates] = useState(true);

    if (oldPassword.value === "" || newPassword.value === "" || confirmPassword.value === "") {
        if (buttonState === false) {
            setButtonStates(true);
        }
    } else {
        if (buttonState === true) {
            setButtonStates(false);
        }
    }


  const handleChangePassword = (e) => {
    e.preventDefault();

    if (newPassword.value.length < passwordMinLength) {
        return toast.error("Password should longer than " + passwordMinLength + " characters!");
    }

    if (newPassword.value !== confirmPassword.value) {
        return toast.error("Confirm Password not match!");
    }

    const body = {
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
    };

    // TODO
    client("/users/password/change", { method: "PUT", body })
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
        history.push(`/${body.username || user.username}`);
      })
      .catch((err) => toast.error(err.message));
  };

  return (
    <Wrapper>
      <form onSubmit={handleChangePassword}>
        <div className="input-group change-avatar">
          <div>
            <label htmlFor="change-avatar">
              <Avatar
                lg
                src={user.avatar}
                alt="avatar"
              />
            </label>
          </div>
          <div className="change-avatar-meta">
            <h2>{user.username}</h2>
          </div>
        </div>

        <div className="input-group">
          <label className="item-name">Old Password</label>
          <input
            type="password"
            value={oldPassword.value}
            onChange={oldPassword.onChange}
            placeholder="Old Password"
          />
        </div>

        <div className="input-group">
          <label className="item-name">New Password</label>
          <input
            type="password"
            value={newPassword.value}
            onChange={newPassword.onChange}
            placeholder="New Password"
          />
        </div>

        <div className="input-group">
          <label className="item-name">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword.value}
            onChange={confirmPassword.onChange}
            placeholder="Confirm New Password"
          />
        </div>

       

        <Button disabled={buttonState}>Change Password</Button>
      </form>
    </Wrapper>
  );
};

export default ChangePassword;
