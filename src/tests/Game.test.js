import React from "react";
import renderWithRouterAndRedux from "./helpers/renderWithRouterAndRedux";
import { screen } from "@testing-library/react";
import App from '../App';
import { addRanking, createToken } from "../services/services";
import { PLAYER_INFOS, TOKEN } from "./mocks";

describe('Testa a página de Game', () => {
  it('Testa se ao clicar no botão play, a página de Games é renderizada', async () => {
    const player = PLAYER_INFOS;
    addRanking(player);
    createToken(TOKEN);

    renderWithRouterAndRedux(<App/>, [], '/game');

    const setupHeaderEl = await screen.findByRole('heading', { level: 2 });
    expect(setupHeaderEl).toBeInTheDocument();
  });

  
})