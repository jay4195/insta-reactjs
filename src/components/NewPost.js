import React, { useContext, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import Modal from "./Modal";
import useInput from "../hooks/useInput";
import { FeedContext } from "../context/FeedContext";
import { client, uploadImage } from "../utils";
import { NewPostIcon } from "./Icons";

const NewPostWrapper = styled.div`
  .newpost-header {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 1rem;
  }

  .newpost-image-wrapper {
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

  .right-button {
    background:url('/angle-right.png');
    height: 30px;
    width: 30px;
    position: absolute;
    margin-left: -35px;
    border: none;
    opacity: 70%;
  }

  .newpost-header h3:first-child {
    color: ${(props) => props.theme.red};
  }

  h3 {
    cursor: pointer;
  }

  .newpost-header h3:last-child {
    color: ${(props) => props.theme.blue};
  }

  textarea {
    height: 100%;
    width: 100%;
    font-family: "Fira Sans", sans-serif;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    border: none;
    resize: none;
  }

  .modal-content {
    width: 700px;
  }

  @media screen and (max-width: 780px) {
    .modal-content {
      width: 90vw;
    }
  }
`;


const NewPost = () => {
  const { feed, setFeed } = useContext(FeedContext);
  const [showModal, setShowModal] = useState(false);
  const caption = useInput("");
  // preview = new Array();
  const [preview, setPreview] = useState([]);
  // const [postImage, setPostImage] = useState([]);
  const [images, setImages] = useState([]);
  const [fileLimit, setFileLimit] = useState(0);
  const [imgId, setImgId] = useState(0);
  const [hasLeft, setHasLeft] = useState(false);
  const [hasRight, setHasRight] = useState(false);

  const handleUploadImage = (e) => {
    var readImages = e.target.files;
    var fileLength = e.target.files.length > 6 ? 6 : readImages.length;
    if (fileLength > 1) {
      setHasRight(true);
    }
    var tempPreview = new Array(fileLength);
    const reader = new FileReader();  
    function readPreview(index) {
      if(index >= fileLength) {
        return;
      }
      reader.onload = (e) => {
        let temp = e.target.result;
        tempPreview[index] = temp;
        setPreview(tempPreview);
        readPreview(index + 1);
        //所有的照片都加载完了，再显示图片
        if (index == fileLength - 1) {
          setShowModal(true);
        }
      }
      reader.readAsDataURL(readImages[index]);
    }
    readPreview(0);
    setImages(readImages);
    setFileLimit(fileLength);
  };

  const handleSubmitPost = () => {
    if (!caption.value) {
      return toast.error("Please write something");
    }

    setShowModal(false);

    const tags = caption.value
      .split(" ")
      .filter((caption) => caption.startsWith("#"));

    const cleanedCaption = caption.value
      .split(" ")
      .filter((caption) => !caption.startsWith("#"))
      .join(" ");

    caption.setValue("");

    var postImage = [];

    for (var i = 0; i < fileLimit; i++) {
      uploadImage(images[i]).then((res) => {
        postImage.push(res.secure_url);
        if (postImage.length === fileLimit) {
          const newPost = {
            caption: cleanedCaption,
            files: postImage,
            tags,
          };
          client(`/posts`, { body: newPost }).then((res) => {
            const post = res.data;
            post.isLiked = false;
            post.isSaved = false;
            post.isMine = true;
            setFeed([post, ...feed]);
            window.scrollTo(0, 0);
            toast.success("Your post has been submitted successfully");
          });
          //提交完重新刷新页面
          window.location.reload();
        }
      });
    }
  };

  const setButtonStates = (tempId) => {
    if (tempId == 0) {
      setHasLeft(false);
    } else {
      setHasLeft(true);
    }
    if (tempId < fileLimit - 1 && fileLimit > 1) {
      setHasRight(true);
    } else {
      setHasRight(false);
    }
  }

  const clickLeftButton = () => {
    let tempId = imgId - 1;
    setButtonStates(tempId);
    setImgId(tempId);
  }

  const clickRightButton = () => {
    let tempId = imgId + 1;
    setButtonStates(tempId);
    setImgId(tempId);
  }

  const handleCancel = () => {
    setShowModal(false);
    setPreview([]);
    setImages([]);
    setImgId(0);
    setFileLimit(0);
    setHasLeft(false);
    setHasRight(false);
  }

  return (
    <NewPostWrapper>
      <label htmlFor="upload-post">
        <NewPostIcon />
      </label>
      <input
        id="upload-post"
        type="file"
        multiple="multiple"
        onChange={handleUploadImage}
        accept="image/*"
        style={{ display: "none" }}
      />
      {showModal && (
        <Modal>
          <div className="modal-content">
            <div className="newpost-header">
              <h3 onClick={handleCancel}>Cancel</h3>
              <h3 onClick={handleSubmitPost}>Share</h3>
            </div>
            <div className = "newpost-image-wrapper">
              <div>
              {hasLeft && (<button className = "left-button" onClick={clickLeftButton}/>)}
              </div>
              <div>
              <img className="post-preview" src={preview[imgId]} alt="preview" />
              </div>
              <div>
              {hasRight && (<button className = "right-button" onClick={clickRightButton}/>)}
              </div>
            </div>
            <div>
              <textarea
                placeholder="Add caption"
                value={caption.value}
                onChange={caption.onChange}
              />
            </div>
          </div>
        </Modal>
      )}
    </NewPostWrapper>
  );
};

export default NewPost;
