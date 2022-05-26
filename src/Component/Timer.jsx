import React, { Component } from 'react';
// import PropTypes from 'prop-types';

class Timer extends Component {
  constructor() {
    super();

    this.state = {
    };
  }

  /* componentDidMount() {
    const ONE_SECOND = 1000;

    setInterval(() => {
      this.setState((prevState) => ({
        countDown: prevState.countDown - 1,
      }), ONE_SECOND);
    });
  } */

  render() {
    const { countDown } = this.props;
    return (
      <div>
        { countDown }
      </div>
    );
  }
}

export default Timer;
