import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import md5 from 'crypto-js/md5';
import { getTokenThunk, saveUser, resetStore,
} from '../redux/actions/actions';
import { addRanking, createToken } from '../services/services';

class Login extends Component {
  constructor() {
    super();

    this.state = {
      buttonDisabled: true,
      userName: '',
      userEmail: '',
    };
  }

  componentDidMount() {
    const { resetGame } = this.props;
    resetGame();
  }

  handleOnChange = ({ target: { name, value } }) => {
    this.setState({
      [name]: value,
    }, () => {
      const { userEmail, userName } = this.state;
      if (userEmail.length > 0 && userName.length > 0) {
        this.setState({ buttonDisabled: false });
      }
    });
  }

  saveInfosOnLocalStorage = () => {
    const { name, gravatarEmail, token } = this.props;
    const hash = md5(gravatarEmail).toString();
    const picture = `https://www.gravatar.com/avatar/${hash}`;
    const score = 0;
    const LIMIT = 5000;

    addRanking({
      assertions: 0,
      id: md5((Math.random() * LIMIT).toString()).toString(),
      name,
      score,
      picture,
      gotRefresh: false,
    });

    createToken(token);
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    const { userName, userEmail } = this.state;
    const { getToken, history, saveUserInfos } = this.props;
    await getToken();
    await saveUserInfos(userName, userEmail);
    this.saveInfosOnLocalStorage();

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
        <div>
          <h2>Login</h2>
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
  resetGame: () => dispatch(resetStore()),
});

const mapStateToProps = (state) => ({
  name: state.player.name,
  token: state.player.token,
  gravatarEmail: state.player.gravatarEmail,
});

Login.propTypes = {
  getToken: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  token: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  gravatarEmail: PropTypes.string.isRequired,
  saveUserInfos: PropTypes.func.isRequired,
  resetGame: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
