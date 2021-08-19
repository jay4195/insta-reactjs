import React, { useState, useEffect } from "react";
import PostPreview from "../components/PostPreview";
import Loader from "../components/PostPreview";
import { client } from "../utils";
import styled from "styled-components";

const Wrapper = styled.div`
  .result-stat {
    color: #70757a;
  }
`;

const Explore = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    client("/posts").then((res) => {
      setPosts(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Wrapper>
      <div style={{ marginTop: "2.3rem" }}>
        <h2 className="result-stat">Explore</h2>
        <PostPreview posts={posts} />
      </div>
    </Wrapper>
  );
};

export default Explore;
