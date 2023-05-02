import React from "react";
import { useState } from "react";
import Main from "./Main";
import Header from "./Header";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import PopupWithForm from "./PopupWithForm";
import api from "../utils/Api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import { Route, Routes, Navigate, useNavigate, Link } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import InfoTooltip from "./InfoTooltip";
import ProtectedRouter from "./ProtectedRouter";
import { register, checkToken, login } from "../utils/Auth";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isRegistrationSuccesfull, setIsRegistrationSuccessfull] =
    useState(false);
  const [userEmail, setUserEmail] = useState("");

  const navigate = useNavigate();

  React.useEffect(() => {
    checkJWT();
    if (loggedIn) {
      Promise.all([api.getUserInfo(), api.getCards()])
        .then(([userData, cardsData]) => {
          setCurrentUser(userData);
          setCards(cardsData);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [loggedIn]);

  const handleEditAvatarClick = function () {
    setIsEditAvatarPopupOpen(true);
  };

  const handleEditProfileClick = function () {
    setIsEditProfilePopupOpen(true);
  };

  const handleAddPlaceClick = function () {
    setIsAddPlacePopupOpen(true);
  };

  const handleCardClick = function (card) {
    setSelectedCard(card);
  };

  const closeAllPopups = function () {
    if (isEditAvatarPopupOpen) {
      setIsEditAvatarPopupOpen(false);
    }
    if (isAddPlacePopupOpen) {
      setIsAddPlacePopupOpen(false);
    }
    if (isEditProfilePopupOpen) {
      setIsEditProfilePopupOpen(false);
    }
    setSelectedCard(null);
    if (isInfoTooltipOpen) {
      setIsInfoTooltipOpen(false);
    }
  };

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((e) => {
        console.error(e);
      });
  }

  function handleCardDelete(card) {
    const isOwn = card.owner._id === currentUser._id;
    if (isOwn) {
      api
        .deleteCard(card._id)
        .then((response) => {
          if (response._id === card._id) {
            setCards((state) => 
              state.filter((item) => (item._id !== card._id))
            );
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }

  function handleUpdateUser(userInfo) {
    api
      .patchUserInfo(userInfo)
      .then((response) => {
        setCurrentUser({
          name: response.name,
          about: response.about,
          avatar: response.avatar,
        });
        setIsEditProfilePopupOpen(false);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  function handleUpdateAvatar(avatar) {
    api
      .patchUserInfoAvatar(avatar)
      .then((response) => {
        setCurrentUser({
          name: response.name,
          about: response.about,
          avatar: response.avatar,
        });
        setIsEditAvatarPopupOpen(false);
      })
      .catch((e) => {
        console.error(e);
      });
  }
  function handleAddPlaceSubmit(newCard) {
    api
      .postCard(newCard)
      .then((response) => {
        setCards([response, ...cards]);
        setIsAddPlacePopupOpen(false);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  function handleRegister(data) {
    register(data)
      .then((res) => {
        setCurrentUser(res);
        setIsRegistrationSuccessfull(true);
      })
      .catch((e) => setIsRegistrationSuccessfull(false))
      .finally(() => setIsInfoTooltipOpen(true));
  }
  function handleCloseInfoTooltip() {
    isRegistrationSuccesfull ? navigate("/sign-in") : navigate("/sign-up");
    setIsInfoTooltipOpen(false);
  }

  function handleLogin(data) {
    login(data)
      .then((res) => {
        localStorage.setItem("jwt", res.token);
        checkJWT();
      })
      .catch((e) => {
        console.error(e);
      });
  }

  function checkJWT() {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      checkToken(jwt)
        .then((data) => {
          setLoggedIn(true);
          setUserEmail(data.email);
          navigate("/cards");
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }

  function handleLogout() {
    localStorage.removeItem("jwt");
    navigate("/log-in");
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="root">
        <Routes>
          <Route
            path="*"
            element={
              loggedIn ? (
                <Navigate to="/cards" replace />
              ) : (
                <Navigate to="/sign-in" replace />
              )
            }
          />
          <Route
            path="/sign-up"
            element={
              <>
                <Header>
                  <Link className="header__nav-link" to="/sign-in">
                    Войти
                  </Link>
                </Header>
                <Register onSubmit={handleRegister} />
              </>
            }
          />
          <Route
            path="/sign-in"
            element={
              <>
                <Header>
                  <Link className="header__nav-link" to="/sign-up">
                    Регистрация
                  </Link>
                </Header>
                <Login onSubmit={handleLogin} />
              </>
            }
          />
          <Route
            path="/cards"
            element={
              <>
                <Header>
                  <div>
                    <span className="header__email">{userEmail}</span>
                    <Link
                      onClick={handleLogout}
                      className="header__nav-link header__nav-link_logout"
                      to="/sign-in"
                    >
                      Выйти
                    </Link>
                  </div>
                </Header>
                <ProtectedRouter
                  component={Main}
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onEditAvatar={handleEditAvatarClick}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                  cards={cards}
                  loggedIn={loggedIn}
                />
              </>
            }
          />
        </Routes>
        <Footer />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <AddPlacePopup
          onClose={closeAllPopups}
          isOpen={isAddPlacePopupOpen}
          onSubmit={handleAddPlaceSubmit}
        />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        <PopupWithForm
          name="remove-card"
          title="Вы уверены?"
          isOpen={false}
          buttonText="Да"
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          onClose={handleCloseInfoTooltip}
          isSucced={isRegistrationSuccesfull}
          successText={"Вы успешно зарегистрировались!"}
          rejectText={"Что-то пошло не так! Попробуйте ещё раз."}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
