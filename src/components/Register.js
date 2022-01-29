import React from 'react';
import WindowWithRegistrationAndLogin from "./WindowWithRegistrationAndLogin";
import  {withRouter}  from "react-router-dom";


function Register(props) {
  console.log(props)
  return (
    <WindowWithRegistrationAndLogin
      title="Регистрация"
      name="registration"
      text="Зарегистрироваться"
      onSubmit={props.onSubmitRegistration}
    />
  )
}

export default withRouter(Register);
