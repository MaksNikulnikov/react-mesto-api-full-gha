import React from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup(props) {
  const { isOpen, onClose, onUpdateAvatar } = props;
  const imgRef = React.useRef("");

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateAvatar({
      link: imgRef.current.value,
    });
  }

  return (
    <PopupWithForm
      name="change-profile-avatar"
      title="Обновить аватар"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <div className="popup__form-section">
        <input
          name="link"
          ref={imgRef}
          type="url"
          placeholder="https://somewebsite.com/someimage.jpg"
          className="popup__text popup__text_type_url"
          required
        />
        <span className="popup__error"></span>
      </div>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
