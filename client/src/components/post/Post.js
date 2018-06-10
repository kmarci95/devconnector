import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../common/Spinner';
import { getPost } from '../../actions/postActions';
import PostItem from '../posts/PostItem';
import {Link} from 'react-router-dom';
import CommentForm from './CommentForm';
import CommentFeed from './CommentFeed';

class Post extends Component {
  componentDidMount() {
    this.props.onGetPost(this.props.match.params.id);
  }

  render() {
    const {post, loading} = this.props.post;
    let postContent;

    if(post === null || loading || Object.keys(post).length === 0) {
      postContent = <Spinner/>;
    } else {
      postContent = (
        <div>
          <PostItem post={post} showActions={false} profile={this.props.profile}/>
          <CommentForm postId={post._id}/>
          <CommentFeed comments={post.comments} postId={post._id} profile={this.props.profile}/>
        </div>
      );
    }

    return (
      <div className="post">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <Link to="/feed" className="btn btn-light mb-3">Back To Feed</Link>
              {postContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Post.propTypes = {
  onGetPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    post: state.post,
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onGetPost: (id) => dispatch(getPost(id))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Post);