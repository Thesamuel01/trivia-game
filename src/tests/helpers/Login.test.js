import React from "react";
import { renderWithRouterAndRedux } from './renderWithRouterAndRedux';
import { screen } from "@testing-library/react";
import App from '../../App'
import Login from "../../pages/Login";
import userEvent from "@testing-library/user-event";

describe('Testa a página de login', () => {
  it('Testa se a página é renderizada', () => {
    renderWithRouterAndRedux(<App/>)
  });

  it('Testa se o texto "Login" é renderizado', () => {
    renderWithRouterAndRedux(<Login />)

    const loginTextEl = screen.getByText('Login');
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

  it('Testa se ao clicar em "Play", a página é redirecionada para /game', async () => {
    renderWithRouterAndRedux(<App />);

    const buttonEl = screen.getByRole('button', { name: 'Play' });
    expect(buttonEl).toBeInTheDocument();

    userEvent.click(buttonEl);

    const setupHeaderEl = screen.findByRole('heading', { level: 2 });
    expect(setupHeaderEl).toBeInTheDocument();
  });

  it('Testa se ao clicar em "configurações", a página é redirecionada para /setup', () => {
    renderWithRouterAndRedux(<App />)
    
    const buttonSetupEl = screen.getByRole('button', { name: 'configurações' });
    expect(buttonSetupEl).toBeInTheDocument();

    userEvent.click(buttonSetupEl);
    const setupHeaderEl = screen.getByRole('heading', { name: /config/i, level: 1 });
    expect(setupHeaderEl).toBeInTheDocument();
  });

});
