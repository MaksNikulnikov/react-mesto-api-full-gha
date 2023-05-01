export default function (props) {
  return (
    <form
      name={props.name}
      onSubmit={props.onSubmit}
      className="authorization-form"
    >
      {props.children}
      <button type="submit" className="authorization-form__submit-btn">
        {props.buttonText}
      </button>
    </form>
  );
}
