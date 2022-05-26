import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../Component/Header';
import { clearLocalStorage, getToken, saveScore } from '../services/services';
import { updateScorePoints } from '../redux/actions/actions';
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
      this.saveQuestions(results);
    } else {
      this.logout();
    }
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
    const { updateScore } = this.props;
    const { pointsBydifficulty, timer, currentQuestion: { difficulty } } = this.state;

    const SCORE_CONST = 10;
    const score = SCORE_CONST + (timer * pointsBydifficulty[difficulty]);

    updateScore(score);
  }

  handleOnUserAnswer = (isTheCorrectAnswer) => {
    if (isTheCorrectAnswer) this.calcScore();

    this.setState(({ indexQuestion }) => ({
      indexQuestion: indexQuestion + 1,
      answered: true,
    }));
  }

  goToNextQuestion = () => {
    const { indexQuestion, questions } = this.state;
    const { score } = this.props;

    if (indexQuestion === questions.length - 1) {
      saveScore(score);
      /*
        FAZER O PUSH PARA A PAGINA DE FEEDBACK AQUI!!!!!!!!!!!!!
        FAZER O PUSH PARA A PAGINA DE FEEDBACK AQUI!!!!!!!!!!!!!
        FAZER O PUSH PARA A PAGINA DE FEEDBACK AQUI!!!!!!!!!!!!!
        FAZER O PUSH PARA A PAGINA DE FEEDBACK AQUI!!!!!!!!!!!!!
        FAZER O PUSH PARA A PAGINA DE FEEDBACK AQUI!!!!!!!!!!!!!
        FAZER O PUSH PARA A PAGINA DE FEEDBACK AQUI!!!!!!!!!!!!!
        FAZER O PUSH PARA A PAGINA DE FEEDBACK AQUI!!!!!!!!!!!!!
        FAZER O PUSH PARA A PAGINA DE FEEDBACK AQUI!!!!!!!!!!!!!
      */
    } else {
      this.setState(({ indexQuestion: index, questions: questionsArray }) => ({
        answered: false,
        currentQuestion: { ...questionsArray[index] },
      }));
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
        <div data-testid="question-text">{ question }</div>
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
    const { endRequisition } = this.state;

    return (
      <div>
        <Header />
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
  score: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  store: state.player.score,
});

const mapDispatchToProps = (dispatch) => ({
  updateScore: (score) => dispatch(updateScorePoints(score)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);
