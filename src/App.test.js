import React from 'react';
import {
  render
} from '@testing-library/react';
import {
  App
} from './App.jsx';
import assert from 'assert';

describe('Tests App', () => {
  test('renders menu', () => {
    const {
      getByText,
      container
    } = render( < App / > );
    const linkElementInicial = getByText(/Inicial/i);
    const linkElementCarrinho = getByText(/Carrinho/i);
    const linkElementAjuda = getByText(/Ajuda/i);
    const h2=container.querySelector('h2');
    expect(linkElementInicial).toBeInTheDocument();
    expect(linkElementCarrinho).toBeInTheDocument();
    expect(linkElementAjuda).toBeInTheDocument();
    assert.equal(h2.firstChild.nodeValue, "Bem Vindo ao nosso catalogo");
  });
})
