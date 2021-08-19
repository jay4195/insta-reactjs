import React, { useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import LikePost from "./LikePost";
import SavePost from "./SavePost";
import Comment from "./Comment";
import DeletePost from "./DeletePost";
import Modal from "./Modal";
import useInput from "../hooks/useInput";
import Avatar from "../styles/Avatar";
import { client } from "../utils";
import { timeSince } from "../utils";
import { MoreIcon, CommentIcon, InboxIcon } from "./Icons";
import { RoundNumber } from "./RoundNumber";

const ModalContentWrapper = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  text-align: center;
  color: #262626

  span:last-child {
    border: none;
  }

  span {
    display: block;
    padding: 1rem 0;
    border-bottom: 1px solid ${(props) => props.theme.borderColor};
    cursor: pointer;
  }
`;

export const ModalContent = ({ hideGotoPost, postId, closeModal }) => {
  const history = useHistory();

  const handleGoToPost = () => {
    closeModal();
    history.push(`/p/${postId}`);
  };

  return (
    <ModalContentWrapper>
      <span className="danger" onClick={closeModal}>
        Cancel
      </span>
      <DeletePost postId={postId} closeModal={closeModal} goToHome={true} />
      {!hideGotoPost && <span onClick={handleGoToPost}>Go to Post</span>}
    </ModalContentWrapper>
  );
};

export const PostWrapper = styled.div`
  width: 615px;
  background: ${(props) => props.theme.white};
  border: 1px solid ${(props) => props.theme.borderColor};
  margin-bottom: 1.5rem;

  .post-header-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .post-header {
    display: flex;
    align-items: center;
    padding: 1rem;
  }

  .post-header h3 {
    cursor: pointer;
    font-size: 1rem;
    font-weight:500;
  }

  .post-image-wrapper {
		display: flex;
		align-items: center;
  }

  .post-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .image-wrapper {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .left-button {
    background:url('/angle-left.png');
    height: 30px;
    width: 30px;
    position: absolute;
    margin-left: 5px;
    border: none;
    opacity: 70%;
  }

  .right-button {
    background:url('/angle-right.png');
    height: 30px;
    width: 30px;
    position: absolute;
    margin-left: -35px;
    border: none;
    opacity: 70%;
  }

  .post-actions {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    padding-bottom: 0.2rem;
  }

  .post-actions svg:last-child {
    margin-left: auto;
  }

  svg {
    margin-right: 1rem;
  }

  .likes-caption-comments {
    padding: 1rem;
    padding-top: 0.3rem;
  }

  .username {
    padding-right: 0.3rem;
  }

  .view-comments {
    color: ${(props) => props.theme.secondaryColor};
    cursor: pointer;
  }

  .add-comment {
    display: flex;
    flex-direction: row;
    border-top: 1px solid ${(props) => props.theme.borderColor};
  }

  .comment-area {
    flex: 1;
  }

  textarea {
    height: 100%;
    width: 100%;
    flex: 1;
    border: none;
    resize: none;
    padding: 1rem 0 0 1rem;
    font-size: 1rem;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  }

  .post-button {
    border: none;
    font-weight: 500;
    color: rgba(var(--d69,0,149,246),1);
    background-color:transparent;
    font-size:1rem;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    display: inline;
    padding: 1rem 1rem 1rem 1rem;
  }

  .post-noinput-button {
    border: none;
    font-weight: 500;
    color: rgba(var(--d69,0,149,246),1);
    background-color:transparent;
    font-size:1rem;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    display: inline;
    padding: 1rem 1rem 1rem 1rem;
    opacity: 0.3;
    cursor: auto;
  }

  .hashtag{
    color: #00376b;
    text-decoration: none;
  }

  @media screen and (max-width: 690px) {
    width: 99%;
  }
`;

const Post = ({ post }) => {
  const comment = useInput("");
  const history = useHistory();

  const [showModal, setShowModal] = useState(false);
  const closeModal = () => setShowModal(false);

  const [newComments, setNewComments] = useState([]);
  const [likesState, setLikes] = useState(post.likesCount);

  const postLength = post.files.length;
  const postImages = post.files;
  const [hasLeft, setHasLeft] = useState(false);
  const [hasRight, setHasRight] = useState(postLength > 1 ? true : false);
  const [imgId, setImgId] = useState(0);
  const [hashtags, setHashtags] = useState(post.tags);

  const incLikes = () => setLikes(likesState + 1);
  const decLikes = () => setLikes(likesState - 1);

  var hasValue = comment.value !== "";

  const handleAddComment = () => {
    if (comment.value !== "") {
      client(`/posts/${post._id}/comments`, {
        body: { text: comment.value },
      }).then((resp) => setNewComments([...newComments, resp.data]));
      comment.setValue("");
    }
  };

  const setButtonStates = (tempId) => {
    if (tempId === 0) {
      setHasLeft(false);
    } else {
      setHasLeft(true);
    }
    if (tempId < postLength - 1 && postLength > 1) {
      setHasRight(true);
    } else {
      setHasRight(false);
    }
  };

  const clickLeftButton = () => {
    let tempId = imgId - 1;
    setButtonStates(tempId);
    setImgId(tempId);
  };

  const clickRightButton = () => {
    let tempId = imgId + 1;
    setButtonStates(tempId);
    setImgId(tempId);
  };

  return (
    <PostWrapper>
      <div className="post-header-wrapper">
        <div className="post-header">
          <Avatar
            className="pointer"
            src={post.user?.avatar}
            alt="avatar"
            onClick={() => history.push(`/${post.user?.username}`)}
          />
          <h3
            className="pointer"
            onClick={() => history.push(`/${post.user?.username}`)}
          >
            {post.user?.username}
          </h3>
        </div>

        {showModal && (
          <Modal>
            <ModalContent postId={post._id} closeModal={closeModal} />
          </Modal>
        )}
        {post.isMine && <MoreIcon onClick={() => setShowModal(true)} />}
      </div>
        <div className = "post-image-wrapper">
          {hasLeft && (<div><button className = "left-button" onClick={clickLeftButton}/></div>)}
          <div className = "image-wrapper">
          <img
            className="post-img"
            src={postImages[imgId]}
            alt="post-img"
          />
          </div>
          {hasRight && (<div><button className = "right-button" onClick={clickRightButton}/></div>)}
        </div>
      <div className="post-actions">
        <LikePost
          isLiked={post.isLiked}
          postId={post._id}
          incLikes={incLikes}
          decLikes={decLikes}
        />
        <CommentIcon onClick={() => history.push(`/p/${post._id}`)} />
        <InboxIcon onClick={() => history.push(`/direct/${post.user?.username}`)}/>
        <SavePost isSaved={post.isSaved} postId={post._id} />
      </div>

      <div className="likes-caption-comments">
        {likesState !== 0 && (
          <span className="likes bold">
            {RoundNumber(likesState)} {likesState > 1 ? "likes" : "like"}
          </span>
        )}

        <p>
          <span
            onClick={() => history.push(`/${post.user?.username}`)}
            className="pointer username bold"
          >
            {post.user?.username}
          </span>
          {post.caption}
          <br />
          {hashtags.map((tag) => (
                <span><a className="hashtag" href={`/search/${encodeURIComponent(tag)}`}> {tag} </a></span>
              ))}
        </p>

        {post.commentsCount > 2 && (
          <span
            onClick={() => history.push(`/p/${post._id}`)}
            className="view-comments"
          >
            View all {post.commentsCount} comments
          </span>
        )}

        {post.comments?.slice(0, 2).map((comment) => (
          <Comment key={comment._id} hideavatar={true} comment={comment} />
        ))}

        {newComments.map((comment) => (
          <Comment key={comment._id} hideavatar={true} comment={comment} />
        ))}

        <span className="secondary">{timeSince(post?.createdAt)}</span>
      </div>

      <div className="add-comment">
        <div className="comment-area">
        <textarea
          columns="3"
          placeholder="Add a Comment..."
          value={comment.value}
          onChange={comment.onChange}
        ></textarea>
        </div>
        <div className = "button-area">
          {!hasValue && (
            <button className="post-noinput-button" disabled>Post</button> 
          )}
          {hasValue && (
            <button className="post-button" onClick={handleAddComment}>Post</button> 
          )}
        </div>
      </div>
    </PostWrapper>
  );
};

export default Post;
