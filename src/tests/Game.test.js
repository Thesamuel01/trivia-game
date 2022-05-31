import React from "react";
import renderWithRouterAndRedux from "./helpers/renderWithRouterAndRedux";
import { screen, waitFor } from "@testing-library/react";
import App from '../App';
import { addRanking, createToken } from "../services/services";
import { FIRST_MATCH, NEW_QUESTIONS, PLAYER_INFOS, QUESTIONS, TOKEN } from "./mocks";
import * as storageLocal from "../services/services";
import userEvent from "@testing-library/user-event";

describe('Testa o direcionamento para a página de Game', () => {
  beforeEach(() => {
    const player = FIRST_MATCH;

    addRanking(player);
    createToken(TOKEN);
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('Testa se ao clicar no botão play, a página de Games é renderizada', async () => {
    const playerName = RegExp(FIRST_MATCH.name, 'i') ;

    const { history } = renderWithRouterAndRedux(<App/>);
    history.push('/game');

    const setupHeaderEl = await screen.findByRole('heading', { level: 2, name: playerName });
    expect(setupHeaderEl).toBeInTheDocument();
  });

  it('Testa se ao passar um token inválido é feito o logout', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ response_code:3, results:[] })
    });

    const logout = jest.spyOn(storageLocal, 'clearLocalStorage');
    const { history } = renderWithRouterAndRedux(<App/>, undefined, '/game');

    await waitFor(
      () => expect(history.location.pathname).toBe('/game'),
      { timeout: 3000 }
    );

    expect(logout).toBeCalled()
    expect(history.location.pathname).toBe('/');
  })
})

describe('Testa se a página Game renderiza as informações corretas', () => {
  beforeEach(() => {
    const player = FIRST_MATCH;

    addRanking(player);
    createToken(TOKEN);

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ response_code: 0, results:[...QUESTIONS] })
    });
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('Testa se a primeira pergunta é renderizada na tela', async () => {
    const firstQuestion = QUESTIONS[0].question;
    const { history } = renderWithRouterAndRedux(<App/>, undefined, '/game');

    await waitFor(
      () => expect(history.location.pathname).toBe('/game'),
      { timeout: 3000 }
    );

    expect(screen.getByText(firstQuestion)).toBeInTheDocument();    
  })

  it('Testa se as alternativas da pergunta são renderizada na tela', async () => {
    const correctAnswer = QUESTIONS[0].correct_answer;
    const wrongAnswers = QUESTIONS[0].incorrect_answers;
    const { history } = renderWithRouterAndRedux(<App/>, undefined, '/game');

    await waitFor(
      () => expect(history.location.pathname).toBe('/game'),
      { timeout: 3000 }
    );

    expect(screen.getByText(correctAnswer)).toBeInTheDocument();
    wrongAnswers.forEach((question) => expect(screen.getByText(question)).toBeInTheDocument())
  })

  it('Testa se ao acertar a questão os pontos são atualizados', async () => {
    const correctAnswer = QUESTIONS[0].correct_answer;
    const { history } = renderWithRouterAndRedux(<App/>, undefined, '/game');

    await waitFor(
      () => expect(history.location.pathname).toBe('/game'),
      { timeout: 3000 }
    );

    userEvent.click(screen.getByRole('button', { name: correctAnswer}))
    expect(screen.getByText(/score/i)).toBeInTheDocument();
    expect(screen.getByText(/score/i)).toHaveTextContent('Score: 40');
  })

  it('Testa se ao errar a questão os pontos não são atualizados', async () => {
    const wrongAnswer = QUESTIONS[0].incorrect_answers[0];
    const { history } = renderWithRouterAndRedux(<App/>, undefined, '/game');

    await waitFor(
      () => expect(history.location.pathname).toBe('/game'),
      { timeout: 3000 }
    );

    userEvent.click(screen.getByRole('button', { name: wrongAnswer}))
    expect(screen.getByText(/score/i)).toBeInTheDocument();
    expect(screen.getByText(/score/i)).toHaveTextContent('Score: 0');
  })

  it('Testa se ao clicar no botão next é renderizado a próxima questão', async () => {
    const secondQuestion = QUESTIONS[1].question;
    const userAnswer = QUESTIONS[0].correct_answer;
    const { history } = renderWithRouterAndRedux(<App/>, undefined, '/game');

    await waitFor(
      () => expect(history.location.pathname).toBe('/game'),
      { timeout: 3000 }
    );

    userEvent.click(screen.getByRole('button', { name: userAnswer}))    
    userEvent.click(screen.getByRole('button', { name: /next/i }))

    expect(screen.getByText(secondQuestion)).toBeInTheDocument(); 
  })

  it('Testa se ao responder a questão e clicar no botão next é reiniciado a contagem', async () => {
    const userAnswer = QUESTIONS[0].correct_answer;
    const { history } = renderWithRouterAndRedux(<App/>, undefined, '/game');
    global.clearInterval = jest.fn();

    await waitFor(
      () => expect(history.location.pathname).toBe('/game'),
      { timeout: 3000 }
    );

    userEvent.click(screen.getByRole('button', { name: userAnswer}))    
    userEvent.click(screen.getByRole('button', { name: /next/i }))

    expect(clearInterval).toBeCalled();
    expect(screen.getByText('Timer: 30')).toBeInTheDocument();
  })

  it('Testa se o temporizador esgotar desabilita as respostas e habilita para a próxima questão', async () => {
    const { history } = renderWithRouterAndRedux(<App/>, undefined, '/game');
    global.clearInterval = jest.fn();

    await waitFor(
      () => expect(history.location.pathname).toBe('/game'),
      { timeout: 3000 }
    );

    await waitFor(
      () => expect(screen.getByText('Timer: 0')).toBeInTheDocument(),
      { timeout: 30000 }
    );
    
    const answersButtons = screen.getAllByRole('button');
    expect(answersButtons[0]).toBeDisabled();
    expect(answersButtons[1]).toBeDisabled();
    expect(answersButtons[2]).toBeDisabled();
    expect(answersButtons[3]).toBeDisabled();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  })
});

