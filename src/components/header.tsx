import { Link } from "gatsby";
import React from "react";

const Header = ({ siteTitle }) => (
  <header>
    <nav className="navbar is-primary">
      <Link
        className="navbar-item"
        to="/"
        style={{
          color: `white`,
          textDecoration: `none`,
        }}
      >
        {siteTitle}
      </Link>
      <Link className="navbar-item" to="/builder">
        Line up Builder
      </Link>
      <Link to="/squad" className="navbar-item">
        Squad
      </Link>
    </nav>
  </header>
);

export default Header;
