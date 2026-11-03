import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";

export const metadata: Metadata = {
  title: "Halloween Horror Nights | De Azua Design",
  robots: { index: false, follow: false },
};

export default function HalloweenHorrorNightsPage() {
  return (
    <>
      <SiteNav />
      <section className="case-hero">
        <div
          className="case-hero-gradient"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 20% 40%, rgba(250, 112, 154, 0.4) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 20%, rgba(254, 225, 64, 0.3) 0%, transparent 50%), radial-gradient(ellipse 50% 50% at 50% 80%, rgba(255, 107, 157, 0.2) 0%, transparent 50%)",
          }}
        ></div>
        <div className="case-hero-content">
          <a className="case-back" href="/#case-studies">
            ← Back to Case Studies
          </a>
          <p className="case-client">Universal Orlando</p>
          <h1 className="case-title">Halloween Horror Nights</h1>
          <p className="case-intro">
            A mobile-first, responsive e-commerce redesign that broke attendance records and drove
            double-digit growth in online ticket sales.
          </p>
          <div className="case-image image-hero">
            <img
              src="/assets/images/projects/hhn/hhn-hero-2200x900-2.png"
              alt="Halloween Horror Nights responsive homepage hero"
            />
          </div>
          <div className="case-meta">
            <div className="meta-item">
              <p className="meta-label">Role</p>
              <p className="meta-value">UI/UX Art Director</p>
            </div>
            <div className="meta-item">
              <p className="meta-label">Timeline</p>
              <p className="meta-value">Mar 2018 – Mar 2019</p>
            </div>
            <div className="meta-item">
              <p className="meta-label">Collaboration</p>
              <p className="meta-value">Creative &amp; Ad Directors</p>
            </div>
            <div className="meta-item">
              <p className="meta-label">Platform</p>
              <p className="meta-value">Web, Mobile</p>
            </div>
          </div>
        </div>
      </section>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">The Challenge</p>
          <h3>Translate terror to ticket sales</h3>
          <p>
            Halloween Horror Nights is Universal Orlando's biggest annual event—and the World's Best
            Halloween Event. We needed to build a new responsive website that captured the event's
            immersive atmosphere while driving ticket conversions, especially on mobile where
            traffic was growing rapidly.
          </p>
        </section>
      </div>
      <div className="case-content">
        <div className="feature-block fade-in-section">
          <div className="feature-image has-image">
            <img
              src="/assets/images/projects/universal/hhn-mobile-friendly.png"
              alt="Halloween Horror Nights mobile-friendly responsive design showing mobile and tablet views"
            />
          </div>
          <div className="feature-text">
            <p className="feature-label">Challenge 01</p>
            <h4 className="feature-title">Mobile-First Imperative</h4>
            <p className="feature-description">
              Mobile traffic was growing fast, but the existing site wasn't optimized for it. We
              needed a mobile-first approach that didn't sacrifice the immersive, horror-themed
              experience.
            </p>
          </div>
        </div>
        <div className="feature-block reverse fade-in-section">
          <div className="feature-image has-image">
            <img
              src="/assets/images/projects/universal/hhn-beforeandafter.png"
              alt="Before and after comparison showing simplified ticket options from 7 to 2"
            />
          </div>
          <div className="feature-text">
            <p className="feature-label">Challenge 02</p>
            <h4 className="feature-title">Too Many Choices, Too Much Confusion</h4>
            <p className="feature-description">
              The site offered seven different ticket options, overwhelming users and creating
              confusion. Complex navigation buried what guests were actually looking for.
            </p>
          </div>
        </div>
        <div className="feature-block fade-in-section">
          <div className="feature-image has-image">
            <img
              src="/assets/images/projects/hhn/hhn-cohesive-brand.png"
              alt="Cohesive cross-channel brand alignment across advertising and digital"
            />
          </div>
          <div className="feature-text">
            <p className="feature-label">Challenge 03</p>
            <h4 className="feature-title">Cohesive Cross-Channel Experience</h4>
            <p className="feature-description">
              The digital experience needed to align with advertising and marketing campaigns. I
              collaborated with Creative and Art Directors across teams to ensure a unified brand
              expression.
            </p>
          </div>
        </div>
      </div>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">The Approach</p>
          <h3>Simplify the path, amplify the fear</h3>
          <p>
            We took a mobile-first approach, simplifying content, CTAs, ticketing options, and
            navigation to give users a more direct path to buy tickets and learn about the event.
            Every design decision balanced conversion optimization with maintaining the immersive
            horror atmosphere.
          </p>
        </section>
      </div>
      <div className="case-content">
        <div className="case-image image-hero fade-in-section">
          <img
            src="/assets/images/projects/hhn/hhn-feature-block-1400x440-2.png"
            alt="Halloween Horror Nights final responsive design"
          />
        </div>
      </div>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">The Solution</p>
          <h3>From 7 options to 2, from confusion to conversion</h3>
          <p>
            We streamlined the ticket pricing options from seven down to two—making it dramatically
            easier for users to find the right tickets. We separated Tickets, Extras, and Vacation
            Packages into individual pages to keep users focused on what they were looking for.
          </p>
        </section>
      </div>
      <div className="case-content">
        <div className="highlight-grid fade-in-section">
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-smartphone-device"></i>
            </div>
            <h4 className="highlight-title">Mobile-First Design</h4>
            <p className="highlight-text">
              Responsive experience optimized for the growing mobile audience without sacrificing
              atmosphere.
            </p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-archery"></i>
            </div>
            <h4 className="highlight-title">Simplified Choices</h4>
            <p className="highlight-text">
              Reduced ticket options from 7 to 2, eliminating confusion and speeding up purchase
              decisions.
            </p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-page"></i>
            </div>
            <h4 className="highlight-title">Focused Pages</h4>
            <p className="highlight-text">
              Separated Tickets, Extras, and Vacation Packages into dedicated pages for clearer user
              journeys.
            </p>
          </div>
        </div>
        <div className="feature-block fade-in-section">
          <div className="feature-image has-image">
            <img
              src="/assets/images/projects/hhn/hhn-tickets-new.png"
              alt="Simplified ticket flow from 7 options to 2"
            />
          </div>
          <div className="feature-text">
            <p className="feature-label">Feature</p>
            <h4 className="feature-title">User-Centric Ticketing</h4>
            <p className="feature-description">
              The streamlined ticketing experience made finding the best tickets easier for users—a
              cleaner path from interest to purchase that reinforced HHN as the World's Best
              Halloween Event.
            </p>
          </div>
        </div>
      </div>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">My Role</p>
          <h3>UI/UX Art Director</h3>
          <p>
            I was the lead designer on the project, collaborating with the design lead and creative
            leadership to build the new responsive website. I worked closely with Creative and Art
            Directors who led the advertising and marketing efforts to ensure a cohesive design
            across all touchpoints.
          </p>
          <div className="role-list">
            <span className="role-tag">UI/UX Art Direction</span>{" "}
            <span className="role-tag">Lead Designer</span>{" "}
            <span className="role-tag">Responsive Design</span>{" "}
            <span className="role-tag">E-commerce UX</span>{" "}
            <span className="role-tag">Cross-team Collaboration</span>
          </div>
        </section>
      </div>
      <div className="case-content">
        <div className="impact-section fade-in-section">
          <p className="case-section-title">Impact</p>
          <h3>Record-breaking results</h3>
          <p style={{ color: "var(--text-secondary)", maxWidth: "600px" }}>
            The new online experience and mobile-first approach delivered measurable business
            results—breaking attendance records and significantly growing online revenue.
          </p>
          <div className="impact-grid">
            <div className="impact-card">
              <p className="impact-value">
                <i className="iconoir-medal-1st-solid" aria-hidden="true"></i>
              </p>
              <p className="impact-label">Broke attendance records</p>
            </div>
            <div className="impact-card">
              <p className="impact-value">2X</p>
              <p className="impact-label">Double-digit sales growth</p>
            </div>
            <div className="impact-card">
              <p className="impact-value">
                <i className="iconoir-stats-up-square-solid" aria-hidden="true"></i>
              </p>
              <p className="impact-label">Increased mobile traffic &amp; sales</p>
            </div>
          </div>
        </div>
      </div>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">Reflection</p>
          <h3>What I learned</h3>
          <p>
            Sometimes the best design decision is removing options, not adding them. By simplifying
            choices and focusing user journeys, we created a better experience that drove real
            business results—proving that user-centric design and conversion optimization aren't at
            odds.
          </p>
        </section>
      </div>
      <section className="next-project">
        <p className="next-project-label">Next Project</p>
        <h2 className="next-project-title">Club Wyndham Vacation Planner</h2>
        <a className="next-project-link" href="/projects/case-study-vacation-planner.html">
          View Case Study <span>→</span>
        </a>
      </section>
    </>
  );
}
