import React from 'react';
import WindowWithRegistrationAndLogin from "./WindowWithRegistrationAndLogin";

function Login(props) {
  return (
    <WindowWithRegistrationAndLogin
      title="Вход"
      name="login"
      text="Войти"
      onSubmit={props.onSubmit}
    />
  )
}

export default Login;