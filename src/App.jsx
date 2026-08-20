import { useMemo } from "react";
import EVENTS from "./data/events.json";

function formatYear(d) {
  return new Date(d + "T00:00:00").getFullYear();
}

function formatRange(start, end) {
  return end ? `${formatYear(start)} – ${formatYear(end)}` : `${formatYear(start)}`;
}

function Entry({ e }) {
  return (
    <div
      className="entry"
      style={{ position: "relative", padding: "18px 16px 18px 20px", marginBottom: 4 }}
    >
      <div
        style={{
          position: "absolute",
          left: -24 + 1,
          top: 24,
          width: 9,
          height: 9,
          borderRadius: "50%",
          background: e.muted ? "#55534E" : "#2aeccf",
          border: "2px solid #262624",
        }}
      />
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "baseline",
          flexWrap: "wrap",
          marginBottom: 4,
        }}
      >
        <span
          className="mono"
          style={{ fontSize: 12, color: e.muted ? "#8A8779" : "#2aeccf" }}
        >
          {formatRange(e.date, e.end_date)}
        </span>
        {e.type === "cpd" && (
          <span
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#8A8779",
              border: "1px solid #45433E",
              padding: "1px 6px",
            }}
          >
            {e.category}
          </span>
        )}
      </div>
      <h3
        style={{
          margin: "0 0 4px",
          fontSize: 14,
          fontWeight: 500,
          fontStyle: e.muted ? "italic" : "normal",
          color: e.muted ? "#C4C1B8" : "#F5F4F0",
        }}
      >
        {e.title}
        {(e.org || e.location) && (
          <span style={{ color: "#8A8779", fontWeight: 400, fontStyle: "normal" }}>
            {" "}
            — {[e.org, e.location].filter(Boolean).join(" · ")}
          </span>
        )}
      </h3>
      {e.description && (
        <p style={{ margin: "0 0 8px", fontSize: 14, color: "#C4C1B8" }}>{e.description}</p>
      )}
      {e.tags && e.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {e.tags.map((tag) => (
            <span key={tag} className="mono" style={{ fontSize: 10, color: "#6B6A63" }}>
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Timeline({ entries }) {
  return (
    <div style={{ position: "relative", paddingLeft: 24 }}>
      <div
        style={{
          position: "absolute",
          left: 4,
          top: 6,
          bottom: 6,
          width: 1,
          background: "#45433E",
        }}
      />
      {entries.map((e) => (
        <Entry key={e.id} e={e} />
      ))}
    </div>
  );
}

export default function CareerLog() {
  const projects = useMemo(
    () =>
      EVENTS.filter((e) => e.type === "project").sort((a, b) =>
        b.date.localeCompare(a.date)
      ),
    []
  );
  const work = useMemo(
    () => EVENTS.filter((e) => e.type === "job").sort((a, b) => b.date.localeCompare(a.date)),
    []
  );
  const education = useMemo(
    () =>
      EVENTS.filter((e) => e.type === "education").sort((a, b) =>
        b.date.localeCompare(a.date)
      ),
    []
  );
  const cpd = useMemo(
    () => EVENTS.filter((e) => e.type === "cpd").sort((a, b) => b.date.localeCompare(a.date)),
    []
  );

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#262624",
        color: "#E8E6DC",
        fontFamily: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        .mono { font-family: 'IBM Plex Mono', monospace; }
        .entry:hover { background: #2E2D2A; }
        .nav-link {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: 12px;
          letter-spacing: 0.04em;
          color: #2aeccf;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .section-heading {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #F5F4F0;
          margin: 0 0 16px;
        }
      `}</style>

      {/* Title block */}
      <header
        style={{
          borderBottom: "2px solid #45433E",
          padding: "40px 24px 24px",
          maxWidth: 880,
          margin: "0 auto",
        }}
      >
        <div
          className="mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#8A8779",
            marginBottom: 10,
          }}
        >
          Professional Log — Rev.{" "}
          {new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })}
        </div>
        <h1
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: "clamp(28px, 5vw, 40px)",
            margin: "0 0 8px",
            letterSpacing: "-0.01em",
            color: "#F5F4F0",
          }}
        >
          Alfredo E. Job
        </h1>
        <p style={{ margin: "0 0 4px", fontSize: 15, color: "#C4C1B8", maxWidth: 560 }}>
          Industrial Engineer (UTN) · M.Sc. Statistics &amp; Operations Research (RMIT)
        </p>
        <p className="mono" style={{ margin: "0 0 16px", fontSize: 12, color: "#8A8779" }}>
          Supply Chain &amp; Operations
        </p>
        <div style={{ display: "flex", gap: 20 }}>
          <button className="mono nav-link" onClick={() => scrollTo("work-projects")}>
            Work &amp; Projects →
          </button>
          <button className="mono nav-link" onClick={() => scrollTo("education-cpd")}>
            Education &amp; CPD →
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 880, margin: "0 auto", padding: "40px 24px 80px" }}>
        <section id="work-projects" style={{ marginBottom: 56 }}>
          <h2 className="section-heading">Projects</h2>
          <Timeline entries={projects} />

          <h2 className="section-heading" style={{ marginTop: 40 }}>
            Work
          </h2>
          <Timeline entries={work} />
        </section>

        <section id="education-cpd">
          <h2 className="section-heading">Education</h2>
          <Timeline entries={education} />

          <h2 className="section-heading" style={{ marginTop: 40 }}>
            CPD
          </h2>
          <Timeline entries={cpd} />
        </section>
      </main>

      <footer
        style={{
          borderTop: "1px solid #45433E",
          padding: "20px 24px",
          maxWidth: 880,
          margin: "0 auto",
        }}
      >
        <p className="mono" style={{ fontSize: 11, color: "#6B6A63", margin: 0 }}>
          {EVENTS.length} entries logged · data structure defined in events.json
        </p>
      </footer>
    </div>
  );
}
