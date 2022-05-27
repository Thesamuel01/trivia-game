import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getRanking, updateRankig } from '../services/services';
import { resetStore } from '../redux/actions/actions';

class Header extends Component {
  constructor() {
    super();

    this.state = {
      endRender: false,
    };
  }

  componentDidMount() {
    /*
    LOGICA PARA RESOLVER O BUG DO REFRESH
    AGORA CASO A PESSOA APERTE O VOLTAR NA TELA DE FEEDBACK, O HEADER ZERA OS VALORES
    COMO SE FOSSE UMA TENTATIVA NOVA, MAS NO MESMO PERFIL DE USUARIO
    */
    const { history: { location: { pathname } }, resetGame } = this.props;
    const rankings = getRanking();
    const currentRanking = rankings[rankings.length - 1];
    const hasRefresh = currentRanking.gotRefresh && !pathname.includes('feedback');

    if (hasRefresh) {
      updateRankig(0, 0, currentRanking);
      resetGame();
    }

    this.setState({
      endRender: true,
    });
  }

  returnHeaderInfos = () => {
    const { score: currentScore, firstRender } = this.props;
    const rankingsSaved = getRanking();
    const { name, picture, score } = rankingsSaved[rankingsSaved.length - 1];
    const points = firstRender ? score : currentScore;

    return { name, picture, points };
  }

  render() {
    const { endRender } = this.state;
    const { name, picture, points } = this.returnHeaderInfos();

    return (
      <div>
        {
          endRender
          && (
            <header>
              <img
                alt="user"
                src={ picture }
                data-testid="header-profile-picture"
              />
              <h2 data-testid="header-player-name">{ name }</h2>
              <span data-testid="header-score">{ points }</span>
            </header>
          )
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  firstRender: state.player.firstRender,
  score: state.player.score,
});

const mapDispatchToProps = (dispatch) => ({
  resetGame: () => dispatch(resetStore()),
});

Header.propTypes = {
  firstRender: PropTypes.bool.isRequired,
  score: PropTypes.number.isRequired,
  history: PropTypes.shape({
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  resetGame: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
