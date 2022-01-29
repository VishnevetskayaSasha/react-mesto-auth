class Auth {
  constructor (config) { 
    this._url = config.url;
    this._headers = config.headers; 
  }

  // отдельно выносим проверку, чтоб не писать ее каждый раз
  _checkLineOk(responce) {
    if (responce.ok) {  // если у объекта responce поле ок = истина
      return responce.json(); // тогла возвращаем реальные данные (если не написать return в следующий промис не передадутся данные)
    } return Promise.reject(`Ошибка: ${responce} `) // если статус не ок, возвращаем Promise.rejec (переводим в значение rejected (отклонено))
  }

  // регистрация
  registration(data) {
    console.log(data)
    return fetch(`${this._url}/signup`, { 
      method: "POST",  
      headers: this._headers,
      body: JSON.stringify({
        password: data.password,
        email: data.email
      }), 
    })
    .then((responce) => {
      return this._checkLineOk(responce)
    }) 
  }

  // авторизация (вход)
  login(data) {
    console.log(data)
    return fetch(`${this._url}/signin`, { 
      method: "POST",  
      headers: this._headers,
      body: JSON.stringify({
        password: data.password,
        email: data.email
      }),
    })
    .then((responce) => {
      return this._checkLineOk(responce)
    }) 
  }

  // проверка валидности токена и получения email для вставки в шапку сайта:
  tokenValidity(token) {
    console.log(token)
    return fetch(`${this._url}/users/me`, { 
      method: "GET",  
      headers: {
       // "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    })
    .then((responce) => {
      return this._checkLineOk(responce)
    }) 
  }

}

const auth = new Auth ({
  url: "https://auth.nomoreparties.co",
  headers: {
    'Content-Type': 'application/json' // наш сервер ждет именно эту строчку (данные в формате json), некоторым серверам он не нужен для ответа
  } 
})

export default auth;