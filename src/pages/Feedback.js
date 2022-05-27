import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../Component/Header';
import { getRanking, updateRefreshState } from '../services/services';
// import style from '../css/Feedback.module.css';

class Feedback extends Component {
  componentDidMount() {
    const rankings = getRanking();

    updateRefreshState(rankings[rankings.length - 1]);
  }

  render() {
    const THREE = 3;
    const { history } = this.props;
    const currentRanking = getRanking();
    const player = currentRanking[currentRanking.length - 1];

    return (
      <div className="background">
        <Header
          history={ history }
        />
        <section className="container">
          <h1 data-testid="feedback-text">
            {player.assertions <= THREE ? 'Could be better...' : 'Well Done!' }

          </h1>
          <div>
            Você acertou
            <span data-testid="feedback-total-question">{` ${player.assertions} `}</span>
            Perguntas
          </div>
          <div>
            Um total de
            <span data-testid="feedback-total-score">{` ${player.score} `}</span>
            pontos
          </div>
          <button
            type="button"
            data-testid="btn-ranking"
            onClick={ () => history.push('/ranking') }
          >
            Ranking

          </button>
          <button
            type="button"
            data-testid="btn-play-again"
            onClick={ () => history.push('/') }
          >
            Play Again

          </button>
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  playerDataGlobal: state.player,
});

Feedback.propTypes = {
  playerDataGlobal: PropTypes.shape({
    assertions: PropTypes.number.isRequired,
    score: PropTypes.number.isRequired,
    gravatarEmail: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};

export default connect(mapStateToProps)(Feedback);
