// tslint:disable no-submodule-imports
import Link from "next/link";
import { withRouter, WithRouterProps } from "next/router";
import * as React from "react";

import "bootstrap/dist/css/bootstrap.min.css";

import "./styles.scss";

const pages = [
  { href: "/filterCards", label: "Filter cards" },
  { href: "/createCard", label: "Create cards" },
  { href: "/updateCards", label: "Update cards" }
];

const infoLinks = [
  { href: "/api/date", label: "Date" },
  { href: "/api/cards/list", label: "Cards" },
  { href: "/api/cards/deck", label: "Deck" },
  { href: "/api/cards/update", label: "Last update" },
  { href: "/api/cards/tags", label: "Tags" }
];

const Header = (props: WithRouterProps) => {
  return (
    <ul className="nav nav-tabs">
      {infoLinks.map(({ href, label }) => (
        <li className="nav-item">
          <Link key={href} href={href}>
            <a className="nav-link">{label}</a>
          </Link>
        </li>
      ))}

      {pages.map(({ href, label }) => (
        <li className="nav-item">
          <Link key={href} href={href}>
            <a
              className={
                props && props.router && href === props.router.pathname
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              {label}
            </a>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export { Header as TestHeader };

export default withRouter(Header);
