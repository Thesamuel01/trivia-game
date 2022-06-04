import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getRanking, sortRanking } from '../services/services';
/* import styles from '../Css/Ranking.module.css';
 */
export default class Ranking extends Component {
  render() {
    const { history } = this.props;
    const data = getRanking();
    const rankingData = sortRanking(data);

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
