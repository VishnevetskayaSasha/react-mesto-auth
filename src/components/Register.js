import React from 'react';
import WindowWithRegistrationAndLogin from "./WindowWithRegistrationAndLogin";


function Register(props) {
  return (
    <WindowWithRegistrationAndLogin
      title="Регистрация"
      name="registration"
      text="Зарегистрироваться"
      onSubmit={props.onSubmit}
    />
  )
}

export default Register;
