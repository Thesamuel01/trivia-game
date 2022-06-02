import React from "react";
import renderWithRouterAndRedux from "./helpers/renderWithRouterAndRedux";
import { screen, waitFor } from "@testing-library/react";
import { PLAYER_INFOS } from "./mocks";
import App from '../App'
import userEvent from "@testing-library/user-event";
import * as storageLocal from "../services/services";

describe('Testa a página de classificação', () => {
  it ('Testa se o botão "Home" leva para a página inicial', () => {
    const { history } = renderWithRouterAndRedux(<App />)
    history.push('/ranking')

    const btnHomeEl = screen.getByRole('button', { name: /home/i });
    expect(btnHomeEl).toBeDefined();

    userEvent.click(btnHomeEl)
    const headerLoginEl = screen.getByRole('heading', { name: /login/i, level: 2 });
    expect(headerLoginEl).toBeDefined();
  });

  it ('Testa se a classificação dos jogadores é renderizada na tela', () => {
    const mock = PLAYER_INFOS;
    const getRanking = jest.spyOn(storageLocal, 'getRanking');
   
    const { history } = renderWithRouterAndRedux(<App />)
    history.push('/ranking')

    const playerNameEl = screen.getByRole('heading', { name: 'Ranking', level: 1 })

    expect(getRanking).toBeCalled();
    expect(playerNameEl).toBeDefined();
  });
});