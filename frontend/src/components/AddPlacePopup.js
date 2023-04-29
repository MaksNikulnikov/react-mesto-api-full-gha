import React from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup(props) {
  function addNewCard(e) {
    e.preventDefault();
    props.onSubmit(values);
  }

  const [values, setValues] = React.useState({ name: "", link: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((state) => ({
      ...state,
      [name]: value,
    }));
  };

  React.useEffect(() => {
    setValues({ name: "", link: "" });
  }, [props.isOpen]);

  return (
    <PopupWithForm
      name="add-card"
      title="Новое место"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={addNewCard}
    >
      <div className="popup__form-section">
        <input
          name="name"
          type="text"
          onChange={handleChange}
          placeholder="Название"
          value={values.name}
          className="popup__text popup__text_type_name"
          required
          minLength="2"
          maxLength="30"
        />
        <span className="popup__error"></span>
      </div>
      <div className="popup__form-section">
        <input
          name="link"
          onChange={handleChange}
          type="url"
          placeholder="Ссылка на картинку"
          value={values.link}
          className="popup__text popup__text_type_url"
          required
        />
        <span className="popup__error"></span>
      </div>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
