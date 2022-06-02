import md5 from 'crypto-js/md5';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import trivia from '../image/logoTrivia.png';
import { getTokenThunk, resetStore, saveUser } from '../redux/actions/actions';
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
    const { userEmail, userName } = this.state;
    this.setState({
      [name]: value,
    });
    if (userEmail.length > 0 && userName.length > 0) {
      this.setState({ buttonDisabled: false });
    }
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
      <div className="loginContainerPai">
        <section className="loginSection">
          <div className="loginContainer">
            <h2 className="loginText">Login</h2>
            <form className="loginForm" onSubmit={ this.handleSubmit }>

              <label htmlFor="username" className="loginLabel">
                <span className="loginInputName"> Username</span>
                <input
                  className="loginInput"
                  name="userName"
                  id="username"
                  type="text"
                  data-testid="input-player-name"
                  placeholder="Nome de usuário"
                  value={ userName }
                  onChange={ this.handleOnChange }
                />
              </label>
              <label htmlFor="email" className="loginLabel">

                <spam className="loginInputName">E-mail</spam>
                <input
                  className="loginInput"
                  name="userEmail"
                  placeholder="Insira o email"
                  id="email"
                  type="email"
                  data-testid="input-gravatar-email"
                  value={ userEmail }
                  onChange={ this.handleOnChange }
                />
              </label>
              <button
                className="loginButtonPlay"
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
            className="loginButtonConfigure"
            data-testid="btn-settings"
            type="button"
            onClick={ this.handleOnClick }
          >
            configurações
          </button>
        </section>
        <img alt="logo" className="loginLogoTrivia" src={ trivia } />
      </div>
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
