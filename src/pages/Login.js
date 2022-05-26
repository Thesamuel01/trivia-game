import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import md5 from 'crypto-js/md5';
import { getTokenThunk, saveUser, resetStore,
} from '../redux/actions/actions';
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

  componentDidMount() {
    const { resetGame } = this.props;
    resetGame();
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

  saveInfosOnLocalStorage = () => {
    const { name, gravatarEmail, token } = this.props;
    const ranking = localStorage.getRanking();
    const hash = md5(gravatarEmail).toString();
    const picture = `https://www.gravatar.com/avatar/${hash}`;
    const score = 0;

    if (ranking === null) {
      localStorage.createRanking({
        name,
        score,
        picture,
      });
    } else {
      localStorage.addNewRankings({
        name,
        score,
        picture,
      });
    }
    localStorage.createToken(token);
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
