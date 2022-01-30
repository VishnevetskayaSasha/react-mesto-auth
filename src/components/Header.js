import logo from '../logo.svg';
import React from 'react';
import { Switch, Route, Link } from "react-router-dom";


function Header(props) {

  return (
    <header className="header header__page">
      <img src={logo} alt="Место логотип" className="header__logo"/>
      <nav className="header__menu">
      <Switch>
        <Route exact path="/">
          <p className="header__email">{props.userEmail}</p>
          <Link to='/sign-in' className="header__item" onClick={props.onSignOut}>Выйти</Link>         
        </Route>
        <Route exact path="/sign-in">
          <Link to="/sign-up" className="header__item">
            Регистрация
          </Link>
        </Route>
        <Route exact path="/sign-up">
          <Link to="/sign-in" className="header__item">
            Войти
          </Link>
        </Route>
      </Switch>
      </nav>
    </header>
  ) 
}

export default Header;


        