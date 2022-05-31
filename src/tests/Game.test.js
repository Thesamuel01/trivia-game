import React from "react";
import renderWithRouterAndRedux from "./helpers/renderWithRouterAndRedux";
import { screen, waitFor } from "@testing-library/react";
import App from '../App';
import { addRanking, createToken } from "../services/services";
import { INVALID_TOKEN, PLAYER_INFOS, QUESTIONS, TOKEN } from "./mocks";
import * as storageLocal from "../services/services";
import userEvent from "@testing-library/user-event";
import Game from "../pages/Game";

describe('Testa a página de Game', () => {
  beforeEach(() => {
    const player = PLAYER_INFOS;

    addRanking(player);
    createToken(TOKEN);
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('Testa se ao clicar no botão play, a página de Games é renderizada', async () => {
    const playerName = RegExp(PLAYER_INFOS.name, 'i') ;

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

  it('Testa se a primeira pergunta é renderizada na tela', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ response_code: 0, results:[...QUESTIONS] })
    });

    const firstQuestion = QUESTIONS[0].question;
    const { history } = renderWithRouterAndRedux(<App/>, undefined, '/game');

    await waitFor(
      () => expect(history.location.pathname).toBe('/game'),
      { timeout: 3000 }
    );

    expect(screen.getByText(firstQuestion)).toBeInTheDocument();    
  })

  it('Testa se as alternativas da pergunta são renderizada na tela', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ response_code: 0, results:[...QUESTIONS] })
    });

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
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ response_code: 0, results:[...QUESTIONS] })
    });

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

  it('Testa se ao clicar no botão next é renderizado a próxima questão', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ response_code: 0, results:[...QUESTIONS] })
    });

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
})