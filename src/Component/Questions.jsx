import PropTypes from 'prop-types';
import React, { Component } from 'react';
/*
COMPONENTE RESPONSAVEL PELAS QUESTOES!!!
*/
class Questions extends Component {
  formatString = (string) => string.replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, '\'');

  render() {
    const {
      currentQuestion,
      currentQuestion: { category, correctAnswer, wrongAnswers, question, answers },
      answered,
      handleOnUserAnswer,
      goToNextQuestion,
    } = this.props;
    let wrongAnswerIndex = 0;

    return (
      <div className="buttonGame">
        <div data-testid="question-category">{ category }</div>
        <div data-testid="question-text">
          {
            this.formatString(question)
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
                  onClick={ () => handleOnUserAnswer(true, currentQuestion) }
                >
                  { this.formatString(option) }
                </button>
              )
              : (
                <button
                  key={ index }
                  className={ answered ? 'buttonGameError' : '' }
                  type="button"
                  data-testid={ `wrong-answer-${wrongAnswerIndex}` }
                  disabled={ answered }
                  onClick={ () => handleOnUserAnswer(false, currentQuestion) }
                >
                  { this.formatString(option) }
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
                  onClick={ goToNextQuestion }
                >
                  Next
                </button>
              </div>
            )
        }
      </div>
    );
  }
}

Questions.propTypes = {
  currentQuestion: PropTypes.shape({
    category: PropTypes.string.isRequired,
    correctAnswer: PropTypes.string.isRequired,
    wrongAnswers: PropTypes.arrayOf(PropTypes.string).isRequired,
    question: PropTypes.string.isRequired,
    answers: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  answered: PropTypes.bool.isRequired,
  handleOnUserAnswer: PropTypes.func.isRequired,
  goToNextQuestion: PropTypes.func.isRequired,
};

export default Questions;
