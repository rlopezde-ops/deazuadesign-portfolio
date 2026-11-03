/* Behavior lives in initMobileNav() / initNavScroll() in lib/site-effects.ts.
   See "Safari Dynamic Island — Nav Constraints" in docs/PROJECT_DOCS.md first. */
export function SiteNav({ home = false }: { home?: boolean }) {
  const prefix = home ? "" : "/";

  return (
    <nav className="nav">
      <a href={home ? "#" : "/"} className="nav-logo">
        <img src="/assets/images/logo.png" alt="De Azua Design" className="logo-img" />
      </a>
      <button
        type="button"
        className="nav-toggle"
        id="navToggle"
        aria-expanded="false"
        aria-controls="primary-nav"
        aria-label="Open menu"
      >
        <span className="nav-toggle-bars" aria-hidden="true">
          <span className="nav-toggle-bar"></span>
          <span className="nav-toggle-bar"></span>
          <span className="nav-toggle-bar"></span>
        </span>
      </button>
      <div className="nav-menu" id="primary-nav">
        <div className="nav-menu-inner">
          <div className="nav-links">
            <a href={`${prefix}#case-studies`}>Case Studies</a>
            <a href={`${prefix}#about`}>About</a>
            <a href={`${prefix}#connect`}>Connect</a>
          </div>
        </div>
      </div>
    </nav>
  );
}
