import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { BsArrowRight } from 'react-icons/bs';
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
        <div
          className="questionCategory"
          data-testid="question-category"
        >
          { category }

        </div>
        <div className="questionText" data-testid="question-text">
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
                  id="button1"
                  className={ answered ? 'buttonGameCorrect' : 'questionButton' }
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
                  className={ answered ? 'buttonGameError' : 'questionButton' }
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
                  className="questionNextButton"
                  data-testid="btn-next"
                  type="button"
                  onClick={ goToNextQuestion }
                >
                  <BsArrowRight style={ { color: 'whitesmoke' } } />
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
