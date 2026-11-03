import type { Metadata } from "next";
import { PasswordGate } from "@/components/password-gate";
import { SiteNav } from "@/components/site-nav";

export const metadata: Metadata = {
  title: "Visual Call Pacing | De Azua Design",
  robots: { index: false, follow: false },
};

export default function CallPacingPage() {
  return (
    <>
      <PasswordGate />
      <SiteNav />
      <section className="case-hero">
        <div
          className="case-hero-gradient"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 20% 40%, rgba(61, 220, 151, 0.3) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 20%, rgba(234, 179, 8, 0.22) 0%, transparent 50%), radial-gradient(ellipse 50% 50% at 50% 80%, rgba(250, 82, 82, 0.2) 0%, transparent 50%)",
          }}
        ></div>
        <div className="case-hero-content">
          <a className="case-back" href="/#case-studies">
            ← Back to Case Studies
          </a>
          <p className="case-client">Asurion</p>
          <h1 className="case-title">Visual Call Pacing</h1>
          <p className="case-intro">
            Can a timer make calls shorter? We shipped a rough test to find out, learned what it got
            wrong, then redesigned it and took another 21 seconds off the average call.
          </p>
          <div className="case-image image-hero">
            <img
              src="/assets/images/projects/call-pacing/call-pacing-hero-2200x900.png"
              alt="Six call bar states showing the bar filling and shifting from green to amber to red as a call passes its target time"
            />
          </div>
          <div className="case-meta">
            <div className="meta-item">
              <p className="meta-label">Role</p>
              <p className="meta-value">Sr. Manager, Product Design</p>
            </div>
            <div className="meta-item">
              <p className="meta-label">Timeline</p>
              <p className="meta-value">2026 – Present</p>
            </div>
            <div className="meta-item">
              <p className="meta-label">Team</p>
              <p className="meta-value">Design, Product, Engineering</p>
            </div>
            <div className="meta-item">
              <p className="meta-label">Platform</p>
              <p className="meta-value">Web (Call Center)</p>
            </div>
          </div>
          <div className="case-meta-extended">
            <div className="meta-item">
              <p className="meta-label">My Focus</p>
              <p className="meta-value">
                Design direction for pacing, from the first test through the V1.5 redesign
              </p>
            </div>
            <div className="meta-item">
              <p className="meta-label">Key Challenge</p>
              <p className="meta-value">
                Shipping before it was pretty, then using what we learned to earn the redesign
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">The Challenge</p>
          <h3>Can a timer make calls shorter?</h3>
          <p>
            Have you ever looked up from a hard problem and realized the time got away from you?
            Same. Now imagine that with a customer waiting on the line. Agents had no live read on
            their pace; the feedback came after the call was over. So we asked: if they can see it
            in real time, will they pace themselves? No new scripts, no extra coaching. Just a
            timer.
          </p>
        </section>
      </div>
      <div className="case-content">
        <div className="feature-block fade-in-section">
          <div className="feature-image has-image">
            <img
              src="/assets/images/projects/call-pacing/call-pacing-first-test.png"
              alt="The first test: a small green timer pill reading 04:30 in the call bar of Expert Workspace"
            />
          </div>
          <div className="feature-text">
            <p className="feature-label">The First Test</p>
            <h4 className="feature-title">Shipped Fast, Not Pretty</h4>
            <p className="feature-description">
              An engineer vibe coded this in a few minutes, reusing an existing pill component as a
              lightweight test. I'm a designer, so of course I asked for a few more days. My
              partners said ship it and see. They were right.
            </p>
          </div>
        </div>
      </div>
      <div className="case-content">
        <div className="impact-section fade-in-section">
          <p className="case-section-title">Early Signals</p>
          <h3>Ship it. Learn. Then make it beautiful.</h3>
          <p style={{ color: "var(--text-secondary)", maxWidth: "600px" }}>
            We piloted with about 14 agents in Orlando in April. It worked better than I wanted to
            admit.
          </p>
          <div className="impact-grid">
            <div className="impact-card">
              <p className="impact-value">48 sec</p>
              <p className="impact-label">Faster calls in the pilot</p>
            </div>
            <div className="impact-card">
              <p className="impact-value">+2.9 pts</p>
              <p className="impact-label">Resolution rate in the pilot</p>
            </div>
            <div className="impact-card">
              <p className="impact-value">Held</p>
              <p className="impact-label">Sales</p>
            </div>
          </div>
        </div>
      </div>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">What We Learned</p>
          <h3>So we went all in. And we learned…</h3>
          <p>
            By July, pacing was live across two major carrier programs. Agents told us they liked
            seeing how they were doing, and that they wished they could see it better. Then we
            walked the floor and saw why.
          </p>
        </section>
      </div>
      <div className="case-content">
        <div className="feature-block reverse fade-in-section">
          <div className="feature-image has-image">
            <img
              src="/assets/images/projects/call-pacing/call-pacing-targets.png"
              alt="The V1 pill reading 19:13, with the 17:00 target shown only in a popover below it"
            />
          </div>
          <div className="feature-text">
            <p className="feature-label">Problem 01</p>
            <h4 className="feature-title">Agents Didn't See Their Targets</h4>
            <p className="feature-description">
              The pill counted up, and the target sat in a popover. To know how a call was going,
              agents had to stop and go look. (Not ideal while you're helping someone with their
              phone.)
            </p>
          </div>
        </div>
        <div className="feature-block fade-in-section">
          <div className="feature-image has-image">
            <img
              src="/assets/images/projects/call-pacing/call-pacing-floor.jpg"
              alt="A coach walking the call center floor past rows of agents at their desks"
            />
          </div>
          <div className="feature-text">
            <p className="feature-label">Problem 02</p>
            <h4 className="feature-title">Coaches Couldn't See It from Across the Room</h4>
            <p className="feature-description">
              Coaches walk the floor looking for agents who need help. From any real distance, that
              little pill disappeared.
            </p>
          </div>
        </div>
      </div>
      <div className="case-content">
        <p
          className="case-section-title fade-in-section"
          style={{ textAlign: "center", marginBottom: "var(--space-lg)" }}
        >
          Fix What's Not Working
        </p>
        <div className="highlight-grid fade-in-section">
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-wristwatch"></i>
            </div>
            <h4 className="highlight-title">Count Down from the Target</h4>
            <p className="highlight-text">
              Show the time left, so agents never have to do the math.
            </p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-eye"></i>
            </div>
            <h4 className="highlight-title">Make the Status More Visible</h4>
            <p className="highlight-text">
              Readable at a glance from the chair, and from across the room.
            </p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">
              <i className="iconoir-brain"></i>
            </div>
            <h4 className="highlight-title">Reduce the Cognitive Load</h4>
            <p className="highlight-text">
              No popovers and nothing to open. Agents stay in the conversation.
            </p>
          </div>
        </div>
      </div>
      <div className="case-content">
        <div className="case-image image-hero fade-in-section">
          <img
            src="/assets/images/projects/call-pacing/call-pacing-bar-states.png"
            alt="V1.5 call bars in amber At risk and red Behind states, with the color filling the whole bar"
          />
        </div>
      </div>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">The Solution</p>
          <h3>Let the whole bar do the talking</h3>
          <p>
            This was finally my few more days, and now we'd earned them. In V1.5, the whole call bar
            fills, shifts from green to amber to red, and counts down from the target. We left the
            logic alone, so a clean A/B test could tell us what the design was worth on its own.
          </p>
        </section>
      </div>
      <div className="case-content">
        <div className="impact-section fade-in-section">
          <p className="case-section-title">Impact</p>
          <h3>21 seconds per call, just from the redesign</h3>
          <p style={{ color: "var(--text-secondary)", maxWidth: "600px" }}>
            In a 50/50 test across 170,000+ calls, V1.5 beat V1 every week. Turns out making it
            beautiful was worth something. Sales ran slightly lower, so we're keeping an eye on it.
          </p>
          <div className="impact-grid">
            <div className="impact-card">
              <p className="impact-value">−21 sec</p>
              <p className="impact-label">Per call vs. V1 in an A/B test</p>
            </div>
            <div className="impact-card">
              <p className="impact-value">3 of 3</p>
              <p className="impact-label">Weeks V1.5 won</p>
            </div>
            <div className="impact-card">
              <p className="impact-value">500 hrs</p>
              <p className="impact-label">Estimated handle time saved per week at full rollout</p>
            </div>
          </div>
        </div>
      </div>
      <div className="case-content">
        <div className="feature-block reverse fade-in-section">
          <div className="feature-image has-image">
            <img
              src="/assets/images/projects/call-pacing/call-pacing-v2.png"
              alt="V2 concept: tapping I read it on the sales script starts a separate green sales timer"
            />
          </div>
          <div className="feature-text">
            <p className="feature-label">What's Next</p>
            <h4 className="feature-title">V2 Gives Selling Its Own Clock</h4>
            <p className="feature-description">
              One timer covers the whole call, so a great sales conversation looks like a slow call.
              In V2, the agent taps <q>I read it</q> on the sales script and a sales timer takes
              over. It's still a concept, so ask me how it goes.
            </p>
          </div>
        </div>
      </div>
      <div className="case-content">
        <p
          className="case-section-title fade-in-section"
          style={{ textAlign: "center", marginBottom: "var(--space-lg)" }}
        >
          Every Step: Measure, Learn, Adjust
        </p>
        <div className="highlight-grid fade-in-section">
          <div className="highlight-card">
            <h4 className="highlight-title">April</h4>
            <p className="highlight-text">Calls got faster → Scale it</p>
          </div>
          <div className="highlight-card">
            <h4 className="highlight-title">July</h4>
            <p className="highlight-text">Coaches couldn't see it → Design V1.5</p>
          </div>
          <div className="highlight-card">
            <h4 className="highlight-title">September</h4>
            <p className="highlight-text">V1.5 won by 21 seconds → Ship it to everyone</p>
          </div>
          <div className="highlight-card">
            <h4 className="highlight-title">October</h4>
            <p className="highlight-text">Some targets are off → Tune targets</p>
          </div>
        </div>
      </div>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">My Role</p>
          <h3>Best idea wins, whoever had it</h3>
          <p>
            On this one, it often wasn't me. An engineer built the first version, and my partners
            pushed us to ship it. I led design from there, working with product, engineering, and
            operations to turn what each test taught us into the next version.
          </p>
          <div className="role-list">
            <span className="role-tag">Design Strategy</span>{" "}
            <span className="role-tag">Interaction Design</span>{" "}
            <span className="role-tag">Field Research</span>{" "}
            <span className="role-tag">A/B Testing</span>{" "}
            <span className="role-tag">Cross-Functional Partnership</span>
          </div>
        </section>
      </div>
      <div className="case-content-narrow">
        <section className="case-section fade-in-section">
          <p className="case-section-title">Reflection</p>
          <h3>What I'd Tell Past Me</h3>
          <p>
            <strong>Ship small.</strong> The smallest thing that can teach you something is usually
            enough. <strong>Let data earn the polish.</strong> V1.5 got its shot because V1 proved
            the idea. <strong>Walk the floor.</strong> No dashboard told us coaches couldn't see the
            pill.
          </p>
          <p>I'll still ask for a few more days. I just wait until after the first test now.</p>
        </section>
      </div>
      <section className="next-project">
        <p className="next-project-label">Next Project</p>
        <h2 className="next-project-title">In-Store Claims Kiosk</h2>
        <a className="next-project-link" href="/projects/case-study-instore-kiosk.html">
          View Case Study <span>→</span>
        </a>
      </section>
    </>
  );
}
