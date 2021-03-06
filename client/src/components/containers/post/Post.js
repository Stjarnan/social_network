import React, { Component } from "react";
import PropTypes from "prop-types";
import Loader from "../../loader/Loader";
import PostItem from "./PostItem";
import CreateComment from "./CreateComment";
import CommentFeed from "./CommentFeed";

import "./Post.css";

// Redux
import { connect } from "react-redux";
import { getPost } from "../../../redux/actions/postActions";

class Post extends Component {
  componentDidMount() {
    this.props.getPost(this.props.match.params.id);
  }

  render() {
    const { post, loading } = this.props.post;
    let content;
    if (Object.keys(post).length === 0 || loading || post === null) {
      content = <Loader />;
    } else {
      content = (
        <div className="postContainer">
          <PostItem post={post} />
          <CreateComment postId={post._id} />
          <CommentFeed
            className="commentFeed"
            postId={post._id}
            comments={post.comments}
          />
        </div>
      );
    }

    return <div>{content}</div>;
  }
}

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.posts
});

export default connect(
  mapStateToProps,
  { getPost }
)(Post);
