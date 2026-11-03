import type { Metadata } from "next";
import { PasswordGate } from "@/components/password-gate";
import { SiteNav } from "@/components/site-nav";

export const metadata: Metadata = {
  title: "Next-Gen Portal | De Azua Design",
  robots: { index: false, follow: false },
};

export default function NextgenPortalPage() {
  return (
    <>
      <PasswordGate />
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
          <a className="case-back" href="/#case-studies">
            ← Back to Case Studies
          </a>
          <p className="case-client">Asurion</p>
          <h1 className="case-title">Next-Gen Portal</h1>
          <p className="case-intro">
            Rebuilding the core operating system for 680+ repair stores nationwide—transforming how
            technicians check in customers, manage repairs, and run their business.
          </p>
          <div className="case-image image-hero">
            <img
              src="/assets/images/projects/nextgen/next-gen-hero-2200x900.png"
              alt="Next-Gen Portal dashboard hero"
            />
          </div>
          <div className="case-meta">
            <div className="meta-item">
              <p className="meta-label">Role</p>
              <p className="meta-value">Sr. Manager, Product Design</p>
            </div>
            <div className="meta-item">
              <p className="meta-label">Timeline</p>
              <p className="meta-value">2022 – 2025</p>
            </div>
            <div className="meta-item">
              <p className="meta-label">Team</p>
              <p className="meta-value">4 Designers</p>
            </div>
            <div className="meta-item">
              <p className="meta-label">Platform</p>
              <p className="meta-value">Web Application</p>
            </div>
          </div>
          <div className="case-meta-extended">
            <div className="meta-item">
              <p className="meta-label">My Focus</p>
              <p className="meta-value">
                Design lead — vision setting, design principles, cross-functional alignment, and
                execution from concept through launch
              </p>
            </div>
            <div className="meta-item">
              <p className="meta-label">Key Challenge</p>
              <p className="meta-value">
                Replacing a system with a decade of operational maturity without recreating its
                complexity — and changing how design was perceived in the organization along the way
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">The Challenge</p>
          <h3>Replacing 10 years of band-aids in under 2</h3>
          <p>
            uBreakiFix technicians rely on internal software to do everything—check in customers,
            diagnose devices, manage repairs, handle payments, and track inventory. The legacy
            system had been built over a decade with bandaided features, wasn't integrated with
            Asurion's other systems, and couldn't scale to support growth.
          </p>
        </section>
      </div>
      <div className="case-content">
        <div className="feature-block fade-in-section">
          <div className="feature-image has-image">
            <img
              src="/assets/images/projects/nextgen/legacy-portal.gif"
              alt="Legacy uBreakiFix portal interface showing cluttered check-in screen"
            />
          </div>
          <div className="feature-text">
            <p className="feature-label">Challenge 01</p>
            <h4 className="feature-title">Slow &amp; Buggy Legacy System</h4>
            <p className="feature-description">
              Technicians complained the old system was slow, unreliable, and built on outdated tech
              stacks that couldn't keep pace with business needs.
            </p>
          </div>
        </div>
        <div className="feature-block reverse fade-in-section">
          <div className="feature-image has-image">
            <img
              src="/assets/images/projects/nextgen/next-gen-feature-card-legacy-1400x440.png"
              alt="Legacy system siloed from Asurion's integrated platforms"
            />
          </div>
          <div className="feature-text">
            <p className="feature-label">Challenge 02</p>
            <h4 className="feature-title">Siloed from Asurion Systems</h4>
            <p className="feature-description">
              The homegrown app wasn't integrated with Asurion's inventory, supply chain, or other
              internal applications—creating data inconsistencies and manual workarounds across
              teams.
            </p>
          </div>
        </div>
        <div className="feature-block fade-in-section">
          <div className="feature-image has-image">
            <img
              src="/assets/images/projects/nextgen/next-gen-feature-card-tech-training-workflow-1400x440.png"
              alt="Technician training workflow showing manual steps in the legacy system"
            />
          </div>
          <div className="feature-text">
            <p className="feature-label">Challenge 03</p>
            <h4 className="feature-title">2 Weeks Just to Learn the System</h4>
            <p className="feature-description">
              New technicians needed 2 weeks of training before they could work
              independently—because the system wasn't intuitive and most actions were manual.
              Changing repair statuses, selecting client programs, applying the right pricing—all
              required memorizing steps instead of the system guiding you through them.
            </p>
          </div>
        </div>
      </div>
      <div className="case-content">
        <p
          className="case-section-title fade-in-section"
          style={{ textAlign: "center", marginBottom: "var(--space-lg)" }}
        >
          Design Principles
        </p>
        <div className="highlight-grid fade-in-section">
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-scale-frame-enlarge"></i>
            </div>
            <h4 className="highlight-title">Adaptable and Scalable</h4>
            <p className="highlight-text">
              Adapt to business needs and quickly ramp up new programs and offerings that increase
              value for customers.
            </p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-compass"></i>
            </div>
            <h4 className="highlight-title">Guided and Helpful</h4>
            <p className="highlight-text">
              Guide store technicians through their tasks so they don't require much training or
              tenure.
            </p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-flash"></i>
            </div>
            <h4 className="highlight-title">Simple and Efficient</h4>
            <p className="highlight-text">Do things faster with fewer clicks and steps.</p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-brain"></i>
            </div>
            <h4 className="highlight-title">Smart and Proactive</h4>
            <p className="highlight-text">
              Anticipate what customers or technicians need before they ask.
            </p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-shield-check"></i>
            </div>
            <h4 className="highlight-title">Reliable</h4>
            <p className="highlight-text">
              The system can be trusted to do its job, so technicians can focus on theirs.
            </p>
          </div>
        </div>
      </div>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">The Approach</p>
          <h3>Deep research, early sharing, and relentless focus on jobs to be done</h3>
          <p>
            I started by deeply understanding our technicians' pain points and the business goals of
            our franchisee network. I visited stores, interviewed technicians, owners, and customers
            throughout the entire process—not just at the beginning.
          </p>
          <p>
            I pushed the design, product, and engineering teams to share early prototypes and get
            feedback fast. We built service blueprints for our most common store experiences with
            product, operations, and engineering. I led workshops with store technicians, owners,
            executives from both Asurion and uBreakiFix, and operations teams.
          </p>
        </section>
      </div>
      <div className="case-content">
        <div className="feature-block reverse fade-in-section">
          <div className="feature-image has-image">
            <img
              src="/assets/images/projects/nextgen/next-gen-feature-card-1400x440.png"
              alt="Service blueprint mapping customer journey and touchpoints"
            />
          </div>
          <div className="feature-text">
            <p className="feature-label">Process</p>
            <h4 className="feature-title">Service Blueprinting</h4>
            <p className="feature-description">
              Our team built service blueprints for the most common store experiences, mapping the
              entire customer journey and identifying pain points across product, operations, and
              engineering touchpoints.
            </p>
          </div>
        </div>
      </div>
      <div className="case-content">
        <div className="case-image image-hero fade-in-section">
          <img
            src="/assets/images/projects/nextgen/next-gen-feature-block-1200x700.png"
            alt="Next-Gen Portal final design core workflow screens"
          />
        </div>
      </div>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">The Solution</p>
          <h3>A modern platform built for speed, clarity, and scale</h3>
          <p>
            We designed and built a completely new application that transforms how stores
            operate—from customer check-in to repair completion to payment processing.
          </p>
        </section>
      </div>
      <div className="case-content">
        <div className="highlight-grid fade-in-section">
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-precision-tool"></i>
            </div>
            <h4 className="highlight-title">Single Source of Truth</h4>
            <p className="highlight-text">
              Built on Microsoft D365 for parts, pricing, availability, and ordering—no more data
              silos.
            </p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-ease-curve-control-points"></i>
            </div>
            <h4 className="highlight-title">Simplified Experience</h4>
            <p className="highlight-text">
              Clean interface where technicians easily understand what to do—without 2 weeks of
              training.
            </p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-component"></i>
            </div>
            <h4 className="highlight-title">Design System Powered</h4>
            <p className="highlight-text">
              Using Asurion's UI components to reduce dev time and create consistency.
            </p>
          </div>
        </div>
        <div className="feature-block fade-in-section">
          <div className="feature-image has-image">
            <img
              src="/assets/images/projects/nextgen/customer-search-check-in.gif"
              alt="New portal dashboard with quick actions and arrivals calendar"
            />
          </div>
          <div className="feature-text">
            <p className="feature-label">Feature</p>
            <h4 className="feature-title">Better Customer Experiences</h4>
            <p className="feature-description">
              Price estimate feature for instant quotes, Pay by Link for upsells and deposits over
              the phone, and improved search so technicians find what they need fast.
            </p>
          </div>
        </div>
        <div className="feature-block reverse fade-in-section">
          <div className="feature-image has-image">
            <img
              src="/assets/images/projects/nextgen/asurion-connected.png"
              alt="uBreakiFix connected to Apple, Samsung, Google, Amazon and other major partners"
            />
          </div>
          <div className="feature-text">
            <p className="feature-label">Feature</p>
            <h4 className="feature-title">Configurable for New Partners</h4>
            <p className="feature-description">
              A platform that can onboard new clients like Amazon and Google, and new programs like
              AT&amp;T in-store pickup, in days instead of months.
            </p>
          </div>
        </div>
      </div>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">My Role</p>
          <h3>Leading design from 0 to 1</h3>
          <p>
            I was the design lead on this project from the very beginning—taking it from 0 to 1. I
            built and managed a team of 4 designers while also establishing a culture of sharing,
            open feedback, and high design craft. I pushed for customer-facing-level quality for our
            internal tools.
          </p>
          <p>
            I partnered with operations leaders, product managers, and engineering leads to set the
            vision, create long and short-term strategies, and improve processes to deliver faster.
          </p>
          <div className="role-list">
            <span className="role-tag">0→1 Design Leadership</span>{" "}
            <span className="role-tag">Team Building</span>{" "}
            <span className="role-tag">Service Design</span>{" "}
            <span className="role-tag">User Research</span>{" "}
            <span className="role-tag">Design Systems</span>{" "}
            <span className="role-tag">Stakeholder Workshops</span>{" "}
            <span className="role-tag">Strategy &amp; Vision</span>
          </div>
        </section>
      </div>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">How We Worked</p>
          <h3>Staying aligned across a complex, multi-year effort</h3>
          <p>
            Design reviews happened weekly with the full team, creating a regular cadence for
            critique and alignment. Feedback loops with technicians and field partners were
            structured through scheduled ride-alongs and monthly check-ins, keeping the team
            grounded in real workflows. I kept the team engaged by connecting individual
            contributions to the broader product vision and creating space for designers to take
            ownership of key experience areas.
          </p>
        </section>
      </div>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">The Leadership Challenge</p>
          <h3>Changing how design was perceived</h3>
          <p>
            The hardest part of Next-Gen Portal wasn't the design — it was the organizational
            dynamics surrounding it.
          </p>
          <p>
            The product and operations teams wanted to rebuild what stores already had, feature for
            feature. That instinct was understandable, but recreating a decade of accumulated
            complexity wasn't going to solve the problems technicians faced every day. Pushing back
            on that — respectfully, persistently, and with evidence — was one of the most important
            things I did on this project. The design principles became our shared language for those
            conversations.
          </p>
          <p>
            Engineering presented a different friction. They operated in a waterfall model,
            expecting fully resolved designs before writing a single line of code. I advocated
            continuously for a more iterative approach — ship something real, learn from technicians
            in actual stores, and adjust. By launch, design had moved from a service function to a
            strategic partner, regularly consulted on roadmap decisions and executive presentations.
          </p>
        </section>
      </div>
      <div className="case-content">
        <div className="impact-section fade-in-section">
          <p className="case-section-title">Impact</p>
          <h3>Powering 680+ stores nationwide</h3>
          <p style={{ color: "var(--text-secondary)", maxWidth: "600px" }}>
            The new platform is now the operating system for uBreakiFix's entire retail network,
            enabling faster customer service, simpler operations, and rapid partner onboarding.
          </p>
          <div className="impact-grid">
            <div className="impact-card">
              <p className="impact-value">680+</p>
              <p className="impact-label">Stores nationwide</p>
            </div>
            <div className="impact-card">
              <p className="impact-value">50%</p>
              <p className="impact-label">Reduction in training time</p>
            </div>
            <div className="impact-card">
              <p className="impact-value">1 week</p>
              <p className="impact-label">To onboard new partners vs 2 months</p>
            </div>
          </div>
        </div>
      </div>
      <div className="case-content">
        <section className="video-section fade-in-section">
          <div
            className="case-content-narrow"
            style={{ padding: "0", marginBottom: "var(--space-lg)" }}
          >
            <p className="case-section-title">See It In Action</p>
            <h3>Hear from the technicians who use it every day</h3>
          </div>
          <div className="video-card" id="videoTrigger" data-video-id="nTJC3Lid1MQ">
            <div className="video-card-content">
              <div className="video-play-btn">
                <div className="video-play-icon"></div>
              </div>
              <p className="video-card-label">Play video</p>
            </div>
          </div>
        </section>
      </div>
      <div className="video-modal" id="videoModal">
        <div className="video-modal-overlay" id="videoModalOverlay"></div>
        <div className="video-modal-wrapper">
          <div className="video-modal-header">
            <div className="video-modal-info">
              <h4 className="video-modal-title">Next-Gen Portal: In Their Own Words</h4>
              <p className="video-modal-description">
                uBreakiFix technicians share how the redesigned platform transformed their daily
                workflow—from faster check-ins to streamlined repairs.
              </p>
            </div>
            <button
              className="video-modal-close"
              id="videoModalClose"
              aria-label="Close video"
            ></button>
          </div>
          <div className="video-modal-player">
            <iframe
              id="videoIframe"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <p className="video-modal-hint">
            Press <kbd>Esc</kbd> to close
          </p>
        </div>
      </div>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">Reflection</p>
          <h3>What I'd Do Differently</h3>
          <p>
            I wish we'd shipped faster and been less risk averse. The caution that came from
            replacing a mature, decade-old system was understandable — but it slowed our learning.
            Earlier launches, even imperfect ones, would have given us real signal sooner and let us
            adjust while we still had room to maneuver. The best design teams aren't the ones that
            get it right the first time. They're the ones that learn the fastest.
          </p>
        </section>
      </div>
      <section className="next-project">
        <p className="next-project-label">Next Project</p>
        <h2 className="next-project-title">Visual Call Pacing</h2>
        <a className="next-project-link" href="/projects/case-study-call-pacing.html">
          View Case Study <span>→</span>
        </a>
      </section>
    </>
  );
}
