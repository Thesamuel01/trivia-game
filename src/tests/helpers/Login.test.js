import React from "react";
import { renderWithRouterAndRedux } from './renderWithRouterAndRedux';
import { screen } from "@testing-library/react";
import App from '../../App'
import Login from "../../pages/Login";

describe('Testa a página de login', () => {
  it('Testa se a página é renderizada', () => {
    renderWithRouterAndRedux(<App/>)
  });

  it('Testa se o texto Username é renderizado', () => {
    renderWithRouterAndRedux(<Login />)

    const labelUserEl = screen.getByRole('label', { name: 'Username' });
    console.log(labelUserEl);
  })
})
