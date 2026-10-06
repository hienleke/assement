import { NavLink } from "react-router";
import "./Header.scss";

export default function Header() {
  return (
    <header className="header">
      <p className="header__brand">Assessment</p>
      <nav className="header__nav" aria-label="Primary">
        <NavLink to="/" end>
          Home
        </NavLink>
      </nav>
    </header>
  );
}
