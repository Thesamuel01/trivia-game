import React from "react";
import { screen } from "@testing-library/react";
import App from '../App'
import { addRanking, createToken } from "../services/services";
import { PLAYER_INFOS, TOKEN } from "./mocks";
import renderWithRouterAndRedux from "./helpers/renderWithRouterAndRedux";
import userEvent from "@testing-library/user-event";

describe('Testa a página de feedback', () => {
  it('Testa se a página é renderizada', () => {
    const player = PLAYER_INFOS;
    addRanking(player);
    createToken(TOKEN);
  
    const { history } = renderWithRouterAndRedux(<App/>);
    history.push(`/feedback/${TOKEN}`)

    const playerTextEl = screen.getByRole('heading', { level: 2 });
    expect(playerTextEl).toBeInTheDocument();
  });
});

describe('Testa a página de feedback', () => {
  beforeEach(() => {
    const player = PLAYER_INFOS;
    addRanking(player);
    createToken(TOKEN);
  
    const { history } = renderWithRouterAndRedux(<App/>);
    history.push(`/feedback/${TOKEN}`);
  });

  afterEach(() => localStorage.clear());

  it('Testa se o texto o nome do jogador é renderizado', () => {
    const playerTextEl = screen.getByRole('heading', { level: 2 });
    expect(playerTextEl).toBeInTheDocument();
  });

  it('Testa se o elemento de feedback é renderizado', () => {
    const feedBackEl = screen.getByTestId('feedback-text');
    expect(feedBackEl).toBeInTheDocument();
  });

  it('Testa se o botão "Ranking" é renderizado e leva até "/ranking"', () => {
    const buttonRankingEl = screen.getByRole('button', { name: 'Ranking' });
    expect(buttonRankingEl).toBeInTheDocument();

    userEvent.click(buttonRankingEl);
    const rankingHeadingEl = screen.getByRole('heading', { name: 'Ranking', level: 1});
    expect(rankingHeadingEl).toBeDefined();
  });

  it('Testa se o botão "Play Again" é renderizado e leva para "/"', () => { 
    const buttonPlayAgainEl = screen.getByRole('button', { name: 'Play Again' });
    expect(buttonPlayAgainEl).toBeInTheDocument();

    userEvent.click(buttonPlayAgainEl);
    const loginHeaderEl = screen.getByRole('heading', { name: /login/i, level: 2 });
    expect(loginHeaderEl).toBeInTheDocument();
  });
});