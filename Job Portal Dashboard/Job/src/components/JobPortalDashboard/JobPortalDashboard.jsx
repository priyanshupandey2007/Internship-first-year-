import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { Search, Bookmark, ArrowLeft, X, MapPin } from "lucide-react";
import { JOBS, CATEGORIES, JOB_TYPES, LEVELS, MARKET_MIN, MARKET_MAX } from "./mockJobs";
import "./JobPortal.css";

/* =========================================================
   ADVANCED STATE MANAGEMENT
   A single reducer owns search text, filters, and saved-job
   ids. Components read via context instead of prop-drilling.
   ========================================================= */

const initialState = {
  search: "",
  category: null,
  type: null,
  level: null,
  minSalary: MARKET_MIN,
  savedIds: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.value };
    case "TOGGLE_CATEGORY":
      return { ...state, category: state.category === action.value ? null : action.value };
    case "TOGGLE_TYPE":
      return { ...state, type: state.type === action.value ? null : action.value };
    case "TOGGLE_LEVEL":
      return { ...state, level: state.level === action.value ? null : action.value };
    case "SET_MIN_SALARY":
      return { ...state, minSalary: action.value };
    case "RESET_FILTERS":
      return { ...state, category: null, type: null, level: null, minSalary: MARKET_MIN };
    case "TOGGLE_SAVE": {
      const saved = state.savedIds.includes(action.id)
        ? state.savedIds.filter((id) => id !== action.id)
        : [...state.savedIds, action.id];
      return { ...state, savedIds: saved };
    }
    default:
      return state;
  }
}

const JobsContext = createContext(null);
const useJobs = () => useContext(JobsContext);

function JobsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const filteredJobs = useMemo(() => {
    const q = state.search.trim().toLowerCase();
    return JOBS.filter((job) => {
      if (q) {
        const haystack = `${job.title} ${job.company} ${job.tags.join(" ")}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (state.category && job.category !== state.category) return false;
      if (state.type && job.type !== state.type) return false;
      if (state.level && job.level !== state.level) return false;
      if (job.salaryMax < state.minSalary) return false;
      return true;
    });
  }, [state.search, state.category, state.type, state.level, state.minSalary]);

  const savedJobs = useMemo(
    () => JOBS.filter((j) => state.savedIds.includes(j.id)),
    [state.savedIds]
  );

  const value = { state, dispatch, filteredJobs, savedJobs };
  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
}

/* =========================================================
   ROUTING
   Lightweight hash router: #/, #/saved, #/job/:id
   Kept dependency-free so the component drops into any
   React setup without needing react-router installed.
   ========================================================= */

function parseRoute(hash) {
  const path = hash.replace(/^#/, "") || "/";
  if (path === "/" || path === "") return { name: "browse" };
  if (path === "/saved") return { name: "saved" };
  const jobMatch = path.match(/^\/job\/(.+)$/);
  if (jobMatch) return { name: "job", id: jobMatch[1] };
  return { name: "browse" };
}

function useHashRoute() {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));

  useEffect(() => {
    const onHashChange = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = useCallback((path) => {
    window.location.hash = path;
  }, []);

  return { route, navigate };
}

/* ---------- helpers ---------- */

function formatSalary(n) {
  return `$${Math.round(n / 1000)}k`;
}

function formatDate(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function SalaryBar({ min, max }) {
  const span = MARKET_MAX - MARKET_MIN;
  const left = ((min - MARKET_MIN) / span) * 100;
  const width = ((max - min) / span) * 100;
  return (
    <div className="jp-salary-row">
      <div className="jp-salary-figures">
        <span>{formatSalary(min)} — {formatSalary(max)}</span>
        <span className="jp-mono" style={{ color: "var(--ink-faint)" }}>market range</span>
      </div>
      <div className="jp-salary-track">
        <div
          className="jp-salary-fill"
          style={{ left: `${left}%`, width: `${Math.max(width, 3)}%` }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   HEADER
   ========================================================= */

function Header({ route, navigate }) {
  const { state, dispatch } = useJobs();
  return (
    <header className="jp-header">
      <div className="jp-header-inner">
        <div className="jp-logo">
          <span className="jp-logo-mark">Ledger</span>
          <span className="jp-logo-sub">job board</span>
        </div>
        <nav className="jp-nav">
          <button
            className={`jp-nav-btn ${route.name === "browse" ? "active" : ""}`}
            onClick={() => navigate("/")}
          >
            Browse
          </button>
          <button
            className={`jp-nav-btn ${route.name === "saved" ? "active" : ""}`}
            onClick={() => navigate("/saved")}
          >
            Saved
            <span className="jp-nav-count">({state.savedIds.length})</span>
          </button>
        </nav>
        <div className="jp-search-wrap">
          <Search size={15} />
          <input
            className="jp-search-input"
            placeholder="Search title, company, or skill"
            value={state.search}
            onChange={(e) => dispatch({ type: "SET_SEARCH", value: e.target.value })}
            aria-label="Search jobs"
          />
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   FILTERS
   ========================================================= */

function Filters() {
  const { state, dispatch } = useJobs();

  return (
    <aside className="jp-filters">
      <div className="jp-filters-title">Filter entries</div>

      <div className="jp-filter-group">
        <label className="jp-filter-label">Category</label>
        <div className="jp-chip-list">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`jp-chip ${state.category === c ? "active" : ""}`}
              onClick={() => dispatch({ type: "TOGGLE_CATEGORY", value: c })}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="jp-filter-group">
        <label className="jp-filter-label">Work type</label>
        <div className="jp-chip-list">
          {JOB_TYPES.map((t) => (
            <button
              key={t}
              className={`jp-chip ${state.type === t ? "active" : ""}`}
              onClick={() => dispatch({ type: "TOGGLE_TYPE", value: t })}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="jp-filter-group">
        <label className="jp-filter-label">Level</label>
        <div className="jp-chip-list">
          {LEVELS.map((l) => (
            <button
              key={l}
              className={`jp-chip ${state.level === l ? "active" : ""}`}
              onClick={() => dispatch({ type: "TOGGLE_LEVEL", value: l })}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="jp-filter-group">
        <label className="jp-filter-label" htmlFor="minSalary">
          Minimum salary
        </label>
        <input
          id="minSalary"
          type="range"
          min={MARKET_MIN}
          max={MARKET_MAX}
          step={5000}
          value={state.minSalary}
          onChange={(e) => dispatch({ type: "SET_MIN_SALARY", value: Number(e.target.value) })}
          style={{ width: "100%", accentColor: "var(--accent)" }}
        />
        <div className="jp-range-row">
          <span>{formatSalary(state.minSalary)}+</span>
          <span>{formatSalary(MARKET_MAX)}</span>
        </div>
      </div>

      <button className="jp-reset-btn" onClick={() => dispatch({ type: "RESET_FILTERS" })}>
        Reset filters
      </button>
    </aside>
  );
}

/* =========================================================
   JOB ENTRY (card) + LIST
   ========================================================= */

function JobEntry({ job, navigate }) {
  const { state, dispatch } = useJobs();
  const saved = state.savedIds.includes(job.id);

  return (
    <article className="jp-entry" onClick={() => navigate(`/job/${job.id}`)}>
      <div className="jp-entry-top">
        <div>
          <div className="jp-entry-id jp-mono">No. {job.id}</div>
          <h3 className="jp-entry-title">{job.title}</h3>
          <div className="jp-entry-company">
            <span>{job.company}</span>
            <span className="jp-dot">·</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <MapPin size={13} /> {job.type}
            </span>
            <span className="jp-tag">{job.level}</span>
          </div>
        </div>
        <button
          className={`jp-save-btn ${saved ? "saved" : ""}`}
          aria-label={saved ? "Remove from saved jobs" : "Save job"}
          onClick={(e) => {
            e.stopPropagation();
            dispatch({ type: "TOGGLE_SAVE", id: job.id });
          }}
        >
          <Bookmark size={19} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      <SalaryBar min={job.salaryMin} max={job.salaryMax} />

      <div className="jp-entry-skills">
        {job.tags.map((t) => (
          <span key={t} className="jp-skill-pill">{t}</span>
        ))}
        <span className="jp-skill-pill jp-mono">posted {formatDate(job.posted)}</span>
      </div>
    </article>
  );
}

function EmptyState({ title, body }) {
  return (
    <div className="jp-empty">
      <div className="jp-empty-title">{title}</div>
      <p>{body}</p>
    </div>
  );
}

function BrowsePage({ navigate }) {
  const { filteredJobs } = useJobs();
  return (
    <div className="jp-layout">
      <Filters />
      <main>
        <div className="jp-results-meta">
          <span>{filteredJobs.length} entr{filteredJobs.length === 1 ? "y" : "ies"} found</span>
          <span>sorted by newest</span>
        </div>
        {filteredJobs.length === 0 ? (
          <EmptyState
            title="No matching entries"
            body="Try widening your filters or clearing the search field."
          />
        ) : (
          filteredJobs.map((job) => <JobEntry key={job.id} job={job} navigate={navigate} />)
        )}
      </main>
    </div>
  );
}

function SavedPage({ navigate }) {
  const { savedJobs } = useJobs();
  return (
    <div className="jp-layout" style={{ gridTemplateColumns: "1fr" }}>
      <main style={{ maxWidth: 720, margin: "0 auto", width: "100%" }}>
        <div className="jp-results-meta">
          <span>{savedJobs.length} saved entr{savedJobs.length === 1 ? "y" : "ies"}</span>
        </div>
        {savedJobs.length === 0 ? (
          <EmptyState
            title="Nothing saved yet"
            body="Bookmark an entry from Browse and it will show up here."
          />
        ) : (
          savedJobs.map((job) => <JobEntry key={job.id} job={job} navigate={navigate} />)
        )}
      </main>
    </div>
  );
}

/* =========================================================
   DETAIL PAGE
   ========================================================= */

function DetailPage({ id, navigate }) {
  const { state, dispatch } = useJobs();
  const [toast, setToast] = useState(null);
  const job = JOBS.find((j) => j.id === id);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  if (!job) {
    return (
      <div className="jp-layout" style={{ gridTemplateColumns: "1fr" }}>
        <main style={{ maxWidth: 720, margin: "0 auto", width: "100%" }}>
          <button className="jp-back-link" onClick={() => navigate("/")}>
            <ArrowLeft size={14} /> Back to listings
          </button>
          <EmptyState title="Entry not found" body="This listing may have been removed." />
        </main>
      </div>
    );
  }

  const saved = state.savedIds.includes(job.id);

  return (
    <div className="jp-layout" style={{ gridTemplateColumns: "1fr" }}>
      <main style={{ maxWidth: 720, margin: "0 auto", width: "100%" }}>
        <button className="jp-back-link" onClick={() => navigate("/")}>
          <ArrowLeft size={14} /> Back to listings
        </button>

        <div className="jp-detail-card">
          <div className="jp-detail-header">
            <div>
              <div className="jp-entry-id jp-mono">No. {job.id}</div>
              <h1 className="jp-detail-title">{job.title}</h1>
              <div className="jp-detail-meta">
                <span>{job.company}</span>
                <span className="jp-dot">·</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <MapPin size={14} /> {job.type}
                </span>
                <span className="jp-tag">{job.level}</span>
              </div>
              <button
                className={`jp-detail-save ${saved ? "saved" : ""}`}
                onClick={() => dispatch({ type: "TOGGLE_SAVE", id: job.id })}
              >
                <Bookmark size={15} fill={saved ? "currentColor" : "none"} />
                {saved ? "Saved" : "Save this entry"}
              </button>
            </div>
            <button
              className="jp-apply-btn"
              onClick={() => setToast(`Application started for ${job.title}`)}
            >
              Apply now
            </button>
          </div>

          <div className="jp-detail-section-label">Compensation</div>
          <SalaryBar min={job.salaryMin} max={job.salaryMax} />

          <div style={{ height: 24 }} />

          <div className="jp-detail-section-label">About the role</div>
          <p className="jp-detail-desc">{job.description}</p>

          <div className="jp-detail-section-label">Skills</div>
          <div className="jp-entry-skills" style={{ marginTop: 0 }}>
            {job.tags.map((t) => (
              <span key={t} className="jp-skill-pill">{t}</span>
            ))}
          </div>
        </div>
      </main>

      {toast && (
        <div className="jp-toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   ROOT
   ========================================================= */

function DashboardShell() {
  const { route, navigate } = useHashRoute();

  return (
    <div className="jp-root">
      <Header route={route} navigate={navigate} />
      {route.name === "browse" && <BrowsePage navigate={navigate} />}
      {route.name === "saved" && <SavedPage navigate={navigate} />}
      {route.name === "job" && <DetailPage id={route.id} navigate={navigate} />}
    </div>
  );
}

export default function JobPortalDashboard() {
  return (
    <JobsProvider>
      <DashboardShell />
    </JobsProvider>
  );
}