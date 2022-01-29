import React from 'react';

function InfoTooltip(props) {

    return (
      <div className={`popup popup_type_tooltip ${props.isOpen ? "popup_open" : ""}`}>
        <form name="info-form" className="popup__container">
          <button type="button" className="popup__button-close" onClick={props.onClose}></button>
          <div className={`popup__img ${props.isSuccessfully ? "" : "popup__img_error"}`}></div>
          <h2 className="popup__title popup__title_tooltip">{props.isSuccessfully ? "Вы успешно зарегистрировались!" : "Что-то пошло не так! Попробуйте ещё раз." }</h2>   
        </form>
      </div>
    )
}
export default InfoTooltip;
