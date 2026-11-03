import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";

export const metadata: Metadata = {
  title: "Club Wyndham Vacation Planner | De Azua Design",
  robots: { index: false, follow: false },
};

export default function VacationPlannerPage() {
  return (
    <>
      <SiteNav />
      <section className="case-hero">
        <div
          className="case-hero-gradient"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 20% 40%, rgba(168, 237, 234, 0.4) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 20%, rgba(254, 214, 227, 0.3) 0%, transparent 50%), radial-gradient(ellipse 50% 50% at 50% 80%, rgba(0, 245, 212, 0.15) 0%, transparent 50%)",
          }}
        ></div>
        <div className="case-hero-content">
          <a className="case-back" href="/#case-studies">
            ← Back to Case Studies
          </a>
          <p className="case-client">Travel + Leisure Co</p>
          <h1 className="case-title">Club Wyndham Vacation Planner</h1>
          <p className="case-intro">
            Helping members and prospects discover their perfect vacation across 220+ resorts
            through personalized, quiz-style discovery.
          </p>
          <div className="case-image image-hero">
            <img
              src="/assets/images/projects/wyndham/cw-hero-2200x900-2.png"
              alt="Club Wyndham Vacation Planner Explore Resorts experience"
            />
          </div>
          <div className="case-meta">
            <div className="meta-item">
              <p className="meta-label">Role</p>
              <p className="meta-value">Design Manager</p>
            </div>
            <div className="meta-item">
              <p className="meta-label">Timeline</p>
              <p className="meta-value">2020 – 2022</p>
            </div>
            <div className="meta-item">
              <p className="meta-label">Team</p>
              <p className="meta-value">2 Designers</p>
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
          <h3>220+ resorts, endless decision paralysis</h3>
          <p>
            Users were having difficulty discovering resorts that would fit their ideal vacation.
            With over 220 resorts throughout the US, Caribbean, and Hawaii, finding the right match
            was time-consuming and overwhelming. Lack of personalization and social media's focus on
            popular destinations made the problem worse.
          </p>
        </section>
      </div>
      <div className="case-content">
        <div className="feature-block fade-in-section">
          <div className="feature-image has-image">
            <img
              src="/assets/images/projects/wyndham/cw-feature-card-discoverability.png"
              alt="Destination discoverability—resort search experience with 220+ options"
            />
          </div>
          <div className="feature-text">
            <p className="feature-label">Challenge 01</p>
            <h4 className="feature-title">Destination Discoverability</h4>
            <p className="feature-description">
              Users struggled to search and find resorts with over 220 options. The map and list
              views were time-consuming, and featured resorts weren't customized to user needs.
            </p>
          </div>
        </div>
        <div className="feature-block reverse fade-in-section">
          <div className="feature-image has-image">
            <img
              src="/assets/images/projects/wyndham/cw-feature-card-education-gap.png"
              alt="Product education gap—onboarding and conversion challenges for prospects"
            />
          </div>
          <div className="feature-text">
            <p className="feature-label">Challenge 02</p>
            <h4 className="feature-title">Product Education Gap</h4>
            <p className="feature-description">
              Prospects coming from social media or email campaigns weren't converting. New members
              had limited onboarding—they didn't know where to start or what resort was right for
              them.
            </p>
          </div>
        </div>
        <div className="feature-block fade-in-section">
          <div className="feature-image has-image">
            <img
              src="/assets/images/projects/wyndham/cw-feature-card-inventory.png"
              alt="Inventory balance—popular resorts vs underutilized availability"
            />
          </div>
          <div className="feature-text">
            <p className="feature-label">Challenge 03</p>
            <h4 className="feature-title">Inventory Balance</h4>
            <p className="feature-description">
              Popular resorts were increasingly difficult to book. Meanwhile, resorts with similar
              amenities and ratings had availability but limited visibility—a business opportunity
              hiding in plain sight.
            </p>
          </div>
        </div>
      </div>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">Who We're Helping</p>
          <h3>Members at every stage of their journey</h3>
          <p>
            Users at different stages with Club Wyndham were having similar issues—from prospects
            researching membership to seasoned members looking to try something new.
          </p>
        </section>
      </div>
      <div className="case-content">
        <div className="highlight-grid fade-in-section">
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-search"></i>
            </div>
            <h4 className="highlight-title">Prospect</h4>
            <p className="highlight-text">
              <q>
                I'm interested in a Club Wyndham membership. What kind of vacations can I go on?
              </q>
            </p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-umbrella"></i>
            </div>
            <h4 className="highlight-title">Seasoned Member</h4>
            <p className="highlight-text">
              <q>
                We love our beach resort. It'd be great to find a similar style resort in Orlando
                within our budget.
              </q>
            </p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-plus"></i>
            </div>
            <h4 className="highlight-title">New Member</h4>
            <p className="highlight-text">
              <q>I don't know where to start. What resort is right for me?</q>
            </p>
          </div>
        </div>
      </div>
      <div className="case-content">
        <div className="case-image image-hero fade-in-section">
          <img
            src="/assets/images/projects/wyndham/cw-explore-resort-feature-1200x700.png"
            alt="Final design: Vacation Planner Explore Resorts quiz flow"
          />
        </div>
      </div>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">The Solution</p>
          <h3>Different experiences for different goals</h3>
          <p>
            We designed the Explore Resorts experience to guide users through a series of questions
            to understand the type of vacation that best suits them. We created different flows for
            members and prospects to align with their unique goals—members get actionable booking
            paths, prospects get aspirational results with clear paths to membership.
          </p>
        </section>
      </div>
      <div className="case-content">
        <div className="feature-block fade-in-section">
          <div className="feature-image has-image">
            <img
              src="/assets/images/projects/wyndham/cw-explore-resort-member.png"
              alt="Member experience—from results to bookings with actionable recommendations"
            />
          </div>
          <div className="feature-text">
            <p className="feature-label">Member Experience</p>
            <h4 className="feature-title">From Results to Bookings</h4>
            <p className="feature-description">
              Member results make booking vacations easy. Users can quickly act on recommendations
              while being encouraged to continue exploring destinations in their results.
            </p>
          </div>
        </div>
        <div className="feature-block reverse fade-in-section">
          <div className="feature-image has-image">
            <img
              src="/assets/images/projects/wyndham/cw-explore-resort-prospect.png"
              alt="Prospect experience—aspirational results with clear path to membership"
            />
          </div>
          <div className="feature-text">
            <p className="feature-label">Prospect Experience</p>
            <h4 className="feature-title">From Aspirational to Actionable</h4>
            <p className="feature-description">
              Prospect results are more aspirational—generating excitement and deeper understanding
              of the product—while making a clear path to learn more about club membership.
            </p>
          </div>
        </div>
      </div>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">My Role</p>
          <h3>Design Manager</h3>
          <p>
            I led the design team working on the Club Wyndham website, including the owner
            dashboard, booking flow, and the Vacation Planner. I managed 2 designers, reviewed
            designs from our external agency team, and provided guidance to ensure good user
            experience and consistent design patterns. I worked closely with the user testing team
            to gather insights using high-fidelity prototypes.
          </p>
          <div className="role-list">
            <span className="role-tag">Design Management</span>{" "}
            <span className="role-tag">Product Strategy</span>{" "}
            <span className="role-tag">Agency Collaboration</span>{" "}
            <span className="role-tag">User Testing</span>{" "}
            <span className="role-tag">Design Systems</span>
          </div>
        </section>
      </div>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">Reflection</p>
          <h3>What I learned</h3>
          <p>
            Users enjoyed the experience but wanted it customized to them. Personalization isn't
            just a nice-to-have—it's what transforms a tedious search into an exciting discovery.
            The same content, presented differently based on user goals, creates dramatically
            different outcomes.
          </p>
        </section>
      </div>
      <section className="next-project">
        <p className="next-project-label">Next Project</p>
        <h2 className="next-project-title">Asurion Expert Workspace</h2>
        <a className="next-project-link" href="/projects/case-study-expert-workspace.html">
          View Case Study <span>→</span>
        </a>
      </section>
    </>
  );
}
