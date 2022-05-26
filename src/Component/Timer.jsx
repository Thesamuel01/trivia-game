import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Timer extends Component {
  render() {
    const { countDown } = this.props;
    return (
      <div>
        { countDown }
      </div>
    );
  }
}

Timer.propTypes = {
  countDown: PropTypes.number.isRequired,
};

export default Timer;
