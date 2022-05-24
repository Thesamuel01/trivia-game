import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import md5 from 'crypto-js/md5';
import { getTokenThunk, saveUser } from '../redux/actions/actions';
import * as localStorage from '../services/services';

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

  saveUserOnLocalStorage = () => {
    const { name, gravatarEmail } = this.props;
    const hash = md5(gravatarEmail).toString();
    const picture = `https://www.gravatar.com/avatar/${hash}`;
    const score = 0;

    localStorage.createRanking({
      name,
      score,
      picture,
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    const { userName, userEmail } = this.state;
    const { getToken, history, saveUserInfos } = this.props;

    await getToken();
    await saveUserInfos(userName, userEmail);
    this.saveUserOnLocalStorage();

    const { token } = this.props;
    localStorage.createToken(token);
    history.push('/game');
  }

  handleOnClick = () => {
    const { history } = this.props;

    history.push('/setup');
  }

  render() {
    const { userName, userEmail, buttonDisabled } = this.state;
    return (
      <>
        <div className="App">
          <header>
            {/* <img src={ logo } className="App-logo" alt="logo" /> */}
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
            <button
              type="submit"
              name="enter"
              disabled={ buttonDisabled }
              data-testid="btn-play"
            >
              Play
            </button>
          </form>
        </div>
        <button
          data-testid="btn-settings"
          type="button"
          onClick={ this.handleOnClick }
        >
          configurações
        </button>

      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  getToken: (state) => dispatch(getTokenThunk(state)),
  saveUserInfos: (name, email) => dispatch(saveUser(name, email)),
});

const mapStateToProps = (state) => ({
  token: state.player.token,
});

Login.propTypes = {
  getToken: PropTypes.func.isRequired,
  history: PropTypes.objectOf.isRequired,
  token: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
