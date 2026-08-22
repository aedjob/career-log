import { useMemo, useState, createContext, useContext } from "react";
import EVENTS from "./data/events.json";

const THEMES = {
  dark: {
    bg: "#262624",
    textDefault: "#E8E6DC",
    textPrimary: "#F5F4F0",
    textBody: "#C4C1B8",
    textMuted: "#8A8779",
    textSubtle: "#6B6A63",
    border: "#45433E",
    borderIcon: "#55534E",
    accent: "#F5F4F0",
    hoverBg: "#2E2D2A",
  },
  light: {
    bg: "#FFFFFF",
    textDefault: "#1A1A1A",
    textPrimary: "#111111",
    textBody: "#404040",
    textMuted: "#6B6B6B",
    textSubtle: "#8A8A8A",
    border: "#DDDDDD",
    borderIcon: "#9E9E9E",
    accent: "#000000",
    hoverBg: "#F2F2F0",
  },
};

const ThemeContext = createContext(THEMES.dark);
function useTheme() {
  return useContext(ThemeContext);
}

const CPD_FILTERS = {
  "AI & Technology": [
    "AI",
    "GenAI",
    "LLMs",
    "cybersecurity",
    "SD-WAN",
    "cloud",
    "data analytics",
    "ISO 42001",
    "Industry 4.0",
    "digitisation",
    "robotics",
    "medical robotics",
  ],
  Energy: [
    "energy",
    "fuel market",
    "energy management",
    "sustainability",
    "offshore wind",
    "renewable energy",
    "grid connection",
  ],
  "Supply Chain & Logistics": ["logistics", "supply chain", "trade show", "last mile"],
  "Data & Analytics": [
    "data analytics",
    "Power BI",
    "DAX",
    "dashboards",
    "BI",
    "data visualization",
    "analytics",
    "SQL",
    "SQL Server",
    "database",
    "BigQuery",
  ],
};

function formatYear(d) {
  return new Date(d + "T00:00:00").getFullYear();
}

function formatRange(start, end) {
  if (!end) return `${formatYear(start)}`;
  const startYear = formatYear(start);
  const endYear = formatYear(end);
  return startYear === endYear ? `${startYear}` : `${startYear} – ${endYear}`;
}

function formatMonthYear(d) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function formatCpdRange(start, end) {
  const startLabel = formatMonthYear(start);
  if (!end) return startLabel;
  const endLabel = formatMonthYear(end);
  return startLabel === endLabel ? startLabel : `${startLabel} – ${endLabel}`;
}

