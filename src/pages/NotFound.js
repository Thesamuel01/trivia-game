import React, { Component } from 'react';
import imageNotFound from '../image/404.png';

class NotFound extends Component {
  render() {
    return (
      <div className="">
        <img alt="logo" className="notFoundContainer" src={ imageNotFound } />
      </div>
    );
  }
}

export default NotFound;
