import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { deleteComment } from '../../actions/postActions';
import { Link } from 'react-router-dom';
import { getProfiles} from "../../actions/profileActions";
import Spinner from '../common/Spinner';


class CommentItem extends Component {
  componentDidMount() {
    this.props.getProfiles();
  }

  onDeleteClick = (postId, commentId) => {
    this.props.deleteComment(postId, commentId);
  };

  render() {
    console.log(this.props.profile);
    let commentItem = <Spinner/>;
    if(!this.props.profile.loading) {
      const { comment, postId, auth, profile } = this.props;
      const user = {...profile.profiles.filter(profile => profile.user.name === comment.name)[0]};

      commentItem = (
        <div className="card card-body mb-3">
          <div className="row">
            <div className="col-md-2">
              <Link to={`/profile/${user.handle}`}>
                <img className="rounded-circle d-none d-md-block" src={comment.avatar} alt="" />
              </Link>
              <br />
              <p className="text-center">{comment.name}</p>
            </div>
            <div className="col-md-10">
              <p className="lead">{comment.text}</p>
              {comment.user === auth.user.id ? (
                <button className="btn btn-danger mr1" onClick={() => this.onDeleteClick(postId, comment._id)} type="button">
                  <i className="fas fa-times"></i>
                </button> ) : null}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div>
        {commentItem}
      </div>
    );
  }
}

CommentItem.propTypes = {
  deleteComment: PropTypes.func.isRequired,
  comment: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    profile: state.profile
  }
};

export default connect(mapStateToProps, { deleteComment, getProfiles })(CommentItem);