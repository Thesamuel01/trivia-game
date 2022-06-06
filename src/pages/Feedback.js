import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
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
      <div className="feedBack">
        <Header
          history={ history }
        />
        <section className="feedbackContainer">
          <h1
            data-testid="feedback-text"
            className="feedbackText"
          >

            {player.assertions >= THREE ? 'Well Done!' : 'Could be better...' }

          </h1>
          <div className="feedbackDiv1">
            Você acertou
            <span
              data-testid="feedback-total-question"
              className="feedbackSpan"
            >
              {` ${player.assertions} `}
            </span>
            Perguntas
          </div>
          <div className="feedbackDiv2">
            {'  '}
            Um total de
            <span
              data-testid="feedback-total-score"
              className="feedbackSpan"
            >
              {` ${player.score} `}

            </span>
            pontos
          </div>
          <div className="feddback_buttonDiv">
            <button
              type="button"
              className="feedbackButton1"
              data-testid="btn-ranking"
              onClick={ () => history.push('/ranking') }
            >
              Ranking

            </button>
            <button
              type="button"
              className="feedbackButton2"
              data-testid="btn-play-again"
              onClick={ () => history.push('/') }
            >
              Play Again

            </button>
          </div>
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
