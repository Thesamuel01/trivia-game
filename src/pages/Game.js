import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../Component/Header';
import Timer from '../Component/Timer';
import {
  clearLocalStorage,
  getToken,
  updateRankig,
  getRanking,
} from '../services/services';
import {
  updateAssertionsNumber,
  updateScorePoints,
} from '../redux/actions/actions';
import './Game.css';

class Game extends Component {
  hasMounted = false;

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
      this.saveQuestions(results);
    } else {
      this.logout();
    }

    this.countDown();
    this.hasMounted = true;
  }

  componentWillUnmount() {
    this.hasMounted = false;
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

  saveQuestions = (results) => {
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
    const { updateScore, updateAssertions } = this.props;
    const { pointsBydifficulty, timer, currentQuestion: { difficulty } } = this.state;

    const SCORE_CONST = 10;
    const score = SCORE_CONST + (timer * pointsBydifficulty[difficulty]);

    updateScore(score);
    updateAssertions(1);
  }

  handleOnUserAnswer = (isTheCorrectAnswer) => {
    if (this.hasMounted) {
      if (isTheCorrectAnswer) this.calcScore();

      this.setState(({ indexQuestion }) => ({
        indexQuestion: indexQuestion + 1,
        answered: true,
      }));

      clearInterval(this.clock);
    }
  }

  goToNextQuestion = () => {
    const { indexQuestion, questions } = this.state;
    const { score, history, assertions } = this.props;
    const token = getToken();
    const ranking = getRanking();
    const userRanking = ranking[ranking.length - 1];

    this.setState({ timer: 30 });

    if (indexQuestion === questions.length) {
      updateRankig(score, assertions, userRanking);

      const redirectId = `/feedback/${token}`;
      history.push(redirectId);
    } else {
      this.setState(({ indexQuestion: index, questions: questionsArray }) => ({
        answered: false,
        currentQuestion: { ...questionsArray[index] },
      }));
      this.countDown();
    }
  }

  renderQuestion = () => {
    const { currentQuestion, answered } = this.state;
    const {
      category, correctAnswer, wrongAnswers, question, answers,
    } = currentQuestion;
    let wrongAnswerIndex = 0;

    return (
      <div className="buttonGame">
        <div data-testid="question-category">{ category }</div>
        <div data-testid="question-text">
          {
            question.replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&quot;/g, '"')
              .replace(/&#039;/g, '\'')
          }
        </div>
        <div data-testid="answer-options">
          {answers.map((option, index) => {
            if (option === wrongAnswers) wrongAnswerIndex += 1;

            const button = option === correctAnswer
              ? (
                <button
                  key={ index }
                  className={ answered ? 'buttonGameCorrect' : '' }
                  type="button"
                  data-testid="correct-answer"
                  disabled={ answered }
                  onClick={ () => this.handleOnUserAnswer(true, currentQuestion) }
                >
                  { option }
                </button>
              )
              : (
                <button
                  key={ index }
                  className={ answered ? 'buttonGameError' : '' }
                  type="button"
                  data-testid={ `wrong-answer-${wrongAnswerIndex}` }
                  disabled={ answered }
                  onClick={ () => this.handleOnUserAnswer(false, currentQuestion) }
                >
                  { option }
                </button>
              );

            return button;
          })}
        </div>
        {
          answered
            && (
              <div>
                <button
                  data-testid="btn-next"
                  type="button"
                  onClick={ this.goToNextQuestion }
                >
                  Next
                </button>
              </div>
            )
        }
      </div>
    );
  }

  render() {
    const { endRequisition, timer } = this.state;
    const { history } = this.props;
    return (
      <div>
        <Header
          history={ history }
        />
        <Timer countDown={ timer } />
        <section>
          {
            endRequisition && this.renderQuestion()
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
  updateAssertions: PropTypes.func.isRequired,
  score: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  score: state.player.score,
  name: state.player.name,
  assertions: state.player.assertions,
  token: state.player.token,
});

const mapDispatchToProps = (dispatch) => ({
  updateScore: (score) => dispatch(updateScorePoints(score)),
  updateAssertions:
    (numberOfAssertions) => dispatch(updateAssertionsNumber(numberOfAssertions)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);
