import React, { useRef, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import LikePost from "../components/LikePost";
import SavePost from "../components/SavePost";
import Comment from "../components/Comment";
import Placeholder from "../components/Placeholder";
import Avatar from "../styles/Avatar";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import { ModalContent } from "../components/Post";
import useInput from "../hooks/useInput";
import { client } from "../utils";
import { timeSince } from "../utils";
import { MoreIcon, CommentIcon, InboxIcon } from "../components/Icons";
import { RoundNumber } from "../components/RoundNumber";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 60% 1fr;

  .post-info {
    border: 1px solid ${(props) => props.theme.borderColor};
  }

  .post-header-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid ${(props) => props.theme.borderColor};
  }

  .post-header {
    display: flex;
    align-items: center;
  }

  .post-image-wrapper {
		display: flex;
		align-items: center;
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

  .hashtag{
    color: rgba(var(--fe0,0,55,107),1);
    text-decoration: none;
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

  .post-img {
    height:100%;
    width:100%;
    object-fit: fill;
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

  .comments {
    border-bottom: 1px solid ${(props) => props.theme.borderColor};
    padding: 1rem;
    height: 300px;
    overflow-y: scroll;
    scrollbar-width: none;
  }

  .comments::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  svg {
    margin-right: 1rem;
  }

  textarea {
    height: 100%;
    width: 100%;
    background: ${(props) => props.theme.bg};
    border: none;
    resize: none;
    padding: 1rem 0 0 1rem;
    font-size: 1rem;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  }

  .add-comment {
    display: flex;
    flex-direction: row;
    border-top: 1px solid ${(props) => props.theme.borderColor};
  }

  .comment-area {
    flex: 1;
  }

  .post-caption-wrapper {
    display:flex;
    padding: 0.4rem 0px;
    span {
      padding-right: 0.4rem;
    }
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

  @media screen and (max-width: 840px) {
    display: flex;
    flex-direction: column;

    .comments {
      height: 100%;
    }
  }
`;

const DetailedPost = () => {
  const history = useHistory();
  const { postId } = useParams();

  const comment = useInput("");
  const commmentsEndRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const closeModal = () => setShowModal(false);

  const [loading, setLoading] = useState(true);
  const [deadend, setDeadend] = useState(false);
  const [post, setPost] = useState({});

  const [likesState, setLikes] = useState(0);
  const [commentsState, setComments] = useState([]);
  const [tagsState, setTags] = useState([]);

  //post
  const [postLength, setPostLength] = useState(0);
  const [hasLeft, setHasLeft] = useState(false);
  const [hasRight, setHasRight] = useState(false);
  const [imgId, setImgId] = useState(0);

  const incLikes = () => setLikes(likesState + 1);
  const decLikes = () => setLikes(likesState - 1);

  var hasValue = comment.value !== "";

  const scrollToBottom = () =>
    commmentsEndRef.current.scrollIntoView({ behaviour: "smooth" });

  const handleAddComment = () => {
    if (comment.value !== "") {
      client(`/posts/${post._id}/comments`, {
        body: { text: comment.value },
      }).then((resp) => {
        setComments([...commentsState, resp.data]);
        scrollToBottom();
      });
      comment.setValue("");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    client(`/posts/${postId}`)
      .then((res) => {
        setPost(res.data);
        var length = res.data.files.length;
        setPostLength(length);
        if (length > 1) {
          setHasRight(true);
        }
        setComments(res.data.comments);
        setLikes(res.data.likesCount);
        setTags(res.data.tags);
        setLoading(false);
        setDeadend(false);
      })
      .catch((err) => setDeadend(true));
  }, [postId]);

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

  if (!deadend && loading) {
    return <Loader />;
  }

  if (deadend) {
    return (
      <Placeholder
        title="Sorry, this page isn't available"
        text="The link you followed may be broken, or the page may have been removed"
      />
    );
  };

  return (
    <Wrapper>
      <div className = "post-image-wrapper">
         <div>
          {hasLeft && (<button className = "left-button" onClick={clickLeftButton}/>)}
          </div>
          <img
            className="post-img"
            src={post.files[imgId]}
            alt="post-img"
          />
          <div>
          {hasRight && (<button className = "right-button" onClick={clickRightButton}/>)}
          </div>
      </div>

      <div className="post-info">
        <div className="post-header-wrapper">
          <div className="post-header">
            <Avatar
              onClick={() => history.push(`/${post.user?.username}`)}
              className="pointer avatar"
              src={post.user?.avatar}
              alt="avatar"
            />
            <h3
              className="pointer"
              onClick={() => history.push(`/${post.user?.username}`)}
            >
              {post.user?.username}
            </h3>
          </div>
          {post.isMine && <MoreIcon onClick={() => setShowModal(true)} />}

          {showModal && (
            <Modal>
              <ModalContent
                postId={post._id}
                hideGotoPost={true}
                closeModal={closeModal}
              />
            </Modal>
          )}
        </div>
      
        <div className="comments">
          {post.caption !== null && (
          <div className = "post-caption-wrapper">
            <Avatar
              className="pointer"
              onClick={() => history.push(`/${comment.user.username}`)}
              src={post.user.avatar}
              alt="avatar"
            />
            <span
              onClick={() => history.push(`/${post.user?.username}`)}
              className="bold pointer"
            >
              {post.user?.username}
            </span>
            <div className="post-caption">
              <div>{post.caption}</div>
              {tagsState.map((tag) => (
                <span><a className="hashtag" href={`/search/${encodeURIComponent(tag)}`}>{tag}</a></span>
              ))}
            </div>
          </div>
          )}

          {commentsState.map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))}
          <div ref={commmentsEndRef} />
        </div>

        <div className="post-actions-stats">
          <div className="post-actions">
            <LikePost
              isLiked={post?.isLiked}
              postId={post?._id}
              incLikes={incLikes}
              decLikes={decLikes}
            />
            <CommentIcon />
            <InboxIcon />
            <SavePost isSaved={post?.isSaved} postId={post?._id} />
          </div>

          {likesState !== 0 && (
            <span className="likes bold">
              {RoundNumber(likesState)} {likesState > 1 ? "likes" : "like"}
            </span>
          )}
        </div>

        <span
          style={{ display: "block", padding: "0 1rem", paddingBottom: "1rem" }}
          className="secondary"
        >
          {timeSince(post.createdAt)}
        </span>

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
      </div>
    </Wrapper>
  );
};

export default DetailedPost;
