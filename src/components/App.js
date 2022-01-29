import React from "react";
import { Route, Switch, Redirect, useHistory}  from "react-router-dom";
import "../index.css";
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

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({link: "", name: ""});
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = React.useState(false);
  const [isSuccessfullyTooltip, setIsSuccessfullyTooltip] = React.useState(false);
  const [isLogOn, setIsLogOn] = React.useState(false);

  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [userEmail, setUserEmail] = React.useState("");
  const [userPassword, setUserPassword] = React.useState("");
  const history = useHistory();

  // Получаем данные с сервера (Данные профиля + данные карточек)
  React.useEffect(() => {
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

  function closeInfoTooltipPopup() {
    closeAllPopups();
    if (isSuccessfullyTooltip) {
      handleIsLogin({email: userEmail, password: userPassword});
    }
  }

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
  const handleTokenCheck = React.useCallback(() => {
    // если у пользователя есть токен в localStorage, 
  // эта функция проверит, действующий он или нет
    if (localStorage.getItem("jwt")) {
      const jwt = localStorage.getItem("jwt");
      // проверим токен
      auth.tokenValidity(jwt)
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

  React.useEffect(()=>{
    handleTokenCheck()
  }, [history])


// регистрация
  function handleIsRegistration(data) {
    auth.registration(data)
      .then((res) => {
        // перебрасываем в Main
        history.push("/");
        setUserEmail(res.data.email);
        setUserPassword(data.password);
        // открываем информационный попап
        setIsInfoTooltipPopupOpen(true);
        // попап проинформирует об успешной регистрации
        setIsSuccessfullyTooltip(true);
        
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
        // открываем информационный попап
        setIsInfoTooltipPopupOpen(true);
        // попап проинформирует об  ошибке
        setIsSuccessfullyTooltip(false);
      })
  }

  // вход
  function handleIsLogin(data) {
    auth.login(data)
      .then((res) => {
        localStorage.setItem("jwt", res.token);
        setIsLogOn(true);
        history.push("/");
        setUserEmail(data.email);
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
               onSubmitRegistration={handleIsRegistration}
              />
            </Route>
            <Route path="/sign-in">
              <Login
              onSubmitLogin={handleIsLogin}
              />
            </Route>
            <Route>
              <Redirect to={!isLogOn ? "/sign-in" : "/"} />
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
          onClose={closeInfoTooltipPopup}
          isSuccessfully={isSuccessfullyTooltip}
        />
      </div> 
    </CurrentUserContext.Provider>
  );
}

export default App
