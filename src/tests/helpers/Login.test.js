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

  it('Testa se o input Username é renderizado', () => {
    renderWithRouterAndRedux(<Login />)

    const inputlUserEl = screen.getByRole('textbox', { name: 'Username' });
    expect(inputlUserEl).toBeInTheDocument();
  });

  /*  */
  // preciso fazer dois testes separados ou posso juntá-los em um?
  /*  */
  
  it('Testa se o input Email é renderizado', () => {
    renderWithRouterAndRedux(<Login />)

    const inputEmailEl = screen.getByRole('textbox', { name: 'E-mail' });
    expect(inputEmailEl).toBeInTheDocument();
  });

  it('Testa se o botão está desabilitado ao ser renderizado', () => {
    renderWithRouterAndRedux(<Login />)

    const buttonPlayEl = screen.getByRole('button', { name: 'Play' });
    expect(buttonPlayEl).toBeInTheDocument();
    expect(buttonPlayEl).toBeDisabled();
  });

  /* it('Testa se o botão é habilitado após os inputs serem preenchidos', () => {
    renderWithRouterAndRedux(<Login />)

    const buttonEl = screen.getByRole('button', { name: 'Play' });
    expect(buttonEl).toBeInTheDocument();
    expect(buttonEl).toBeDisabled();

    const inputlUserEl = screen.getByRole('textbox', { name: 'Username' });
    expect(inputlUserEl).toBeInTheDocument();

    const inputEmailEl = screen.getByRole('textbox', { name: 'E-mail' });
    expect(inputEmailEl).toBeInTheDocument();

    userEvent.type(inputlUserEl);
    userEvent.type(inputEmailEl);
    expect(buttonEl).toBeEnabled();
  }); */

  it('Testa se o botão "configurações" é renderizado', () => {
    renderWithRouterAndRedux(<Login />)

    const buttonSetupEl = screen.getByRole('button', { name: 'configurações' });
    expect(buttonSetupEl).toBeInTheDocument();
  });

  it('Testa se o botão "configurações" é renderizado', () => {
    const { history } = renderWithRouterAndRedux(<Login />)

    history.push('/setup');
    const buttonSetupEl = screen.getByRole('button', { name: 'configurações' });
    expect(buttonSetupEl).toBeInTheDocument();

    userEvent.click(buttonSetupEl);
    const setupHeaderEl = screen.getByRole('heading', { name: /config/i, level: 1 });
    expect(setupHeaderEl).toBeInTheDocument();
  });

})
