import { Link } from "gatsby";
import React from "react";

const Header = ({ siteTitle }) => (
  <header>
    <nav className="navbar is-primary">
      <a className="navbar-item">
        <Link
          to="/"
          style={{
            color: `white`,
            textDecoration: `none`,
          }}
        >
          {siteTitle}
        </Link>
      </a>
    </nav>
  </header>
);

export default Header;
