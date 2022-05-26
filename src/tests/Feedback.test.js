import React from "react";
import { renderWithRouterAndRedux } from './renderWithRouterAndRedux';
import { screen } from "@testing-library/react";
import Feedback from "../pages/Feedback";
import userEvent from "@testing-library/user-event";

describe('Testa a página de feedback', () => {
  it('Testa se a página é renderizada', () => {
    renderWithRouterAndRedux(<Feedback/>)
  });
})

/* describe('Testa a página de feedback', () => {
  

  it('Testa se o texto o nome do jogador é renderizado', () => {
    renderWithRouterAndRedux(<Feedback />)

    const playerTextEl = screen.getByRole('heading', { level: 2 });
    expect(playerTextEl).toBeInTheDocument();
  });

  it('Testa se o elemento de feedback é renderizado', () => {
    renderWithRouterAndRedux(<Feedback />)

    const feedBackEl = screen.getByTestId('feedback-text');
    expect(feedBackEl).toBeInTheDocument();
  });

  it('Testa se o botão "Ranking" é renderizado e leva até "/ranking"', () => {
    renderWithRouterAndRedux(<Feedback />);

    const buttonRankingEl = screen.getByRole('button', { name: 'Ranking' });
    expect(buttonRankingEl).toBeInTheDocument();

    userEvent.click(buttonRankingEl);
    const rankingHeadingEl = screen.getByRole('heading', { name: 'Ranking', level: 1});
    expect(rankingHeadingEl).toBeDefined();
  });

  it('Testa se o botão "Play Again" é renderizado e leva para "/"', () => {
    renderWithRouterAndRedux(<Feedback />)
    
    const buttonPlayAgainEl = screen.getByRole('button', { name: 'Play Again' });
    expect(buttonPlayAgainEl).toBeInTheDocument();

    userEvent.click(buttonPlayAgainEl);
    const loginHeaderEl = screen.getByRole('heading', { name: /login/i, level: 2 });
    expect(loginHeaderEl).toBeInTheDocument();
  });

  it('Testa se ao clicar em "Play", a página é redirecionada para /game', async () => {
    
    renderWithRouterAndRedux(<App />);

    
    const inputlUserEl = screen.getByRole('textbox', { name: 'Username' });
    const inputEmailEl = screen.getByRole('textbox', { name: 'E-mail' });
    const buttonEl = screen.getByRole('button', { name: 'Play' });
    expect(buttonEl).toBeDisabled();
    expect(inputlUserEl).toBeInTheDocument();
    expect(inputEmailEl).toBeInTheDocument();


    userEvent.type(inputlUserEl, 'usuário');
    userEvent.type(inputEmailEl, 'usuario@email.com');
    expect(buttonEl).not.toBeDisabled();

    userEvent.click(buttonEl);

    const setupHeaderEl = await screen.findByRole('heading', { level: 2 }, {timeout: 3000} );
    expect(setupHeaderEl).toBeInTheDocument();
  });
}); */