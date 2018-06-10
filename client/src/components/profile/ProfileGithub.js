import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTyes from 'prop-types';

class ProfileGithub extends Component {
  state = {
    clintId: 'fe5920eb119ab79fe149',
    clientSecret: '5a3476942ce0050dd4d6d2cd289851741ea65c1a',
    count: 5,
    sort: 'created: asc',
    repos: []
  };

  componentDidMount() {
    const {username} = this.props;
    const {count, sort, clientId, clientSecret} = this.state;

    fetch(`https://api.github.com/users/${username}/repos?per_page=${count}&sort=${sort}&client_id=${clientId}&client_secret=${clientSecret}`)
      .then(res => res.json())
      .then(data => {
        if(this.refs.repos) {
          this.setState({repos: data});
        }
      })
      .catch(error => console.log(error))
  }

  render() {
    const {repos} = this.state;
    const repoItems = repos.map(repo => (
      <div key={repo.id} className="card card-body mb-2">
        <div className="row">
          <div className="col-md-6">
            <h4><a href={`http://${repo.html_url}`} className="text-info" target="_blank">{repo.name}</a></h4>
            <p>{repo.description}</p>
          </div>
          <div className="col-md-6">
            <span className="badge badge-info mr-1">Stars: {repo.stargazers_count}</span>
            <span className="badge badge-secondary mr-1">Watchers: {repo.watchers_count}</span>
            <span className="badge badge-success mr-1">Forks: {repo.forks_count}</span>
          </div>
        </div>
      </div>
    ));

    return (
      <div ref="repos">
        <hr/>
        <h3 className="mb-4">Latest Github Repos</h3>
        {repoItems}
      </div>
    );
  }
}

ProfileGithub.propTypes = {
  username: PropTyes.string.isRequired
};

export default ProfileGithub;