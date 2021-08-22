import React, { useState, useEffect } from "react";
import PostPreview from "../components/PostPreview";
import Loader from "../components/PostPreview";
import { client } from "../utils";
import { useParams } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  .result-stat {
    color: #70757a;
  }
`;

const SearchPage = () => {
  const { query } = useParams();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [time, setTime] = useState(0);

  useEffect(() => {

    client(`/search/${query}`).then((res) => {
      setPosts(res.data);
      setLoading(false);
      setTime(res.time);
    });
  }, [query]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Wrapper>
      <div style={{ marginTop: "2.3rem" }}>
        <h2 className="result-stat">Search Results</h2>
        <text className = "result-stat"> {posts.length} results ({time/1000} seconds) </text>
        <PostPreview posts={posts} />
      </div>
    </Wrapper>
  );
};

export default SearchPage;
