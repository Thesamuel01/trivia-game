import React from "react";
import renderWithRouterAndRedux from "./helpers/renderWithRouterAndRedux";
import { screen, waitFor } from "@testing-library/react";
import App from '../App';

describe('Testa a página de NotFound', () => {
  it('Testa se colocar uma URL inválida, é direcionado para a página NotFound', async () => {
    const { history } = renderWithRouterAndRedux(<App/>);

    history.push('/pagina-invalida')

    await waitFor(
        () => expect(history.location.pathname).toBe('/pagina-invalida'),
        { timeout: 3000 }
      );

    expect(screen.getByText('Sorry!')).toBeInTheDocument();
    expect(screen.getByText('Page not Found')).toBeInTheDocument();
  });
})