function ThemeToggle({ theme, onToggle }) {
  const t = useTheme();
  const other = THEMES[theme === "dark" ? "light" : "dark"];
  return (
    <button
      onClick={() => onToggle(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle color theme"
      style={{
        width: 16,
        height: 16,
        padding: 0,
        borderRadius: "50%",
        border: `1px solid ${t.border}`,
        background: other.bg,
        cursor: "pointer",
      }}
    />
  );
}

function Entry({ e, collapsible }) {
  const t = useTheme();
  const [expanded, setExpanded] = useState(false);
  const hasBody =
    Boolean(e.description) || (e.bullets && e.bullets.length > 0) || (e.tags && e.tags.length > 0);
  const showBody = !collapsible || expanded || !hasBody;
  const isExpandable = collapsible && hasBody;

  const entryUrl =
    e.type === "cpd" || e.type === "education" ? e.credential_url || e.link : e.link;
  const isClickable = isExpandable || Boolean(entryUrl);

  function handleClick() {
    if (entryUrl) {
      window.open(entryUrl, "_blank", "noopener,noreferrer");
      return;
    }
    if (isExpandable) setExpanded((v) => !v);
  }

  return (
    <div
      className="entry"
      onClick={isClickable ? handleClick : undefined}
      style={{
        position: "relative",
        padding: "18px 16px 18px 20px",
        marginBottom: 4,
        cursor: isClickable ? "pointer" : "default",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: -24 + 1,
          top: 24,
          width: 9,
          height: 9,
          borderRadius: "50%",
          background: e.muted ? t.borderIcon : t.accent,
          border: `2px solid ${t.bg}`,
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
        <span className="mono" style={{ fontSize: 12, color: e.muted ? t.textMuted : t.accent }}>
          {e.type === "cpd" ? formatCpdRange(e.date, e.end_date) : formatRange(e.date, e.end_date)}
        </span>
        {e.type === "cpd" && (
          <span
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: e.category === "course" ? t.textPrimary : t.textMuted,
              border: `1px solid ${e.category === "course" ? t.textPrimary : t.border}`,
              padding: "1px 6px",
            }}
          >
            {e.category}
          </span>
        )}
        {isExpandable && (
          <span className="mono" style={{ fontSize: 11, color: t.borderIcon, marginLeft: "auto" }}>
            {expanded ? "−" : "+"}
          </span>
        )}
        {!isExpandable && entryUrl && (
          <span className="mono" style={{ fontSize: 11, color: t.borderIcon, marginLeft: "auto" }}>
            ↗
          </span>
        )}
      </div>
      <h3
        style={{
          margin: "0 0 4px",
          fontSize: 14,
          fontWeight: 500,
          fontStyle: e.muted ? "italic" : "normal",
          color: e.muted ? t.textBody : t.textPrimary,
        }}
      >
        {e.title}
        {(e.org || e.location) && (
          <span style={{ color: t.textMuted, fontWeight: 400, fontStyle: "normal" }}>
            {" "}
            — {[e.org, e.location].filter(Boolean).join(" · ")}
          </span>
        )}
      </h3>
      {e.speakers && (
        <p className="mono" style={{ margin: "0 0 4px", fontSize: 11, color: t.textMuted }}>
          {e.speakers}
        </p>
      )}
      {showBody && e.description && (
        <p style={{ margin: "0 0 8px", fontSize: 14, color: t.textBody }}>{e.description}</p>
      )}
      {showBody && e.bullets && e.bullets.length > 0 && (
        <ul style={{ margin: "0 0 8px", paddingLeft: 18, fontSize: 14, color: t.textBody }}>
          {e.bullets.map((b, i) => (
            <li key={i} style={{ marginBottom: 4 }}>
              {b}
            </li>
          ))}
        </ul>
      )}
      {showBody &&
        e.type !== "cpd" &&
        e.type !== "job" &&
        e.type !== "education" &&
        e.tags &&
        e.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {e.tags.map((tag) => (
              <span key={tag} className="mono" style={{ fontSize: 10, color: t.textSubtle }}>
                #{tag}
              </span>
            ))}
          </div>
        )}
    </div>
  );
}

function ConnectButton() {
  const t = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="mono"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          fontSize: 12,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: t.accent,
          marginBottom: open ? 10 : 0,
        }}
      >
        <span style={{ fontSize: 12, width: 10, display: "inline-block" }}>
          {open ? "−" : "+"}
        </span>
        Let's Connect
      </button>
      {open && (
        <div style={{ display: "flex", flexDirection: "column", gap: 2, paddingLeft: 20 }}>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=aedjob@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mono"
            style={{ fontSize: 12, color: t.textBody, textDecoration: "none" }}
          >
            aedjob@gmail.com
          </a>
          <a
            href="https://www.linkedin.com/in/aedjob/"
            target="_blank"
            rel="noopener noreferrer"
            className="mono"
            style={{ fontSize: 12, color: t.textBody, textDecoration: "none" }}
          >
            linkedin.com/in/aedjob
          </a>
        </div>
      )}
    </div>
  );
}

function Section({ title, entries, collapsibleEntries, filters, yearFilter }) {
  const t = useTheme();
  const [open, setOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [activeYear, setActiveYear] = useState(null);

  const availableYears = useMemo(() => {
    if (!yearFilter) return [];
    const years = new Set(entries.map((e) => formatYear(e.date)));
    return [...years].filter((y) => y >= 2019).sort((a, b) => b - a);
  }, [entries, yearFilter]);

  const filteredEntries = useMemo(() => {
    let result = entries;
    if (filters && activeFilter) {
      const tagSet = filters[activeFilter];
      result = result.filter((e) => e.tags && e.tags.some((t) => tagSet.includes(t)));
    }
    if (yearFilter && activeYear) {
      result = result.filter((e) => formatYear(e.date) === activeYear);
    }
    return result;
  }, [entries, activeFilter, filters, activeYear, yearFilter]);

  function toggleFilter(label) {
    setActiveFilter((prev) => (prev === label ? null : label));
  }

  function toggleYear(year) {
    setActiveYear((prev) => (prev === year ? null : year));
  }

  return (
    <div style={{ marginBottom: 32 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="mono"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          fontSize: 13,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: t.textPrimary,
          marginBottom: open ? 16 : 0,
        }}
      >
        <span style={{ color: t.accent, fontSize: 12, width: 10, display: "inline-block" }}>
          {open ? "−" : "+"}
        </span>
        {title}
        <span className="mono" style={{ color: t.borderIcon, fontSize: 11 }}>
          ({entries.length})
        </span>
      </button>
      {open && (
        <>
          {filters && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {Object.keys(filters)
                .sort((a, b) => a.localeCompare(b))
                .map((label) => (
                  <button
                    key={label}
                    onClick={() => toggleFilter(label)}
                    className="mono"
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.04em",
                      padding: "5px 10px",
                      border: "1px solid",
                      borderColor: activeFilter === label ? t.accent : t.border,
                      background: activeFilter === label ? t.accent : "transparent",
                      color: activeFilter === label ? t.bg : t.textBody,
                      cursor: "pointer",
                    }}
                  >
                    {label}
                  </button>
                ))}
            </div>
          )}
          {yearFilter && availableYears.length > 1 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {availableYears.map((year) => (
                <button
                  key={year}
                  onClick={() => toggleYear(year)}
                  className="mono"
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.04em",
                    padding: "5px 10px",
                    border: "1px solid",
                    borderColor: activeYear === year ? t.accent : t.border,
                    background: activeYear === year ? t.accent : "transparent",
                    color: activeYear === year ? t.bg : t.textBody,
                    cursor: "pointer",
                  }}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
          <Timeline entries={filteredEntries} collapsible={collapsibleEntries} />
        </>
      )}
    </div>
  );
}

