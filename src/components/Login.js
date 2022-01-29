import React from 'react';
import WindowWithRegistrationAndLogin from "./WindowWithRegistrationAndLogin";
import  {withRouter}  from "react-router-dom";

function Login(props) {
  console.log(props)
  return (
    <WindowWithRegistrationAndLogin
      title="Вход"
      name="login"
      text="Войти"
      onSubmit={props.onSubmitLogin}
    />
  )
}

export default withRouter(Login);