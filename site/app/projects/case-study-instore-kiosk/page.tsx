import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";

export const metadata: Metadata = {
  title: "In-Store Claims Kiosk | De Azua Design",
  robots: { index: false, follow: false },
};

export default function InstoreKioskPage() {
  return (
    <>
      <SiteNav />
      <section className="case-hero">
        <div
          className="case-hero-gradient"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 20% 40%, rgba(240, 147, 251, 0.4) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 20%, rgba(245, 87, 108, 0.3) 0%, transparent 50%), radial-gradient(ellipse 50% 50% at 50% 80%, rgba(181, 126, 220, 0.15) 0%, transparent 50%)",
          }}
        ></div>
        <div className="case-hero-content">
          <a className="case-back" href="/#case-studies">
            ← Back to Case Studies
          </a>
          <p className="case-client">Asurion</p>
          <h1 className="case-title">In-Store Claims Kiosk</h1>
          <p className="case-intro">
            Bridging the gap between repair stores and claims systems—reducing claim resolution time
            from 45 minutes to under 10, while helping 10,000+ customers per month self-serve.
          </p>
          <div className="case-image image-hero">
            <img
              src="/assets/images/projects/claims/claims-hero-2200x900.png"
              alt="In-Store Claims Kiosk hero"
            />
          </div>
          <div className="case-meta">
            <div className="meta-item">
              <p className="meta-label">Role</p>
              <p className="meta-value">Principal Designer</p>
            </div>
            <div className="meta-item">
              <p className="meta-label">Timeline</p>
              <p className="meta-value">2021 – 2022</p>
            </div>
            <div className="meta-item">
              <p className="meta-label">Pilot</p>
              <p className="meta-value">20 Stores → All Corporate</p>
            </div>
            <div className="meta-item">
              <p className="meta-label">Platform</p>
              <p className="meta-value">Tablet Kiosk</p>
            </div>
          </div>
        </div>
      </section>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">My Role</p>
          <h3>Principal designer, from research to scale</h3>
          <p>
            I was the principal designer end-to-end—research planning, in-store visits and
            interviews, service design workshops, pilot strategy, and close collaboration with
            marketing on kiosk signage and tablet motion.
          </p>
        </section>
      </div>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">The Challenge</p>
          <h3>Rebranding stores daily—without the tools to help</h3>
          <p>
            In 2019, Asurion began rebranding uBreakiFix locations to Asurion-branded stores. As the
            rebrand rolled out, customers began walking in expecting help with their insurance
            claims—but stores weren't equipped to assist. Regulatory constraints meant employees
            couldn't file claims on customers' behalf (they aren't licensed insurance adjusters),
            and store systems didn't connect to Asurion's claims platform.
          </p>
          <p>
            These pain points surfaced through a combination of in-store visits, technician
            interviews, and direct feedback from store owners—making it clear the gap between brand
            promise and in-store reality was widening fast.
          </p>
          <p>
            Store technicians were spending <strong>up to 45 minutes</strong> trying to help
            customers resolve claim issues—time they couldn't afford with staffing constraints and
            increased non-repair responsibilities. The result? Frustrated customers, overwhelmed
            technicians, and a growing gap between brand promise and reality.
          </p>
        </section>
      </div>
      <div className="case-content">
        <div className="highlight-grid fade-in-section">
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-chat-bubble"></i>
            </div>
            <h4 className="highlight-title">The Confused Customer</h4>
            <p className="highlight-text">
              <q>
                I have an Asurion protection plan and saw your store on my way to work. Can you fix
                my phone?
              </q>
            </p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-chat-bubble"></i>
            </div>
            <h4 className="highlight-title">The Uncertain Customer</h4>
            <p className="highlight-text">
              <q>
                I need to get my screen fixed, but I don't remember if I have a protection plan.
              </q>
            </p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-chat-bubble"></i>
            </div>
            <h4 className="highlight-title">The Stuck Customer</h4>
            <p className="highlight-text">
              <q>I think I completed my claim, but I'm not sure. Can you help me with it?</q>
            </p>
          </div>
        </div>
      </div>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <blockquote className="case-quote">
            <p>You need to call Asurion, your carrier, or go to phoneclaim.com</p>
          </blockquote>
          <p>
            This was the only answer technicians could give—even though customers were standing
            right in front of them, in an Asurion store, expecting help. The disconnect between
            brand promise and operational reality was creating friction at every touchpoint.
          </p>
        </section>
      </div>
      <div className="case-content">
        <div className="feature-block fade-in-section">
          <div className="feature-image has-image">
            <img
              src="/assets/images/projects/claims/claims-feature-block-compliance-1200x700.png"
              alt="Regulatory and compliance barriers in claims"
            />
          </div>
          <div className="feature-text">
            <p className="feature-label">Challenge 01</p>
            <h4 className="feature-title">Regulatory &amp; Compliance Barriers</h4>
            <p className="feature-description">
              Store employees aren't licensed insurance adjustors. Filing claims on behalf of
              customers could be classified as fraud—so they legally couldn't help, even when they
              wanted to.
            </p>
          </div>
        </div>
        <div className="feature-block reverse fade-in-section">
          <div className="feature-image has-image">
            <img
              src="/assets/images/projects/claims/claims-feature-block-disconnected-1200x700.png"
              alt="Disconnected systems—store systems don't communicate with claims platform"
            />
          </div>
          <div className="feature-text">
            <p className="feature-label">Challenge 02</p>
            <h4 className="feature-title">Disconnected Systems</h4>
            <p className="feature-description">
              Stores are a fulfillment path for claims, but their systems don't communicate with
              Asurion's claims platform. Technicians had no visibility into claim status or ability
              to take action.
            </p>
          </div>
        </div>
        <div className="feature-block fade-in-section">
          <div className="feature-image has-image">
            <img
              src="/assets/images/projects/claims/claims-feature-block-repair-2-1200x700.png"
              alt="Technicians spread thin—time spent on claim issues vs repairs"
            />
          </div>
          <div className="feature-text">
            <p className="feature-label">Challenge 03</p>
            <h4 className="feature-title">Technicians Spread Thin</h4>
            <p className="feature-description">
              Store technicians were spending up to 45 minutes per customer on claim issues—time
              they couldn't afford with staffing constraints and increased non-repair
              responsibilities post-rebrand.
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
              <i className="iconoir-spark"></i>
            </div>
            <h4 className="highlight-title">Simple</h4>
            <p className="highlight-text">
              Simplify the in-store claims experience for customers and technicians alike.
            </p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-shield-check"></i>
            </div>
            <h4 className="highlight-title">Empowering</h4>
            <p className="highlight-text">
              Explore short- and long-term solutions for self-service by evaluating the tools we
              need.
            </p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-flash"></i>
            </div>
            <h4 className="highlight-title">Efficient</h4>
            <p className="highlight-text">
              Enable customers to take their next step in claims and maximize technicians' time on
              repairs.
            </p>
          </div>
        </div>
      </div>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">The Approach</p>
          <h3>Service blueprints to align stakeholders at odds</h3>
          <p>
            We started by mapping the service experience with store employees, operations, and the
            claims product team using service blueprints. A <strong>current-state blueprint</strong>{" "}
            diagnosed where the journey broke down—surfacing pain points and compliance gaps so
            every stakeholder saw the same facts. A <strong>future-state blueprint</strong> then
            described the target experience we wanted to design toward, giving us a shared reference
            to evaluate concepts and handoff moments.
          </p>
          <p>
            The ideal experience we identified: give customers an easy way to file and manage claims
            without compliance issues by warmly handing them off to an in-store tablet for
            self-service.
          </p>
        </section>
      </div>
      <div className="case-content">
        <div className="feature-block reverse fade-in-section">
          <div className="feature-image has-image">
            <img
              src="/assets/images/projects/claims/claims-feature-block-service%20design-1200x700.png"
              alt="Service design blueprint used to align stakeholders"
            />
          </div>
          <div className="feature-text">
            <p className="feature-label">Process</p>
            <h4 className="feature-title">Collaborative Service Design</h4>
            <p className="feature-description">
              I led service design workshop sessions with store teams, operations, and product to
              build blueprints together—identifying the solution hand-in-hand rather than dictating
              from above.
            </p>
          </div>
        </div>
        <div className="feature-block fade-in-section">
          <div className="feature-image has-image">
            <img
              src="/assets/images/projects/claims/claims-feature-block-pilot-1200x700.png"
              alt="In-store pilot setup for tabletop vs standing kiosk"
            />
          </div>
          <div className="feature-text">
            <p className="feature-label">Process</p>
            <h4 className="feature-title">20-Store Pilot</h4>
            <p className="feature-description">
              We needed to validate the experience and form factor across 20 stores. Design had
              advocated for handheld tablets—familiar from Apple Store and Warby Parker
              experiences—while operations prioritized theft concerns and wanted customers to
              self-serve at standing kiosks. In the pilot, many customers didn't realize they could
              use the kiosk on their own, and technicians still walked over to help them get
              started—showing that self-service alone wasn't holding up. Those observations helped
              resolve the disagreement with evidence and set up the shift toward handheld tablets
              after scale.
            </p>
          </div>
        </div>
      </div>
      <div className="case-content">
        <section className="video-section fade-in-section" aria-label="Final design video">
          <div
            className="video-card"
            id="videoTrigger"
            data-video-id="d3XT4VLOe7c"
            role="button"
            tabIndex={0}
            aria-label="Play final design video"
          >
            <div className="video-card-content">
              <div className="video-play-btn" aria-hidden="true">
                <div className="video-play-icon"></div>
              </div>
              <p className="video-card-label">Final design: Tablet kiosk interface</p>
            </div>
          </div>
        </section>
      </div>
      <div className="video-modal" id="videoModal">
        <div className="video-modal-overlay" id="videoModalOverlay"></div>
        <div className="video-modal-wrapper">
          <div className="video-modal-header">
            <div className="video-modal-info">
              <h4 className="video-modal-title">In-Store Claims Kiosk: Final Design</h4>
              <p className="video-modal-description">
                Walkthrough of the tablet kiosk experience used for in-store claim self-service.
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
          <p className="case-section-title">The Solution</p>
          <h3>Knowledge is power, confidence is key</h3>
          <p>
            We designed a solution that empowers both technicians and customers. The in-store
            technician can now quickly identify if a customer has a protection plan and guide them
            to file or resume a claim on the tablet. The customer gets knowledgeable feedback on
            what's wrong with their device—helping them file claims correctly the first time.
          </p>
          <p>
            Filing claims in-store needed to be tailored to customers already at a store. We removed
            unnecessary steps like location selection (it defaults to the current store) and
            simplified identity verification since the customer is present. The result: claim
            resolution in under 10 minutes, down from 45.
          </p>
        </section>
      </div>
      <div className="case-content">
        <div className="highlight-grid fade-in-section">
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-search"></i>
            </div>
            <h4 className="highlight-title">Knowledge is Power</h4>
            <p className="highlight-text">
              Technicians can quickly identify if customers have protection plans and guide them to
              the right next step.
            </p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-shield-check"></i>
            </div>
            <h4 className="highlight-title">Build Confidence</h4>
            <p className="highlight-text">
              Customers get clear guidance on device issues, helping them file claims correctly the
              first time.
            </p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-link"></i>
            </div>
            <h4 className="highlight-title">Warm Handoff</h4>
            <p className="highlight-text">
              Technicians identify claim issues and warmly hand customers to the tablet—maintaining
              the human connection.
            </p>
          </div>
        </div>
        <div className="feature-block fade-in-section">
          <div className="feature-image has-image">
            <img
              src="/assets/images/projects/claims/claims-feature-block-choose-1200x700.png"
              alt="Evolution from kiosk to handheld tablet experience"
            />
          </div>
          <div className="feature-text">
            <p className="feature-label">Evolution</p>
            <h4 className="feature-title">From Kiosk to Handheld</h4>
            <p className="feature-description">
              After pilot feedback, we scaled to all corporate stores with an updated handheld
              tablet. Moving to handheld was a collaborative call the full team made together—I
              supported it based on what we saw in stores: tablets were easier for technicians to
              use with customers, and the pilot had already shown that kiosk-only self-service
              wasn't enough on its own. The handheld flow created a more personal 1:1 experience—the
              best of both worlds.
            </p>
          </div>
        </div>
      </div>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">My Role</p>
          <h3>Principal designer, from research to scale</h3>
          <p>
            I was the principal designer on this project, collaborating with the Director of User
            Research to craft the research plan and conducting store interviews with customers and
            technicians firsthand. I partnered with the marketing design team on kiosk signage and
            the tablet animation, and led service design workshop sessions that aligned stakeholders
            across operations, stores, and product.
          </p>
          <div className="role-list">
            <span className="role-tag">Principal Designer</span>{" "}
            <span className="role-tag">Service Design</span>{" "}
            <span className="role-tag">User Research</span>{" "}
            <span className="role-tag">Workshop Facilitation</span>{" "}
            <span className="role-tag">Motion Design Collaboration</span>{" "}
            <span className="role-tag">Pilot Strategy</span>
          </div>
        </section>
      </div>
      <div className="case-content">
        <div className="impact-section fade-in-section">
          <p className="case-section-title">Impact</p>
          <h3>From 45 minutes to under 10</h3>
          <p style={{ color: "var(--text-secondary)", maxWidth: "600px" }}>
            Built collaboratively through co-creation workshops, store pilots, and feedback
            sessions—the solution aligned product and operations on success metrics and scaled to
            all corporate stores.
          </p>
          <div className="impact-grid">
            <div className="impact-card">
              <p className="impact-value">&lt;10 min</p>
              <p className="impact-label">Claim resolution time (down from 45 mins)</p>
            </div>
            <div className="impact-card">
              <p className="impact-value">10K+</p>
              <p className="impact-label">Customers helped per month</p>
            </div>
            <div className="impact-card">
              <p className="impact-value">$100K+</p>
              <p className="impact-label">Saved in call/chat deflection</p>
            </div>
          </div>
        </div>
      </div>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">Reflection</p>
          <h3>What I learned</h3>
          <p>
            Co-creation workshops, store pilots, and continuous feedback sessions were the key to
            this project's success. We aligned stakeholders who were initially at odds by building
            service blueprints together—when everyone sees the same map of the problem, solutions
            emerge collaboratively and buy-in comes naturally.
          </p>
          <p>
            This project reinforced that the best solutions come from involving frontline employees
            in the design process. The experts who face these problems daily had insights that no
            amount of desk research could uncover.
          </p>
        </section>
      </div>
      <section className="next-project">
        <p className="next-project-label">Next Project</p>
        <h2 className="next-project-title">Disney Guest Service Suite</h2>
        <a className="next-project-link" href="/projects/case-study-disney-guest-service.html">
          View Case Study <span>→</span>
        </a>
      </section>
    </>
  );
}
