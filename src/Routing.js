import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// pages, components, styles
import Nav from "./components/Nav";
import Container from "./styles/Container";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import DetailedPost from "./pages/DetailedPost";
import EditProfile from "./pages/EditProfile";
import Direct from "./pages/Direct";
import SearchPage from "./pages/SearchPage";

const Routing = () => {
  return (
    <Router>
      <Nav />
      <Container>
        <Switch>
          <Route path="/search/:query" component={SearchPage} />
          <Route path="/explore" component={Explore} />
          <Route path="/p/:postId" component={DetailedPost} />
          <Route path="/accounts/edit" component={EditProfile} />
          <Route path="/accounts/password/change" component={EditProfile} />
          <Route path="/direct/:username" component={Direct}/>
          <Route path="/direct" component={Direct}/>
          <Route path="/:username" component={Profile} />
          <Route path="/" component={Home} />
        </Switch>
      </Container>
    </Router>
  );
};

export default Routing;
