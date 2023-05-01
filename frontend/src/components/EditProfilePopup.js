import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import PopupWithForm from "./PopupWithForm";

function EditProfilePopup(props) {
  const { isOpen, onClose, onUpdateUser } = props;
  const [values, setValues] = React.useState({ name: "", about: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const currentUser = React.useContext(CurrentUserContext);

  React.useEffect(() => {
    setValues({ name: currentUser.name, about: currentUser.about });
  }, [currentUser, isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser(values);
  }

  return (
    <PopupWithForm
      name="add-profile"
      title="Редактировать профиль"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <div className="popup__form-section">
        <input
          name="name"
          onChange={handleChange}
          type="text"
          placeholder="Имя"
          value={values.name || ""}
          className="popup__text popup__text_type_name"
          required
          minLength="2"
          maxLength="40"
        />
        <span className="popup__error"></span>
      </div>
      <div className="popup__form-section">
        <input
          name="about"
          onChange={handleChange}
          type="text"
          placeholder="Вид деятельности"
          value={values.about || ""}
          className="popup__text popup__text_type_caption"
          required
          minLength="2"
          maxLength="200"
        />
        <span className="popup__error"></span>
      </div>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
