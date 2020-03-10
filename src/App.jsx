import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";

export const App = () => {

  return (
    <Router>
      <div>
        <nav className="menu">
          <ul>
            <li className="item-color-1">
              <Link to="/">Inicial</Link>
            </li>
            <li className="item-color-2">
              <Link to="/cart">Carrinho</Link>
            </li>
            <li className="item-color-3">
              <Link to="/help">Ajuda</Link>
            </li>
          </ul>
        </nav>
        <div className="container">
          <Switch>
            <Route path="/product/:id" children={<Details />}></Route>
            <Route path="/cart" ><Cart /></Route>
            <Route path="/help" ><Help /></Route>
            <Route path="/"><Home /></Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}
const Home = (props) => {
  let [booksData, setBooksData] = useState({});
  let [idsCart, setIdsCart] = useState([]);
  const setIdsCartCb = (res) => {
    setIdsCart(Object.keys(res));
  };
  // componentDidMount
  useEffect(() => {
    setIdsCart(Object.keys(getCart()));
    axios
      .get(
        "http://localhost:3000/api/livros"
      )
      .then(({ data }) => {
        setBooksData(data);
      });
  }, []);
  let index = 1;
  return (
    <div>
      <h2>Bem Vindo ao nosso catalogo</h2>
      <section className="grid">
        {
          booksData && booksData.length ? booksData.map(
            (lv, i) => {
              if (index === 5) {
                index = 1;
              } else {
                index++;
              }
              return (
                <div key={`item-color${lv.id}`} className={"item-color-t" + index}>
                  <div><Link className="title" to={`/product/${lv.id}`}>{lv.name}</Link></div>
                  <div><img alt={lv.name} src={lv.image} /></div>
                  <div>{lv.unit} {lv.price.toFixed(2)}</div>
                  <div className="actions">
                    {
                      isOnCart(lv, idsCart) ?
                        (<button title="Adicionar ao carrinho" className="btn add" onClick={addToCart(lv, setIdsCartCb)}>Adicionar</button>) :
                        (<button title="Remover do carrinho" className="btn remove" onClick={removeFromCart(lv, setIdsCartCb)}>Adicionado</button>)
                    }
                  </div>
                </div>
              );
            }
          )
            : ('')
        }
      </section>
    </div>
  );
}
const Details = () => {
  const { id } = useParams();
  const [bookData, setBookData] = useState({});
  const [idsCart, setIdsCart] = useState([]);
  const setIdsCartCb = (res) => {
    console.log(res);
    setIdsCart(Object.keys(res));
  };

  useEffect(() => {
    setIdsCart(Object.keys(getCart()));
    axios.get(`http://localhost:3000/api/livros/${id}`)
      .then(({ data }) => {
        setBookData(data);
      });
  }, [id]);

  return (
    <div>
      <Link title="Voltar para a inicial" className="back" to={`/`}>Voltar</Link>
      <div>
        <div className="wrapper">
          <div className="box sidebar">
            <img alt={bookData.name} src={bookData.image} />
          </div>
          <div className="box content">
            <h3>{bookData.name}</h3>
            <p>ID: {id}</p>
            <p>Autor: {bookData.autor}</p>
            <p>Preco: {bookData.unit} {bookData.price}</p>
            <p>Categoria: {bookData.category}</p>
            <p>Sinopse: {bookData.sinopse}</p>
            <p>Sobre o Autor: {bookData.about_author}</p>
            <p>
              {
                isOnCart(bookData, idsCart) ?
                  (<button className="btn add" onClick={addToCart(bookData, setIdsCartCb)}>Adicionar</button>) :
                  (<button className="btn remove" onClick={removeFromCart(bookData, setIdsCartCb)}>Adicionado</button>)
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
const Cart = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(getCart());
  }, [])

  return (
    <div>
      <h2>Carrinho: </h2>
      <div>{
        Object.keys(products).length > 0 ?
          (
            <div className="produt-list">
              {
                Object.keys(products).map(p => (
                  <div className="product-item" key={`product-${p}`}>
                    <div className="image-container">
                      <img alt={`Product ${p}`} src={products[p].image} />
                    </div>
                    <div className="description">
                      <div className="name">{products[p].name}</div>
                      <div className="price">{products[p].unit} {products[p].price.toFixed(2)}</div>
                      <div><button onClick={removeFromCart(products[p], setProducts)}>&#215;</button></div>
                    </div>
                  </div>
                ))
              }
              <div>Subtotal  {Object.keys(products).map(p => products[p].price).reduce((accumulator, v) => accumulator + v).toFixed(2)}</div>
            </div>
          ) :
          ('Nao existe compras em seu carrinho')
      }</div>
    </div>
  );
}
const Help = () => {
  return (<div>
    <h2>Lorem Ipsum Dolor Sit amet</h2>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Proin eu tellus id nunc pulvinar vehicula eget quis ex.
      Pellentesque accumsan faucibus mauris, sed semper nulla sollicitudin ut.
      Duis at velit sem. Praesent accumsan tellus sit amet justo volutpat, in semper enim consectetur.
      Pellentesque et eros eget turpis elementum tempus a quis leo. Sed rhoncus ipsum non laoreet tincidunt.
    </p>
  </div>);
}
const getCart = () => {
  const items = localStorage.getItem('cart');
  try {
    const cart = JSON.parse(items);
    return cart ? cart : {};
  } catch (e) {
    return {}
  }
}

const addToCart = (item, cb) => {
  return (ev) => {
    let cart = getCart();
    cart[item.id] = item;
    cb(cart);
    localStorage.setItem('cart', JSON.stringify(cart));
  }
}

const removeFromCart = (item, cb) => {
  return (ev) => {
    let cart = getCart();
    delete cart[item.id];
    cb(cart);
    localStorage.setItem('cart', JSON.stringify(cart));
  }
}

const isOnCart = (item, ids) => {
  // se esta no carrinho remover|add carrinho
  return item && item.id && Array.isArray(ids) && ids.indexOf(item.id.toString()) !== -1 ? false : true;
}
