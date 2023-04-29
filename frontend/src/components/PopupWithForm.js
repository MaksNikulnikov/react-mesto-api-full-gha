function PopupWithForm(props) {
  const {
    title,
    name,
    isOpen,
    onClose,
    buttonText = "Сохранить",
    children,
    onSubmit,
  } = props;

  return (
    <section className={`popup popup_${name} ${isOpen ? "popup_opened" : ""}`}>
      <div className="popup__container">
        <button type="button" onClick={onClose} className="popup__close-btn" />
        <h2 className="popup__title">{title}</h2>
        <form
          name={name}
          onSubmit={onSubmit}
          className="popup__form"
        >
          {children}
          <button type="submit" className="popup__submit-btn">
            {buttonText}
          </button>
        </form>
      </div>
    </section>
  );
}

export default PopupWithForm;
