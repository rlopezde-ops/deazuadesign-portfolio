import type { Metadata } from "next";
import { PasswordGate } from "@/components/password-gate";
import { SiteNav } from "@/components/site-nav";

export const metadata: Metadata = {
  title: "Disney Guest Service Suite | De Azua Design",
  robots: { index: false, follow: false },
};

export default function DisneyGuestServicePage() {
  return (
    <>
      <PasswordGate />
      <SiteNav />
      <section className="case-hero">
        <div
          className="case-hero-gradient"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 20% 40%, rgba(79, 172, 254, 0.4) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 20%, rgba(0, 242, 254, 0.3) 0%, transparent 50%), radial-gradient(ellipse 50% 50% at 50% 80%, rgba(181, 126, 220, 0.15) 0%, transparent 50%)",
          }}
        ></div>
        <div className="case-hero-content">
          <a className="case-back" href="/#case-studies">
            ← Back to Case Studies
          </a>
          <p className="case-client">Disney Parks &amp; Experiences</p>
          <h1 className="case-title">Guest Service Suite</h1>
          <p className="case-intro">
            Simplifying how Cast Members assist guests across all Disney parks—replacing 60+
            disconnected apps with one responsive, unified experience.
          </p>
          <div className="case-image image-hero">
            <img
              src="/assets/images/projects/gss/disney-gss-hero-2200x900.png"
              alt="Disney Guest Service Suite dashboard and guest management interface"
            />
          </div>
          <div className="case-meta">
            <div className="meta-item">
              <p className="meta-label">Role</p>
              <p className="meta-value">Lead Product Designer</p>
            </div>
            <div className="meta-item">
              <p className="meta-label">Timeline</p>
              <p className="meta-value">May 2019 – Dec 2020</p>
            </div>
            <div className="meta-item">
              <p className="meta-label">Team</p>
              <p className="meta-value">2 → 4 Designers</p>
            </div>
            <div className="meta-item">
              <p className="meta-label">Platform</p>
              <p className="meta-value">Responsive Web</p>
            </div>
          </div>
        </div>
      </section>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">The Challenge</p>
          <h3>60+ apps, paper documents, and frustrated Cast Members</h3>
          <p>
            Disney staff struggled with efficiency issues helping guests in the parks—causing guest
            frustration and complaints. Cast Members had to navigate multiple applications, use
            paper documents, and rely on manual processes to assist guests pre-arrival, on-site, and
            post-visit.
          </p>
        </section>
      </div>
      <div className="case-content">
        <div className="feature-block fade-in-section">
          <div className="feature-image has-image">
            <img
              src="/assets/images/projects/gss/gss-feature-card-dropdowns.png"
              alt="Incident reports requiring 11 dropdown selections with hundreds of options"
            />
          </div>
          <div className="feature-text">
            <p className="feature-label">Challenge 01</p>
            <h4 className="feature-title">Not Responsive, Too Many Steps</h4>
            <p className="feature-description">
              Over 60% of in-park staff only had access to mobile or tablet devices, but tools
              weren't built for them. Incident reports required completing 11 dropdown
              selections—some with hundreds of options.
            </p>
          </div>
        </div>
        <div className="feature-block reverse fade-in-section">
          <div className="feature-image has-image">
            <img
              src="/assets/images/projects/gss/castmember.png"
              alt="Cast Member scanning a guest's MagicBand at a FastPass+ parade viewing location"
            />
          </div>
          <div className="feature-text">
            <p className="feature-label">Challenge 02</p>
            <h4 className="feature-title">Limited Information &amp; Communication</h4>
            <p className="feature-description">
              Guest and park information was unavailable or scarce. Staff relied on paper flyers for
              daily events and the guest's own app for a clear picture. Urgent updates were
              difficult to communicate.
            </p>
          </div>
        </div>
        <div className="feature-block fade-in-section">
          <div className="feature-image has-image">
            <img
              src="/assets/images/projects/gss/60+apps.png"
              alt="Cast Members use over 60 Guest Service Apps to perform their roles today - showing logos of various Disney internal applications"
            />
          </div>
          <div className="feature-text">
            <p className="feature-label">Challenge 03</p>
            <h4 className="feature-title">60+ Disconnected Apps</h4>
            <p className="feature-description">
              Staff used over 60 guest service apps to do their jobs, jumping between them to see
              guest info and take action. Guest satisfaction was difficult to improve without
              accurate reporting.
            </p>
          </div>
        </div>
      </div>
      <div className="case-content">
        <div className="highlight-grid fade-in-section">
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-light-bulb-on"></i>
            </div>
            <h4 className="highlight-title">Inform</h4>
            <p className="highlight-text">
              Ensure staff has access to guest and park information they need to help guests.
            </p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-spark"></i>
            </div>
            <h4 className="highlight-title">Simplify</h4>
            <p className="highlight-text">
              Provide staff with a better view of guest information and quick access from multiple
              systems.
            </p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-shield-check"></i>
            </div>
            <h4 className="highlight-title">Empower</h4>
            <p className="highlight-text">
              Allow more staff to assist guests in real-time regardless of their device.
            </p>
          </div>
        </div>
      </div>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">Who We're Helping</p>
          <h3>Cast Members across every touchpoint</h3>
          <p>
            Our product focused on staff members who interacted with guests regularly through all
            Disney parks—from in-park merchandise coordinators to call center specialists to guest
            experience managers.
          </p>
        </section>
      </div>
      <div className="case-content">
        <div className="case-image image-hero fade-in-section">
          <img
            src="/assets/images/projects/gss/disney-gss-hero-2200x900-2.png"
            alt="Guest Service Suite final design showing desktop and mobile responsive interfaces with guest management features"
          />
        </div>
      </div>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">The Solution</p>
          <h3>One responsive app to replace them all</h3>
          <p>
            We combined functionality from several legacy applications into four main sections:
            Guest Interaction Tracking, Guest Itinerary &amp; Scheduling, Tickets &amp; Media, and
            Admin. The interface works seamlessly across devices, from desktop to mobile.
          </p>
        </section>
      </div>
      <div className="case-content">
        <div className="feature-block fade-in-section">
          <div className="feature-image has-image">
            <img
              src="/assets/images/projects/gss/gss-feature-card-guest-interaction.png"
              alt="Guest Interaction History showing interaction logs and multiple view options"
            />
          </div>
          <div className="feature-text">
            <p className="feature-label">Feature</p>
            <h4 className="feature-title">Guest Interaction History</h4>
            <p className="feature-description">
              I led the design on Guest Interaction Tracking—giving Cast Members the ability to log
              new interactions and review guest history. The UI displays information at a glance and
              allows Cast to initiate actions easily to resolve issues. The interface adapts based
              on user needs—interaction reports can be viewed chronologically or grouped by
              incident, giving Cast flexibility in how they work.
            </p>
          </div>
        </div>
        <div className="feature-block reverse fade-in-section">
          <div className="feature-image has-image">
            <img
              src="/assets/images/projects/gss/gss-feature-card-magic%20bands.png"
              alt="MagicBands and media scanning interface"
            />
          </div>
          <div className="feature-text">
            <p className="feature-label">Feature</p>
            <h4 className="feature-title">MagicBands &amp; Media</h4>
            <p className="feature-description">
              We enabled managing, scanning, and issuing media and tickets. We collaborated closely
              with development to ensure quick data transfers and spoke with Cast who scan
              MagicBands to make the process more efficient.
            </p>
          </div>
        </div>
        <div className="feature-block fade-in-section">
          <div className="feature-image has-image">
            <img
              src="/assets/images/projects/gss/gss-feature-card-data-entry.png"
              alt="Simplified data entry flow for incident reports"
            />
          </div>
          <div className="feature-text">
            <p className="feature-label">Feature</p>
            <h4 className="feature-title">Simplified Data Entry</h4>
            <p className="feature-description">
              Creating incident reports was a major pain point. We redesigned the flow to capture
              guest experiences (good and bad) correctly and efficiently—eliminating the 11-dropdown
              nightmare.
            </p>
          </div>
        </div>
      </div>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">My Role</p>
          <h3>Lead Product Designer</h3>
          <p>
            I was a lead product designer working on Disney's guest service application. I led
            design on the Guest Interaction Tracking section, conducted user research with
            front-line, guest services, and call center staff, and participated in sketch boarding
            and user testing sessions. We started as 2 lead designers and grew the team to 4.
          </p>
          <div className="role-list">
            <span className="role-tag">Lead Product Designer</span>{" "}
            <span className="role-tag">User Research</span>{" "}
            <span className="role-tag">Interaction Design</span>{" "}
            <span className="role-tag">Responsive Design</span>{" "}
            <span className="role-tag">Prototyping</span>{" "}
            <span className="role-tag">User Testing</span>
          </div>
        </section>
      </div>
      <div className="case-content">
        <div className="impact-section fade-in-section">
          <p className="case-section-title">Impact</p>
          <h3>Built collaboratively, adopted enthusiastically</h3>
          <p style={{ color: "var(--text-secondary)", maxWidth: "600px" }}>
            The initial launch was met with extreme excitement by Cast Members. We delivered a
            product that simplified their workflow because we involved them throughout the process.
          </p>
          <div className="impact-grid">
            <div className="impact-card">
              <p className="impact-value">~25%</p>
              <p className="impact-label">Efficiency improvement</p>
            </div>
            <div className="impact-card">
              <p className="impact-value">30K+</p>
              <p className="impact-label">Staff across 5 parks</p>
            </div>
            <div className="impact-card">
              <p className="impact-value">80%</p>
              <p className="impact-label">Positive Cast response</p>
            </div>
          </div>
        </div>
      </div>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">Reflection</p>
          <h3>What I learned</h3>
          <p>
            The success of the app came from involving Cast Members throughout the process—in user
            research, testing, and working sessions. When you build with your users, not just for
            them, adoption comes naturally.
          </p>
        </section>
      </div>
      <section className="next-project">
        <p className="next-project-label">Next Project</p>
        <h2 className="next-project-title">Halloween Horror Nights</h2>
        <a className="next-project-link" href="/projects/case-study-halloween-horror-nights.html">
          View Case Study <span>→</span>
        </a>
      </section>
    </>
  );
}
