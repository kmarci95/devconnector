import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { deletePost, addLike, removeLike } from '../../actions/postActions';

class PostItem extends Component {
  state = {
    profiles: []
  };

  componentWillReceiveProps(nextProps) {
    this.setState({profiles: nextProps.profile.profiles});
  }

  onDeleteClick = (id) => {
    this.props.deletePost(id);
  };

  onLikeClick = (id) => {
    this.props.addLike(id);
  };

  onUnlikeClick = (id) => {
    this.props.removeLike(id);
  };

  findUserLike = (likes) => {
    const {auth} = this.props;
    return ( likes.filter(like => like.user === auth.user.id).length > 0 );
  };

  render() {
    const { post, auth, showActions } = this.props;
    const user = {...this.state.profiles.filter(profile => profile.user._id === post.user)[0]};

    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-md-2">
            <Link to={`/profile/${user.handle}`}>
              <img className="rounded-circle d-none d-md-block"
                   src={post.avatar}
                   alt=""/>
            </Link>
            <br/>
            <p className="text-center">{post.name}</p>
          </div>
          <div className="col-md-10">
            <p className="lead">{post.text}</p>
            {showActions ? (
              <span>
                <button type="button" className="btn btn-light mr-1" onClick={() => this.onLikeClick(post._id)}>
                <i className={classnames('fas fa-thumbs-up', {'text-info': this.findUserLike(post.likes)})}></i>
                <span className="badge badge-light">{post.likes.length}</span>
              </button>
              <button type="button" className="btn btn-light mr-1" onClick={() => this.onUnlikeClick(post._id)}>
              <i className="text-secondary fas fa-thumbs-down"></i>
              </button>
              <Link to={`/post/${post._id}`} className="btn btn-info mr-1">
              Comments
              </Link>
                {post.user === auth.user.id ? (
                  <button className="btn btn-danger mr1" onClick={() => this.onDeleteClick(post._id)} type="button">
                    <i className="fas fa-times"></i>
                  </button> ) : null}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

PostItem.defaultProps = {
  showActions: true,
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object,
  deletePost: PropTypes.func.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  }
};

export default connect(mapStateToProps, {deletePost, addLike, removeLike})(PostItem);