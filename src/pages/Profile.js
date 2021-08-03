import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import PostPreview from "../components/PostPreview";
import ProfileHeader from "../components/ProfileHeader";
import Placeholder from "../components/Placeholder";
import Loader from "../components/Loader";
import { PostIcon, SavedIcon } from "../components/Icons";
import { client } from "../utils";
import InfiniteScroll from "react-infinite-scroll-component";
import ReactLoading from 'react-loading';

const Wrapper = styled.div`
  .profile-tab {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1.4rem 0;
  }

  .profile-tab div {
    display: flex;
    cursor: pointer;
    margin-right: 3rem;
  }

  .loader {
    display: flex;
    justify-content: center;
  }

  .infinite-scroll-wrapper {
    object-fit: fill;
  }

  .profile-tab span {
    padding-left: 0.3rem;
  }

  .profile-tab svg {
    height: 24px;
    width: 24px;
  }

  .end-message {
    color: rgba(var(--f52,142,142,142),1);
  }

  hr {
    border: 0.5px solid ${(props) => props.theme.borderColor};
  }

`;

const Profile = () => {
  const [tab, setTab] = useState("POSTS");

  const { username } = useParams();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [deadend, setDeadend] = useState(false);
  const [posts, setPosts] = useState([]);
  const [feedPosts, setFeedPosts] = useState([]);
  const [postNum, setPostNum] = useState(0);
  const [currentNum, setCurrentNum] = useState(0);
  const imgFeedLength = 2;
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    client(`/users/${username}`)
      .then((res) => {
        setLoading(false);
        setDeadend(false);
        setProfile(res.data);
        var totalPosts = res.data.posts;
        setPosts(totalPosts);
        setPostNum(totalPosts.length);
        setHasMore(totalPosts.length > 0);
        if (totalPosts.length > imgFeedLength) {
          setFeedPosts(totalPosts.slice(0, imgFeedLength));
          setCurrentNum(imgFeedLength);
        } else {
          setFeedPosts(totalPosts);
        }

      })
      .catch((err) => setDeadend(true));
  }, [username]);

  const fetchMoreData = () => {
    // a fake async api call like which sends
    // 20 more records in 1.5 secs
    if (currentNum + imgFeedLength < postNum) {
      setFeedPosts(posts.slice(0, currentNum + imgFeedLength));
      setCurrentNum(currentNum + imgFeedLength);
    } else {
      setFeedPosts(posts);
      setHasMore(false);
    }
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
  }

  return (
    <Wrapper>
      <ProfileHeader profile={profile} />
      <hr />

      <div className="profile-tab">
        <div
          style={{ fontWeight: tab === "POSTS" ? "500" : "" }}
          onClick={() => setTab("POSTS")}
        >
          <PostIcon />
          <span>POSTS</span>
        </div>
        <div
          style={{ fontWeight: tab === "SAVED" ? "500" : "" }}
          onClick={() => setTab("SAVED")}
        >
          <SavedIcon />
          <span>SAVED</span>
        </div>
      </div>

      {tab === "POSTS" && (
        <>
          {profile?.posts?.length === 0 ? (
            <Placeholder
              title="Posts"
              text="Once you start making new posts, they'll appear here"
              icon="post"
            />
          ) : (
              <div className = "infinite-scroll-wrapper">
                <InfiniteScroll
                  dataLength={feedPosts.length}
                  next={fetchMoreData}
                  hasMore={hasMore}
                  scrollThreshold={"1px"}
                  loader={<div className = "loader"><ReactLoading type={"spin"} delay={50} color={"#cccccc"} height={30} width={30}/></div>}
                  endMessage={
                    <p style={{ textAlign: "center" }}>
                      <span className = "end-message">© {new Date().getFullYear()} Instagram from Facebook</span>
                    </p>
                  }
                >
                  <PostPreview posts={feedPosts} />
                </InfiniteScroll>
              </div>
          )}
        </>
      )}

      {tab === "SAVED" && (
        <>
          {profile?.savedPosts?.length === 0 ? (
            <Placeholder
              title="Saved"
              text="Save photos and videos that you want to see again"
              icon="bookmark"
            />
          ) : (
            <PostPreview posts={profile?.savedPosts} />
          )}
        </>
      )}
    </Wrapper>
  );
};

export default Profile;