describe('Testa o direcionamento da página de Game para a página de Feedback', () => {
  it('Testa ao acabar as 5 perguntas o botão "Next" direciona para a feedback', async () => {
    addRanking(FIRST_MATCH);
    createToken(TOKEN);

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ response_code: 0, results: [...QUESTIONS] })
    });

    const { history } = renderWithRouterAndRedux(<App/>, undefined, `/game`);
    history.push('/game');

    await waitFor(
      () => expect(history.location.pathname).toBe('/game'),
      { timeout: 3000 }
    );

    QUESTIONS.forEach(({ correct_answer: userAnswer }) => {
      userEvent.click(screen.getByText(userAnswer));
      userEvent.click(screen.getByRole('button', { name: /next/i }))
    })

    expect(history.location.pathname).toBe(`/feedback/${TOKEN}`)
  })

  it('Testa ao voltar da página de feedback as informações são zeradas e recomeça o jogo com novas questões', async () => {
    addRanking(PLAYER_INFOS);
    createToken(TOKEN);
    const spy = jest.spyOn(storageLocal, 'updateRankig')

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ response_code: 0, results: [...NEW_QUESTIONS] })
    });

    const currentRanking = {
      id: '2ec0f11f629858f539559e8cfbb5f1f7',
      name: 'player',
      assertions: 3,
      score: 180,
      picture: 'https://www.gravatar.com/avatar/cd275610e6fd3a48b4884a792785815e',
      gotRefresh: true,
    }

    const oldFirstQuestion = QUESTIONS[0].question;
    const newFirstQuestion = NEW_QUESTIONS[0].question;
    const { history } = renderWithRouterAndRedux(<App/>, undefined, `/feedback/${TOKEN}`);
    history.push('/game');

    await waitFor(
      () => expect(history.location.pathname).toBe('/game'),
      { timeout: 3000 }
    );

    expect(spy).toBeCalled();
    expect(spy).toHaveBeenCalledWith(0, 0, currentRanking);
    expect(oldFirstQuestion).not.toBe(newFirstQuestion);
    expect(screen.getByText(newFirstQuestion)).toBeInTheDocument();
  })
});