import PropTypes from 'prop-types';
import React, { Component } from 'react';
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
        <h1 data-testid="ranking-title" className="rankH1">Ranking</h1>
        <section className="rankSection">
          {rankingData.map((ranking, index) => (
            <div className="rankDiv" key={ ranking.id }>
              <img ng src={ ranking.picture } alt="Avatar" className="rankImage" />
              <span
                className="rankName"
                data-testid={ `player-name-${index}` }
              >
                {ranking.name}

              </span>
              <span
                className="rankScore"
                data-testId={ `player-score-${index}` }
              >
                {ranking.score}

              </span>
            </div>))}
        </section>
        <button
          type="button"
          name="homeBtn"
          onClick={ () => history.push('/') }
          data-testid="btn-go-home"
          className="rankButton"
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
