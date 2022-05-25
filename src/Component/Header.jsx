import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as localStorage from '../services/services';

class Header extends Component {
  constructor() {
    super();

    this.state = {
      timesPlayed: localStorage.getRanking().length - 1,
    };
  }

  render() {
    const { score: currentScore, firstRender } = this.props;
    const { timesPlayed } = this.state;
    const { name, picture, score: scoreValueSaved } = localStorage
      .getRanking()[timesPlayed];
    const score = firstRender ? scoreValueSaved : currentScore;

    return (
      <div>
        <header>
          <img
            alt="user"
            src={ picture }
            data-testid="header-profile-picture"
          />
          <h2 data-testid="header-player-name">{ name }</h2>
          <span data-testid="header-score">{ score }</span>
        </header>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  firstRender: state.player.firstRender,
  score: state.player.score,
});

Header.propTypes = {
  firstRender: PropTypes.bool.isRequired,
  score: PropTypes.number.isRequired,
};

export default connect(mapStateToProps)(Header);
