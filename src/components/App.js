import React, { useState, useEffect, useCallback } from 'react'
import { Route, Switch, Redirect, useHistory}  from "react-router-dom";
import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import Login from "./Login.js";
import Register from "./Register.js";
import InfoTooltip from "./InfoTooltip.js";
import PopupWithForm from "./PopupWithForm.js";
import ImagePopup from "./ImagePopup.js";
import CurrentUserContext from "../contexts/CurrentUserContext.js";
import api from "../utils/Api.js"
import auth from "../utils/Auth.js";
import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup.js";
import ProtectedRoute from "./ProtectedRoute"; // импортируем HOC


function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({link: "", name: ""});
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  const [isSuccessfullyTooltip, setIsSuccessfullyTooltip] = useState(false);
  const [isLogOn, setIsLogOn] = useState(false);

  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const history = useHistory();

  // Получаем данные с сервера (Данные профиля + данные карточек)
  useEffect(() => {
    api.getUserInfo() 
      .then((userData) => {
      setCurrentUser(userData);
    })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      })
    api.getInitialCards() 
      .then((cards) => {
      setCards(cards)
    })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      })
  }, [])

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true)
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true)
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true)
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setIsEditAvatarPopupOpen(false)
    setIsInfoTooltipPopupOpen(false)
    setSelectedCard({link: "", name: ""});
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  // отправляем данные на сервер
  function handleUpdateUser(user) {
    api.editUserInfo(user)
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      })
  }

  function handleUpdateAvatar(avatar) {
    api.editAvatar(avatar)
      .then((avatar) => {
        setCurrentUser(avatar);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      })
  }

  function handleAddPlaceSubmit(newCard) {
    api.addNewCards(newCard)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      })
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      })
  }


  function handleCardDelete(card) {
    api.deleteCard(card._id)
    .then(() => {
      const newCards = cards.filter((event) => event._id !== card._id);
        setCards(newCards);
    })
    .catch((err) => {
      console.log(`Ошибка: ${err}`);
    })
  }

  //Хук для проверки токена при каждом монтировании компонента App
  const handleTokenCheck = useCallback(() => {
    // если у пользователя есть токен в localStorage, 
  // эта функция проверит, действующий он или нет
    if (localStorage.getItem("jwt")) {
      const jwt = localStorage.getItem("jwt");
      // проверим токен
      auth.checkToken(jwt)
        .then((res) => {
          if (res) {
            // выполняется вход в систему
            setIsLogOn(true);
            //отображаем email пользователя
            setUserEmail(res.data.email);
            history.push("/");
          }
        })
        .catch((err) => {
          console.log(`Ошибка: ${err}`);
        });
    }
  }, [history]);

  useEffect(()=>{
    handleTokenCheck()
  }, [])

  // вход
  function handleIsLogin(data) {
    auth.login(data)
      .then((res) => {
        localStorage.setItem("jwt", res.token);
       handleTokenCheck()
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
        // открываем информационный попап
        setIsInfoTooltipPopupOpen(true);
        // попап проинформирует об  ошибке
        setIsSuccessfullyTooltip(false);
      })
  }


  // регистрация
  function handleIsRegistration(data) {
    auth.register(data)
      .then((res) => {
          // открываем информационный попап
         setIsInfoTooltipPopupOpen(true);
          // попап проинформирует об успешной регистрации
         setIsSuccessfullyTooltip(true); 
         setTimeout(() => {
          handleIsLogin(data)
         }, 300)
          console.log(res)  
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
        // открываем информационный попап
        setIsInfoTooltipPopupOpen(true);
        // попап проинформирует об  ошибке
        setIsSuccessfullyTooltip(false);
      })
  }

  

  // Выход из системы 
  function handleSignOut() {
    setIsLogOn(false);
    // перебрасываем на страницу входв
    history.push("/sign-in");
    //удалем JWT-токен из localStorage 
    localStorage.removeItem("jwt");
  }

  
  return (
    <CurrentUserContext.Provider value = {currentUser}>
      <div className="contents">
        <div className="page">
          <Header
            userEmail={userEmail}
            isLogOn={isLogOn}
            onSignOut={handleSignOut}
          /> 
          <Switch>  
            <ProtectedRoute
              exact path="/" // Пропс exact гарантирует, что значение пропса path будет сравниваться с путём в URL по принципу полного равенства.
              component={Main}
              onEditProfile={ handleEditProfileClick }
              onEditAvatar={ handleEditAvatarClick }
              onAddPlace={ handleAddPlaceClick }
              onCardClick={ handleCardClick }
              onCardLike={ handleCardLike }
              onCardDelete={ handleCardDelete }
              cards={ cards }
              isLogOn={isLogOn}
            />
            <Route path="/sign-up">
              <Register
               onSubmit={handleIsRegistration}
              />
            </Route>
            <Route path="/sign-in">
              <Login
              onSubmit={handleIsLogin}
              />
            </Route>
            <Route>
              <Redirect to={!isLogOn ? "/sign-up" : "/"} />
            </Route>
          </Switch>
          {isLogOn && <Footer />}
        </div>
        <EditProfilePopup  // попап редактирования профиля
          isOpen={isEditProfilePopupOpen} 
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser} />
        <AddPlacePopup // попап добавления карточек
          isOpen={isAddPlacePopupOpen} 
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit} 
          />
        <PopupWithForm // попап подтверждения удаления (!!! Если у компонента нет вложенных элементов, лучше делать сразу самозакрывающийся тег)
          name="delete"
          nameForm="delete-form"
          title="Вы уверены?"
          button="delete"
          text="Да"
        />
        <EditAvatarPopup // попап аватара
          isOpen={isEditAvatarPopupOpen} 
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar} />
        <ImagePopup // попап фулскрин картинки
           card={selectedCard}
           onClose={closeAllPopups}
        />
        <InfoTooltip // попап успешная регистрация - ошибка
          isOpen={isInfoTooltipPopupOpen}
          onClose={closeAllPopups}
          isSuccessfully={isSuccessfullyTooltip}
        />
      </div> 
    </CurrentUserContext.Provider>
  );
}

export default App
