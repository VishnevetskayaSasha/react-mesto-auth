import React from 'react';
import { Link, useLocation} from "react-router-dom";

function WindowWithRegistrationAndLogin(props){

 
  const location = useLocation();
  const locationSignUp = location.pathname === "/sign-up"; // авторизация пользователя. 
  const [ values, setValues ] = React.useState({});
    
    function handleChange(evt) {
        const {name, value} = evt.target;
        setValues({...values, [name]: value });
    }

    function handleSubmit(evt) {
        evt.preventDefault();
        props.onSubmit({email: values.email, password: values.password})
    } 

  return (
    <div className="welcome">
      <h1 className="welcome__title">{props.title}</h1>
      <form className="welcome__form" name={`${props.name}`} onSubmit={handleSubmit} >
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          className="welcome__input" 
          required  
          minLength="2" 
          maxLength="40"
          value={values.email || ""} 
          onChange={handleChange}/>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Пароль"
          className="welcome__input" 
          required  
          minLength="2" 
          maxLength="40"
          value= {values.password || ""}
          onChange={handleChange}/>
        <button 
          type="submit" 
          className="welcome__button">
          {props.text}
        </button>
      </form>
      {locationSignUp && (
        <p className="welcome__text">Уже зарегистрированы? <Link to={"/sign-in"} className="welcome__login-link">Войти</Link> </p>
      )}
    </div>
  )
}

export default WindowWithRegistrationAndLogin;
