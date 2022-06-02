import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getRanking } from '../services/services';
import styles from '../Css/Ranking.module.css';

export default class Ranking extends Component {
  render() {
    const NUMBER = -1;
    const { history } = this.props;
    const data = getRanking();

    const rankingData = data.sort((a, b) => {
      if (a.score > b.score) return NUMBER;
      if (a.score < b.score) return 1;
      return 0;
    });

    return (

      <main>
        <h1 data-testid="ranking-title">Ranking</h1>
        <section className={ styles.container }>
          {rankingData.map((ranking, index) => (
            <div className={ styles.ranking } key={ ranking.id }>
              <img className={ styles.imgRanking } src={ ranking.picture } alt="" />
              <span data-testid={ `player-name-${index}` }>{ranking.name}</span>
              <span data-testId={ `player-score-${index}` }>{ranking.score}</span>
            </div>))}
        </section>
        <button
          type="button"
          name="homeBtn"
          onClick={ () => history.push('/') }
          data-testid="btn-go-home"
        >
          Home
        </button>
      </main>
    );
  }
}

Ranking.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
