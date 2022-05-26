import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getRanking, saveScore } from '../services/services';

class Header extends Component {
  constructor() {
    super();

    this.state = {
      timesPlayed: getRanking().length - 1,
    };
  }

  componentDidMount() {
    const { score } = this.props;
    const ranking = getRanking();
    const { name } = ranking[ranking.length - 1];
    saveScore(score, name);
  }

  render() {
    const { score: currentScore, firstRender } = this.props;
    const { timesPlayed } = this.state;
    const { name, picture, score: scoreValueSaved } = getRanking()[timesPlayed];
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
