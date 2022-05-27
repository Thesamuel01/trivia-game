import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Ranking extends Component {
  render() {
    const { history } = this.props;

    return (

      <>
        <h1 data-testid="ranking-title">Ranking</h1>
        <button
          type="button"
          name="homeBtn"
          onClick={ () => history.push('/') }
          data-testid="btn-go-home"
        >
          Home
        </button>
      </>
    );
  }
}

Ranking.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
