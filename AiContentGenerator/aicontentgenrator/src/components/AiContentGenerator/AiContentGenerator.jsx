import React, { useReducer, useState, useEffect, useMemo, useRef } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  FileText,
  MessageSquare,
  Mail,
  Hash,
  Video,
  Megaphone,
  Trash2,
} from "lucide-react";
import { generateContent } from "./apiClient";
import "./AiContentGenerator.css";

/* =========================================================
   MULTIPLE PROMPTS
   A deck of prompt templates. Each composes the user's topic
   into a fuller instruction before it's sent to the API.
   ========================================================= */

const TEMPLATES = [
  {
    id: "blog-intro",
    name: "Blog intro",
    desc: "Hook + thesis for a post",
    icon: FileText,
    build: (topic) =>
      `Write an engaging introduction (3-4 sentences) for a blog post about: ${topic}`,
  },
  {
    id: "product-desc",
    name: "Product description",
    desc: "Persuasive product copy",
    icon: Megaphone,
    build: (topic) =>
      `Write a persuasive product description (under 80 words) for: ${topic}`,
  },
  {
    id: "social-caption",
    name: "Social caption",
    desc: "Short, scroll-stopping post",
    icon: MessageSquare,
    build: (topic) =>
      `Write a short, engaging social media caption (with 2-3 relevant hashtags) about: ${topic}`,
  },
  {
    id: "email-subject",
    name: "Email subjects",
    desc: "5 subject line options",
    icon: Mail,
    build: (topic) =>
      `Write 5 short, high open-rate email subject lines for an email about: ${topic}`,
  },
  {
    id: "tweet-thread",
    name: "Tweet thread",
    desc: "Opening tweet + hook",
    icon: Hash,
    build: (topic) =>
      `Write the opening tweet of a thread (under 280 characters) that hooks readers on the topic: ${topic}`,
  },
  {
    id: "video-hook",
    name: "Video script hook",
    desc: "First 10-second hook",
    icon: Video,
    build: (topic) =>
      `Write a punchy 10-second spoken hook for a short-form video script about: ${topic}`,
  },
];

/* =========================================================
   STATE MANAGEMENT
   ========================================================= */

const initialState = {
  templateId: TEMPLATES[0].id,
  topic: "",
  status: "idle", // idle | loading | success | error
  output: "",
  error: null,
  history: [],
  activeHistoryId: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_TEMPLATE":
      return { ...state, templateId: action.id, activeHistoryId: null };
    case "SET_TOPIC":
      return { ...state, topic: action.value, activeHistoryId: null };
    case "GENERATE_START":
      return { ...state, status: "loading", error: null };
    case "GENERATE_SUCCESS": {
      const entry = {
        id: `${Date.now()}`,
        templateId: state.templateId,
        topic: state.topic,
        output: action.text,
        time: new Date(),
      };
      return {
        ...state,
        status: "success",
        output: action.text,
        history: [entry, ...state.history].slice(0, 12),
        activeHistoryId: entry.id,
      };
    }
    case "GENERATE_ERROR":
      return { ...state, status: "error", error: action.message };
    case "SELECT_HISTORY": {
      const entry = state.history.find((h) => h.id === action.id);
      if (!entry) return state;
      return {
        ...state,
        templateId: entry.templateId,
        topic: entry.topic,
        output: entry.output,
        status: "success",
        activeHistoryId: entry.id,
      };
    }
    case "CLEAR_HISTORY":
      return { ...state, history: [], activeHistoryId: null };
    default:
      return state;
  }
}

/* =========================================================
   COPY BUTTON
   ========================================================= */

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // Clipboard API can fail (e.g. insecure context) — fail silently,
      // the button simply won't flip to the "copied" state.
    }
  };

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <button className={`ai-copy-btn ${copied ? "copied" : ""}`} onClick={handleCopy}>
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

/* =========================================================
   ROOT COMPONENT
   ========================================================= */

