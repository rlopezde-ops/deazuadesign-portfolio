import type { Metadata } from "next";
import { PasswordGate } from "@/components/password-gate";
import { SiteNav } from "@/components/site-nav";

export const metadata: Metadata = {
  title: "Expert Workspace | De Azua Design",
  robots: { index: false, follow: false },
};

export default function ExpertWorkspacePage() {
  return (
    <>
      <PasswordGate />
      <SiteNav />
      <section className="case-hero">
        <div
          className="case-hero-gradient"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 20% 40%, rgba(99, 102, 241, 0.4) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 20%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), radial-gradient(ellipse 50% 50% at 50% 80%, rgba(0, 245, 212, 0.2) 0%, transparent 50%)",
          }}
        ></div>
        <div className="case-hero-content">
          <a className="case-back" href="/#case-studies">
            ← Back to Case Studies
          </a>
          <p className="case-client">Asurion</p>
          <h1 className="case-title">Expert Workspace</h1>
          <p className="case-intro">
            Redesigning the primary tool for 10,000+ help desk and claims agents—a conversational,
            AI-powered workspace that makes every customer interaction feel simple, personal, and
            white-glove.
          </p>
          <div className="case-image image-hero fade-in-section">
            <img
              src="/assets/images/projects/expert-workspace/asurion-expert-workspace.png"
              alt="Expert Workspace"
            />
          </div>
          <div className="case-meta">
            <div className="meta-item">
              <p className="meta-label">Role</p>
              <p className="meta-value">Sr. Manager, Product Design</p>
            </div>
            <div className="meta-item">
              <p className="meta-label">Timeline</p>
              <p className="meta-value">2025 – Present</p>
            </div>
            <div className="meta-item">
              <p className="meta-label">Team</p>
              <p className="meta-value">2 Designers</p>
            </div>
            <div className="meta-item">
              <p className="meta-label">Platform</p>
              <p className="meta-value">Web (Call Center &amp; Messaging)</p>
            </div>
          </div>
          <div className="case-meta-extended">
            <div className="meta-item">
              <p className="meta-label">My Focus</p>
              <p className="meta-value">
                Establishing the product vision, defining design principles, and building the AI
                guidance methodology that will shape how the system communicates with agents
              </p>
            </div>
            <div className="meta-item">
              <p className="meta-label">Key Challenge</p>
              <p className="meta-value">
                Cutting through 18 months of sales-driven product decisions to establish a
                user-centered vision — in the middle of a leadership and org structure transition
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">The Vision</p>
          <h3>Less typey, more talkey</h3>
          <p>
            Asurion's help desk and claims agents handle millions of customer interactions every
            year—troubleshooting tech issues, filing insurance claims, and resolving problems across
            chat and voice. Their current tools are fragmented, require too much manual work, and
            make it hard to deliver the fast, personal service customers expect.
          </p>
          <p>
            Expert Workspace reimagines this experience. When an agent connects with a customer, the
            system works quietly in the background—bringing together the right tools, the right
            insights, and the right next steps. It should feel like a single, thoughtful
            conversation backed by deep expertise, showing customers that we know them and we're
            here to help.
          </p>
        </section>
      </div>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">The Leadership Challenge</p>
          <h3>Resetting direction after 18 months of drift</h3>
          <p>
            Expert Workspace had been shaped by sales priorities for over a year. The product team
            was conflict-averse and reactive — caught between internal stakeholder pressure and a
            tool that wasn't working for the agents using it every day.
          </p>
          <p>
            I started by defining a clear product vision and design principles, aligned design and
            product leadership around them, then took them to operations and sales to build broader
            organizational buy-in from the top down rather than waiting for alignment to trickle up
            from PMs.
          </p>
          <p>
            The work is still early, but the direction is set and the first launches — shift
            summaries, post-call coaching, and end-of-shift performance recaps — will give agents
            visibility into their own performance for the first time.
          </p>
        </section>
      </div>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">Design Strategy</p>
          <h3>Connecting near-term launches to long-term vision</h3>
          <p>
            Features were prioritized by mapping agent pain points against business impact —
            starting with the moments that most directly affected performance visibility and
            coaching quality. The design process combined lightweight discovery sprints with rapid
            prototyping, keeping the feedback loop tight between agents, team leads, and product.
            Next steps include expanding the workspace to support real-time coaching prompts and
            deeper integration with quality assurance workflows.
          </p>
        </section>
      </div>
      <div className="case-content">
        <p
          className="case-section-title fade-in-section"
          style={{ textAlign: "center", marginBottom: "var(--space-lg)" }}
        >
          Guiding Principles
        </p>
        <div className="highlight-grid fade-in-section">
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-eye"></i>
            </div>
            <h4 className="highlight-title">See What You Need</h4>
            <p className="highlight-text">
              Guidance, tools, and next steps in one clear workspace—so agents stay focused on the
              conversation, not the system.
            </p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-link"></i>
            </div>
            <h4 className="highlight-title">Know the Customer</h4>
            <p className="highlight-text">
              Instantly recognize who we're helping and what they need—delivering a personalized,
              high-touch experience from the first message.
            </p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-keyframes"></i>
            </div>
            <h4 className="highlight-title">Build Clarity</h4>
            <p className="highlight-text">
              Plain, friendly language and transparent AI recommendations—clarity turns complexity
              into confidence.
            </p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-flash"></i>
            </div>
            <h4 className="highlight-title">Remove Friction</h4>
            <p className="highlight-text">
              Automate the busywork so agents can focus on real human connection—the quality that
              defines Asurion's service.
            </p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-graph-up"></i>
            </div>
            <h4 className="highlight-title">Improve Together</h4>
            <p className="highlight-text">
              A platform that learns from millions of interactions while coaching agents in the
              moment to build confidence and sharpen skills.
            </p>
          </div>
        </div>
      </div>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">My Role</p>
          <h3>Defining the future of agent tools</h3>
          <p>
            I'm leading design strategy for Expert Workspace—defining the principles and vision that
            will shape how 10,000+ help desk and claims agents interact with customers every day.
            This means setting the direction for an AI-powered platform that needs to feel simple on
            the surface while being sophisticated underneath.
          </p>
          <p>
            I work closely with product, engineering, and operations leadership to align on
            strategy, validate concepts with frontline agents, and ensure we're building tools that
            genuinely improve the customer experience—not just automate it.
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
      <section className="next-project">
        <p className="next-project-label">Next Project</p>
        <h2 className="next-project-title">Next-Gen Portal</h2>
        <a className="next-project-link" href="/projects/case-study-nextgen-portal.html">
          View Case Study <span>→</span>
        </a>
      </section>
    </>
  );
}
