import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../Component/Header';
import Questions from '../Component/Questions';
import Timer from '../Component/Timer';
import { updatePoints } from '../redux/actions/actions';
import {
  clearLocalStorage, getRanking, getToken,
  // eslint-disable-next-line comma-dangle
  updateRankig
} from '../services/services';
import './Game.css';

class Game extends Component {
  constructor() {
    super();

    this.state = {
      questions: [],
      currentQuestion: {},
      endRequisition: false,
      indexQuestion: 0,
      answered: false,
      timer: 30,
      pointsBydifficulty: {
        hard: 3,
        medium: 2,
        easy: 1,
      },
    };
  }

  async componentDidMount() {
    const token = getToken();
    const url = `https://opentdb.com/api.php?amount=5&token=${token}`;
    const response = await fetch(url);
    const { response_code: code, results } = await response.json();

    if (code === 0) {
      this.saveQuestionsInState(results);
    } else {
      this.logout();
    }

    this.countDown();
  }

  countDown = () => {
    const ONE_SECOND = 1000;
    const TOTAL_TIME = 30000;

    this.clock = setInterval(() => {
      this.setState((prevState) => ({
        timer: prevState.timer - 1,
      }));
    }, ONE_SECOND);

    setTimeout(() => {
      this.handleOnUserAnswer(false);
      clearInterval(this.clock);
    }, TOTAL_TIME);
  }

  saveQuestionsInState = (results) => {
    const questions = results.map(({
      category, difficulty, question,
      correct_answer: correctAnswer, incorrect_answers: wrongAnswers,
    }) => {
      const RANDOM = 0.5;
      const answers = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - RANDOM);

      return {
        category,
        difficulty,
        correctAnswer,
        wrongAnswers,
        question,
        answers,
      };
    });

    this.setState({
      questions,
      currentQuestion: { ...questions[0] },
      endRequisition: true,
    });
  }

  logout = () => {
    const { history } = this.props;

    clearLocalStorage();
    history.push('/');
  }

  calcScore = () => {
    const { updateScore } = this.props;
    const { pointsBydifficulty, timer, currentQuestion: { difficulty } } = this.state;

    const SCORE_CONST = 10;
    const score = SCORE_CONST + (timer * pointsBydifficulty[difficulty]);

    /*
      AGORA SOMENTE UMA ACTION É RESPONSAVEL POR ATUALIZAR O ASSERTIONS E SCORE DO REDUX
    */
    updateScore(score, 1);
  }

  handleOnUserAnswer = (isTheCorrectAnswer) => {
    if (isTheCorrectAnswer) this.calcScore();

    this.setState(({ indexQuestion }) => ({
      indexQuestion: indexQuestion + 1,
      answered: true,
    }));

    clearInterval(this.clock);
  }

  goToNextQuestion = () => {
    const { indexQuestion, questions } = this.state;
    const { score, history, assertions } = this.props;
    const token = getToken();
    const ranking = getRanking();

    const userRanking = ranking[ranking.length - 1];

    this.setState({ timer: 30 });

    if (indexQuestion === questions.length) {
      /*
        AGORA É SALVO NO LOCAL STORAGE OS ASSERTIONS
      */
      updateRankig(score, assertions, userRanking);

      history.push(`/feedback/${token}`);
    } else {
      this.setState(({ indexQuestion: index, questions: questionsArray }) => ({
        answered: false,
        currentQuestion: { ...questionsArray[index] },
      }));

      this.countDown();
    }
  }

  render() {
    const { endRequisition, timer, answered, currentQuestion } = this.state;
    const { history } = this.props;

    return (
      <div>
        <Header
          history={ history }
        />
        <Timer countDown={ timer } />
        <section>
          {
            endRequisition
            && (
              <Questions
                currentQuestion={ currentQuestion }
                answered={ answered }
                handleOnUserAnswer={ this.handleOnUserAnswer }
                goToNextQuestion={ this.goToNextQuestion }
              />
            )
          }
        </section>
      </div>
    );
  }
}

Game.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  updateScore: PropTypes.func.isRequired,
  score: PropTypes.number.isRequired,
  assertions: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  score: state.player.score,
  name: state.player.name,
  assertions: state.player.assertions,
  token: state.player.token,
});

const mapDispatchToProps = (dispatch) => ({
  updateScore: (score, assertions) => dispatch(updatePoints(score, assertions)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);
