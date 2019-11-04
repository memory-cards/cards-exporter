// tslint:disable no-submodule-imports
import Link from "next/link";
import { withRouter, WithRouterProps } from "next/router";
import * as React from "react";

import "bootstrap/dist/css/bootstrap.min.css";

import "./styles.scss";

const pages = [
  { href: "/filterCards", label: "Filter cards page" },
  { href: "/createCard", label: "Create cards page" },
  { href: "/updateCards", label: "Update cards page" }
];

const infoLinks = [
  { href: "/api/date", label: "Date info" },
  { href: "/api/cards/list", label: "Cards info" },
  { href: "/api/cards/deck", label: "Deck info" },
  { href: "/api/cards/update", label: "Last update info" },
  { href: "/api/cards/tags", label: "Tags info" }
];

const Header = (props: WithRouterProps) => {
  return (
    <div className="nav">
      <div className="navbar">
        {infoLinks.map(({ href, label }) => (
          <Link key={href} href={href}>
            <a>{label}</a>
          </Link>
        ))}
      </div>

      <div className="navbar">
        {pages.map(({ href, label }) => (
          <Link key={href} href={href}>
            <a
              className={
                props && props.router && href === props.router.pathname
                  ? "active"
                  : ""
              }
            >
              {label}
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export { Header as TestHeader };

export default withRouter(Header);
