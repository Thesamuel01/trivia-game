import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from '../Component/Header';
import * as storageLocal from '../services/services';
import './Game.css';

class Game extends Component {
  constructor() {
    super();

    this.state = {
      questions: [],
      endRequisition: false,
      questionNumber: 0,
      chooseAnOption: false,
      isButtonDisable: false,
    };
  }

  componentDidMount() {
    this.getQuestion();
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
      endRequisition: true,
    });
  }

  logout = () => {
    const { history } = this.props;

    storageLocal.logout();
    history.push('/');
  }

  getQuestion = async () => {
    const token = storageLocal.getToken();
    const url = `https://opentdb.com/api.php?amount=5&token=${token}`;
    const response = await fetch(url);
    const { response_code: code, results } = await response.json();

    if (code === 0) {
      this.saveQuestions(results);
    } else {
      this.logout();
    }
  }

  chooseAnAnswer = () => {
    this.setState({
      chooseAnOption: true,
      isButtonDisable: true,
    });
  }

  renderQuestion = () => {
    const { questionNumber, questions, chooseAnOption, isButtonDisable } = this.state;
    const {
      category, correctAnswer, wrongAnswers, question, answers,
    } = questions[questionNumber];
    let wrongAnswerIndex = 0;

    return (
      <div className="buttonGame">
        <div data-testid="question-category">{ category }</div>
        <div data-testid="question-text">{ question }</div>
        <div data-testid="answer-options">
          {answers.map((option, index) => {
            wrongAnswerIndex = option === wrongAnswers
              ? wrongAnswerIndex += 1 : wrongAnswerIndex;
            const button = option === correctAnswer
              ? (
                <button
                  key={ index }
                  className={ chooseAnOption ? 'buttonGameCorrect' : '' }
                  type="button"
                  data-testid="correct-answer"
                  disabled={ isButtonDisable }
                  onClick={ this.chooseAnAnswer }
                >
                  { option }
                </button>
              )
              : (
                <button
                  key={ index }
                  className={ chooseAnOption ? 'buttonGameError' : '' }
                  type="button"
                  data-testid={ `wrong-answer-${wrongAnswerIndex}` }
                  disabled={ isButtonDisable }
                  onClick={ this.chooseAnAnswer }
                >
                  { option }
                </button>
              );

            return button;
          })}
        </div>
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
};

export default Game;
