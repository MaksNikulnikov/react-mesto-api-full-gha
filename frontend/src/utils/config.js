const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__text",
  parentInputAndErrorSelector: ".popup__form-section",
  submitButtonSelector: ".popup__submit-btn",
  inputErrorSelector: ".popup__error",
  inactiveButtonClass: "popup__submit-btn_disabled",
  errorClass: "popup__error_visible",
  inputInvalidClass: "popup__text_invalid",
};

const apiConfig = {
  serverName: "http://localhost:3000",
};

export { validationConfig, apiConfig };
