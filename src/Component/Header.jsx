import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as localStorage from '../services/services';

class Header extends Component {
  constructor() {
    super();

    this.state = {
      firstRender: true,
      userInfos: {
        name: '',
        picture: '',
        score: 0,
      },
    };
  }

  render() {
    const { userInfos } = this.state;
    const { name, picture, score } = false ? localStorage.getRanking() : userInfos;

    return (
      <div>
        <header>
          <img
            src={ picture }
            alt="user"
            data-testid="header-profile-picture"
          />
          <h2 data-testid="header-player-name">{ name }</h2>
          <span data-testid="header-score">{ score }</span>
        </header>
      </div>
    );
  }
}

// const mapStateToProps = (state) = ({
//   firstRender: state.player.firstRender,
// });

/* Header.propTypes = {
  firstRender: PropTypes.bool.isRequired,
}; */

export default connect()(Header);
