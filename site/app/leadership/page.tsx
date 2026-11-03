import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";

export const metadata: Metadata = { title: "How I Lead | De Azua Design" };

export default function LeadershipPage() {
  return (
    <div className="leadership-page">
      <meta
        httpEquiv="Content-Security-Policy"
        content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; frame-src https://www.youtube.com;"
      />

      <SiteNav />
      <section className="case-hero">
        <div
          className="case-hero-gradient"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 20% 40%, rgba(102, 126, 234, 0.4) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 20%, rgba(118, 75, 162, 0.3) 0%, transparent 50%), radial-gradient(ellipse 50% 50% at 50% 80%, rgba(0, 245, 212, 0.15) 0%, transparent 50%)",
          }}
        ></div>
        <div className="case-hero-content">
          <a className="case-back" href="/">
            ← Back to Home
          </a>
          <h1 className="case-title">How I Lead</h1>
          <p className="case-intro">
            I build teams that understand the why, take ownership of the how, and ship work that
            moves the business. Here's what that looks like in practice.
          </p>
          <p className="case-hero-resume-link">
            <a
              className="about-leadership-link"
              href="/assets/images/resume/ricardo-deazua-resume-2026.pdf"
              download
            >
              Download resume{" "}
              <span className="link-icon">
                <i className="iconoir-download"></i>
              </span>
            </a>
          </p>
        </div>
      </section>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">Building Teams</p>
          <h3>Feedback is a gift. Sharing is how we get better.</h3>
          <p>
            I build collaborative teams where designers share early, critique openly, and grow
            through the work itself. Weekly design reviews, async shares, and <q>how we work</q>{" "}
            sessions aren't optional—they're how we hold each other to a high bar while making sure
            every voice is heard.
          </p>
        </section>
      </div>
      <div className="case-content">
        <div className="highlight-grid fade-in-section">
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-angle-tool"></i>
            </div>
            <h4 className="highlight-title">Open Critique Culture</h4>
            <p className="highlight-text">
              Weekly design reviews where everyone shares, everyone gives feedback, and quality
              stays high.
            </p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-collapse"></i>
            </div>
            <h4 className="highlight-title">Inclusive Teams</h4>
            <p className="highlight-text">
              Diverse teams look at user needs from different angles—and build better products
              because of it.
            </p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-shield-check"></i>
            </div>
            <h4 className="highlight-title">Psychological Safety</h4>
            <p className="highlight-text">
              Direct feedback paired with a safe space to explore, be opinionated, and take creative
              risks.
            </p>
          </div>
        </div>
      </div>
      <div className="case-content-narrow">
        <div className="testimonial-section">
          <blockquote className="testimonial">
            <p>
              He creates a safe, supportive space for designers to give and receive feedback and
              actively encourages learning beyond design work…
            </p>
          </blockquote>
        </div>
      </div>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">Ownership &amp; Clarity</p>
          <h3>Clear expectations. Real ownership.</h3>
          <p>
            I communicate goals and deliverables so designers can own outcomes—not just tasks. I
            build a culture where people feel empowered to challenge a direction or commit to one,
            because they understand the why behind the work. And I believe building inclusive teams
            is how you build inclusive products—diverse perspectives catch what homogeneous ones
            miss.
          </p>
        </section>
      </div>
      <div className="case-content">
        <div className="highlight-grid fade-in-section">
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-archery"></i>
            </div>
            <h4 className="highlight-title">Outcome Ownership</h4>
            <p className="highlight-text">
              Designers own their outcomes end-to-end, from discovery through delivery.
            </p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-clipboard-check"></i>
            </div>
            <h4 className="highlight-title">Team-Defined Norms</h4>
            <p className="highlight-text">
              Collaborative <q>how we work</q> sessions so the team owns how they operate—not just
              what they deliver.
            </p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-atom"></i>
            </div>
            <h4 className="highlight-title">Cross-Functional Alignment</h4>
            <p className="highlight-text">
              Partnering with product, engineering, and operations to align on shared priorities.
            </p>
          </div>
        </div>
      </div>
      <div className="case-content-narrow">
        <div className="testimonial-section">
          <blockquote className="testimonial">
            <p>Ricardo leads with clarity, humility, and heart.</p>
          </blockquote>
        </div>
      </div>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">Growth &amp; Innovation</p>
          <h3>Stretch opportunities. Space to fail. Tools that multiply impact.</h3>
          <p>
            I'm passionate about fostering a growth mindset—giving designers opportunities to
            stretch into unfamiliar territory and the space to fail in order to grow. I also push
            the team to build with new tools like Cursor and v0, because I believe tools augment
            expertise. They don't replace thinking—they 10x impact.
          </p>
        </section>
      </div>
      <div className="case-content">
        <div className="highlight-grid fade-in-section">
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-leaf"></i>
            </div>
            <h4 className="highlight-title">Growth Mindset</h4>
            <p className="highlight-text">
              Giving designers room to stretch, fail, and grow into more well-rounded designers and
              people.
            </p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-arrows-up-from-line"></i>
            </div>
            <h4 className="highlight-title">Mentoring Into Leadership</h4>
            <p className="highlight-text">
              Coaching designers to take on more visibility, lead reviews, and step into leadership
              roles.
            </p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-flash"></i>
            </div>
            <h4 className="highlight-title">Tools That Amplify</h4>
            <p className="highlight-text">
              Championing AI and new workflows to move faster and explore further—not to shortcut
              the craft.
            </p>
          </div>
        </div>
      </div>
      <div className="case-content-narrow">
        <div className="testimonial-section">
          <blockquote className="testimonial">
            <p>
              Ricardo has been an early and consistent advocate for AI—experimenting with tools like
              ChatGPT and Figma Make, sharing examples with the team, and helping integrate new
              workflows that increase speed and reduce lift.
            </p>
          </blockquote>
        </div>
      </div>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">Driving Impact</p>
          <h3>Products that move the business and serve the user.</h3>
          <p>
            Design is a business partner, not a service department. I build products that have a net
            positive impact on the business and the people who use them—grounded in real user
            research, validated through feedback, and measured by outcomes that matter.
          </p>
        </section>
      </div>
      <div className="case-content">
        <div className="highlight-grid fade-in-section">
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-microscope"></i>
            </div>
            <h4 className="highlight-title">User-Led Decisions</h4>
            <p className="highlight-text">
              Store visits, interviews, and real-world testing keep every design decision grounded
              in actual needs.
            </p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-graph-up"></i>
            </div>
            <h4 className="highlight-title">Outcome-Focused</h4>
            <p className="highlight-text">
              Shipping work that moves metrics, not just fills a roadmap.
            </p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-scale-frame-enlarge"></i>
            </div>
            <h4 className="highlight-title">Business + User Value</h4>
            <p className="highlight-text">
              Balancing business goals with user needs so products deliver for both.
            </p>
          </div>
        </div>
      </div>
      <div className="case-content-narrow">
        <div className="testimonial-section">
          <blockquote className="testimonial">
            <p>
              He bridges business context with design thinking in a way that's incredibly valuable,
              and he's deeply respected by his team, peers, and leadership.
            </p>
          </blockquote>
        </div>
      </div>
      <section className="next-project">
        <p className="next-project-label">Want to see it in action?</p>
        <div className="leadership-cta-links">
          <a className="hero-cta" href="/#case-studies">
            View Case Studies <span className="arrow">→</span>
          </a>{" "}
          <a className="connect-link leadership-cta" href="/#connect">
            Let's Connect
          </a>
        </div>
      </section>
    </div>
  );
}
