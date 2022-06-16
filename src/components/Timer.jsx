import PropTypes from 'prop-types';
import React, { Component } from 'react';

class Timer extends Component {
  render() {
    const { countDown } = this.props;
    return (
      <div className="timerGame">
        { ` ${countDown}` }
      </div>
    );
  }
}

Timer.propTypes = {
  countDown: PropTypes.number.isRequired,
};

export default Timer;