function Timeline({ entries, collapsible }) {
  const t = useTheme();
  return (
    <div style={{ position: "relative", paddingLeft: 24 }}>
      <div
        style={{
          position: "absolute",
          left: 4,
          top: 6,
          bottom: 6,
          width: 1,
          background: t.border,
        }}
      />
      {entries.map((e) => (
        <Entry key={e.id} e={e} collapsible={collapsible} />
      ))}
    </div>
  );
}

function CareerLogInner({ theme, onToggleTheme }) {
  const t = useTheme();

  const projects = useMemo(
    () => EVENTS.filter((e) => e.type === "project").sort((a, b) => b.date.localeCompare(a.date)),
    []
  );
  const work = useMemo(
    () => EVENTS.filter((e) => e.type === "job").sort((a, b) => b.date.localeCompare(a.date)),
    []
  );
  const education = useMemo(
    () =>
      EVENTS.filter((e) => e.type === "education").sort((a, b) => b.date.localeCompare(a.date)),
    []
  );
  const cpd = useMemo(
    () => EVENTS.filter((e) => e.type === "cpd").sort((a, b) => b.date.localeCompare(a.date)),
    []
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: t.bg,
        color: t.textDefault,
        fontFamily: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        .mono { font-family: 'IBM Plex Mono', monospace; }
        .entry:hover { background: ${t.hoverBg}; }
      `}</style>

      {/* Title block */}
      <header
        style={{
          borderBottom: `2px solid ${t.border}`,
          padding: "40px 24px 24px",
          maxWidth: 880,
          margin: "0 auto",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: 20, right: 24 }}>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
        <h1
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 700,
            fontSize: "clamp(19px, 3vw, 25px)",
            margin: "0 0 8px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: t.textPrimary,
          }}
        >
          Alfredo E. Job
        </h1>
        <p style={{ margin: "0 0 4px", fontSize: 15, color: t.textBody, maxWidth: 560 }}>
          Industrial Engineer (UTN) · M.Sc. Statistics &amp; Operations Research (RMIT)
        </p>
        <p className="mono" style={{ margin: "0 0 16px", fontSize: 12, color: t.textMuted }}>
          Supply Chain &amp; Operations
        </p>
        <ConnectButton />
      </header>

      <main style={{ maxWidth: 880, margin: "0 auto", padding: "40px 24px 80px" }}>
        {/* Projects section hidden until real entries exist — data/schema stays ready, just re-add this line when populated */}
        {/* <Section title="Projects" entries={projects} /> */}
        <Section title="Work" entries={work} />
        <Section title="Education" entries={education} />
        <Section title="CPD" entries={cpd} filters={CPD_FILTERS} yearFilter />
      </main>

      <footer
        style={{
          borderTop: `1px solid ${t.border}`,
          padding: "20px 24px",
          maxWidth: 880,
          margin: "0 auto",
        }}
      >
        <p className="mono" style={{ fontSize: 11, color: t.textSubtle, margin: 0 }}>
          Professional Log — Rev.{" "}
          {new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })}
        </p>
      </footer>
    </div>
  );
}

export default function CareerLog() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return window.localStorage.getItem("career-log-theme") || "dark";
  });

  function handleToggle(mode) {
    setTheme(mode);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("career-log-theme", mode);
    }
  }

  return (
    <ThemeContext.Provider value={THEMES[theme]}>
      <CareerLogInner theme={theme} onToggleTheme={handleToggle} />
    </ThemeContext.Provider>
  );
}
