import AuthorizationForm from "./AuthorizationForm";
import React from "react";

export default function (props) {
  const onSubmit = function (e) {
    e.preventDefault();
    props.onSubmit(values);
    setValues({ email: "", password: "" });
  };
  const [values, setValues] = React.useState({ email: "", password: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((state) => ({
      ...state,
      [name]: value,
    }));
  };

  return (
    <section className="authorization-form__container">
      <h2 className="authorization-form__title">{"Вход"}</h2>
      <AuthorizationForm onSubmit={onSubmit} name="login" buttonText="Войти">
        <input
          name="email"
          onChange={handleChange}
          type="text"
          placeholder="Email"
          value={values.email || ""}
          className="authorization-form__input"
          required
          minLength="2"
          maxLength="40"
        />
        <input
          name="password"
          onChange={handleChange}
          type="password"
          placeholder="Пароль"
          value={values.password || ""}
          className="authorization-form__input"
          required
          minLength="2"
          maxLength="40"
        />
      </AuthorizationForm>
    </section>
  );
}
