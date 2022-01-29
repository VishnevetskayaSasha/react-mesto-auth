import logo from '../logo.svg';
import React from 'react';
import {Link, useLocation} from "react-router-dom";

function Header(props) {


  const location = useLocation();
  const locationSignIn = location.pathname === "/sign-in"; //регистрация пользователя.

  //выход из системы
  function handleSignOut() {
    props.onSignOut();
  }

  // вход в систему
  function handleSignIn() {
    
  }

  return (
    <header className="header header__page">
      <img src={logo} alt="Место логотип" className="header__logo"/>
      <nav className="header__menu">
        <p className="header__email">{props.isLogOn ? props.userEmail : "" }</p> 
        {!locationSignIn ?
        <Link onClick={!props.isLogOn ? handleSignIn : handleSignOut} className="header__item" to={"/sign-in"}>{props.isLogOn ? "Выйти" : "Войти"}</Link>
        :
        <Link className="header__item" to={"/sign-up"}>{!props.isLogOn ? "Регистрация" : ""}</Link>
        }
        </nav>
    </header>
  ) 
}

export default Header;
