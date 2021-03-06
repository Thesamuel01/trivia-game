import React from "react";
import renderWithRouterAndRedux from "./helpers/renderWithRouterAndRedux";
import { screen, waitFor } from "@testing-library/react";
import App from '../App'
import Login from "../pages/Login";
import userEvent from "@testing-library/user-event";
import * as storageLocal from "../services/services";

describe('Testa a página de login', () => {
  it('Testa se a página é renderizada', () => {
    renderWithRouterAndRedux(<App/>)
  });

  it('Testa se o texto "Login" é renderizado', () => {
    renderWithRouterAndRedux(<Login />)

    const loginTextEl = screen.getByRole('heading', { name:'Login', level: 2 });
    expect(loginTextEl).toBeInTheDocument();
  });

  it('Testa se o botão está desabilitado ao ser renderizado', () => {
    renderWithRouterAndRedux(<App />)

    const buttonPlayEl = screen.getByRole('button', { name: 'Play' });
    expect(buttonPlayEl).toBeInTheDocument();
    expect(buttonPlayEl).toBeDisabled();
  });

  it('Testa se o botão é habilitado após os inputs serem preenchidos', () => {
    renderWithRouterAndRedux(<App />);

    const buttonEl = screen.getByRole('button', { name: 'Play' });
    expect(buttonEl).toBeInTheDocument();
    expect(buttonEl).toBeDisabled();

    const inputlUserEl = screen.getByRole('textbox', { name: 'Username' });
    expect(inputlUserEl).toBeInTheDocument();

    const inputEmailEl = screen.getByRole('textbox', { name: 'E-mail' });
    expect(inputEmailEl).toBeInTheDocument();

    userEvent.type(inputlUserEl, 'usuário');
    userEvent.type(inputEmailEl, 'usuario@email.com');
    expect(buttonEl).toBeEnabled();

  });

  it('Testa se ao clicar em "configurações", a página é redirecionada para /setup', () => {
    renderWithRouterAndRedux(<App />)
    
    const buttonSetupEl = screen.getByRole('button', { name: 'configurações' });
    expect(buttonSetupEl).toBeInTheDocument();

    userEvent.click(buttonSetupEl);
    const setupHeaderEl = screen.getByRole('heading', { name: /config/i, level: 1 });
    expect(setupHeaderEl).toBeInTheDocument();
  });

  it('Testa se ao clicar em "Play", salva as informacoes no Local Storage', async () => {
    const addRanking = jest.spyOn(storageLocal, 'addRanking');
    const createToken = jest.spyOn(storageLocal, 'createToken');
  
    const { history } = renderWithRouterAndRedux(<App />);
      
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
    
    await waitFor(
      () => expect(history.location.pathname).toBe('/game'),
      { timeout: 3000 }
    );
  
    expect(addRanking).toBeCalled();
    expect(createToken).toBeCalled();
  })

  it('Testa se ao clicar em "Play", a página é redirecionada para /game', async () => {
    const spy = jest.spyOn(storageLocal, 'addRanking');
  
    const { history } = renderWithRouterAndRedux(<App />);
      
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
    
    await waitFor(
      () => expect(history.location.pathname).toBe('/game'),
      { timeout: 3000 }
    );
  
    const setupHeaderEl = await screen.findByRole('heading', { level: 2 }, {timeout: 3000} );
    expect(setupHeaderEl).toBeInTheDocument();
  });
});
