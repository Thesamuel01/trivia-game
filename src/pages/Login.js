import React, { Component } from 'react';
import logo from '../trivia.png';

class Login extends Component {
  constructor() {
    super();

    this.state = {
      buttonDisabled: true,
      userName: '',
      userEmail: '',
    };
  }

  handleOnChange = ({ target: { name, value } }) => {
    const { userEmail, userName } = this.state;
    this.setState({
      [name]: value,
    });
    if (userEmail.length > 1 && userName.length > 1) {
      this.setState({ buttonDisabled: false });
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
  }

  render() {
    const { userName, userEmail, buttonDisabled } = this.state;
    console.log(buttonDisabled);
    return (
      <>
        <div className="App">
          <header className="App-header">
            <img src={ logo } className="App-logo" alt="logo" />
            <p>SUA VEZ</p>
          </header>
        </div>
        <div>
          Login
          <form onSubmit={ this.handleSubmit }>
            <label htmlFor="username">
              Username
              <input
                name="userName"
                id="username"
                type="text"
                data-testid="input-player-name"
                value={ userName }
                onChange={ this.handleOnChange }
              />
            </label>
            <label htmlFor="email">
              E-mail
              <input
                name="userEmail"
                id="email"
                type="email"
                data-testid="input-gravatar-email"
                value={ userEmail }
                onChange={ this.handleOnChange }
              />
            </label>
          </form>
          <button
            type="submit"
            name="enter"
            disabled={ buttonDisabled }
          >
            Play
          </button>
        </div>
      </>
    );
  }
}

export default Login;