export default function AiContentGenerator() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const textareaRef = useRef(null);

  const activeTemplate = useMemo(
    () => TEMPLATES.find((t) => t.id === state.templateId) ?? TEMPLATES[0],
    [state.templateId]
  );

  const isLoading = state.status === "loading";
  const canGenerate = state.topic.trim().length > 0 && !isLoading;

  async function handleGenerate() {
    if (!canGenerate) return;
    dispatch({ type: "GENERATE_START" });
    try {
      const prompt = activeTemplate.build(state.topic.trim());
      const text = await generateContent(prompt);
      dispatch({ type: "GENERATE_SUCCESS", text });
    } catch (err) {
      dispatch({ type: "GENERATE_ERROR", message: err.message || "Something went wrong." });
    }
  }

  function handleKeyDown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleGenerate();
    }
  }

  return (
    <div className="ai-root">
      <div className="ai-shell">
        <header className="ai-header">
          <div className="ai-eyebrow">AI content generator</div>
          <h1 className="ai-title ai-display">Draft it, don't stare at it</h1>
          <p className="ai-subtitle">
            Pick a format, describe your topic, and generate a first draft in seconds.
            Copy the result straight into whatever you're writing.
          </p>
        </header>

        <div className="ai-deck-label">Choose a format</div>
        <div className="ai-deck">
          {TEMPLATES.map((t) => {
            const Icon = t.icon;
            const active = t.id === state.templateId;
            return (
              <button
                key={t.id}
                className={`ai-deck-card ${active ? "active" : ""}`}
                onClick={() => dispatch({ type: "SET_TEMPLATE", id: t.id })}
              >
                <Icon size={18} className="ai-deck-icon" />
                <div className="ai-deck-name ai-display">{t.name}</div>
                <div className="ai-deck-desc">{t.desc}</div>
              </button>
            );
          })}
        </div>

        <div className="ai-input-card">
          <label className="ai-input-label" htmlFor="topic">
            What's it about?
          </label>
          <textarea
            id="topic"
            ref={textareaRef}
            className="ai-textarea"
            placeholder={`e.g. "a noise-cancelling headphone for remote workers"`}
            value={state.topic}
            onChange={(e) => dispatch({ type: "SET_TOPIC", value: e.target.value })}
            onKeyDown={handleKeyDown}
          />
          <div className="ai-input-footer">
            <span className="ai-char-count ai-mono">{state.topic.length} characters</span>
            <button className="ai-generate-btn" onClick={handleGenerate} disabled={!canGenerate}>
              {isLoading ? (
                <>
                  <span className="ai-spinner" /> Generating…
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Generate
                </>
              )}
            </button>
          </div>
        </div>

        <div className="ai-output-card">
          <div className="ai-output-header">
            <div className="ai-output-title">
              Result
              <span className="ai-tag ai-mono">{activeTemplate.name}</span>
            </div>
            {state.status === "success" && <CopyButton text={state.output} />}
          </div>

          {state.status === "error" && (
            <div className="ai-error">
              <AlertCircle size={16} />
              {state.error}
            </div>
          )}

          {state.status === "loading" && (
            <div>
              <div className="ai-skeleton-line" style={{ width: "92%" }} />
              <div className="ai-skeleton-line" style={{ width: "78%" }} />
              <div className="ai-skeleton-line" style={{ width: "85%" }} />
            </div>
          )}

          {state.status === "success" && (
            <div className="ai-output-body">
              {state.output}
              <span className="ai-cursor" />
            </div>
          )}

          {state.status === "idle" && (
            <div className="ai-empty">
              <Loader2 size={22} style={{ opacity: 0.3 }} />
              Nothing generated yet — describe a topic above and hit Generate.
            </div>
          )}
        </div>

        {state.history.length > 0 && (
          <div className="ai-history">
            <div className="ai-output-header">
              <div className="ai-deck-label" style={{ margin: 0 }}>
                Recent generations
              </div>
              <button
                className="ai-history-clear"
                onClick={() => dispatch({ type: "CLEAR_HISTORY" })}
              >
                <Trash2 size={13} style={{ verticalAlign: "-2px", marginRight: 4 }} />
                Clear
              </button>
            </div>
            <div className="ai-history-list">
              {state.history.map((h) => {
                const tmpl = TEMPLATES.find((t) => t.id === h.templateId);
                return (
                  <button
                    key={h.id}
                    className={`ai-history-item ${h.id === state.activeHistoryId ? "active" : ""}`}
                    onClick={() => dispatch({ type: "SELECT_HISTORY", id: h.id })}
                  >
                    <div className="ai-history-meta">
                      <div className="ai-history-topic">
                        {tmpl?.name}: {h.topic}
                      </div>
                    </div>
                    <span className="ai-history-time ai-mono">
                      {h.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}