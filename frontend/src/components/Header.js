import logo from "../logo.svg";

function Header(props) {
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="логотип" />
      {props.children}
    </header>
  );
}

export default Header;
