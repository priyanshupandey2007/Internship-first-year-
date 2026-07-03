import React, { useState, useRef, useCallback } from "react";

/* ---------------------------------------------------------
   DISPATCH BOARD — a Trello-style kanban styled like a
   print-shop job board: kraft paper, stamped column labels,
   ticket-stub cards with a torn edge and a punch hole.
--------------------------------------------------------- */

const PALETTE = {
  paper: "#EAE3D2",
  paperDark: "#DDD4BC",
  card: "#FBF7EC",
  ink: "#2B2620",
  inkSoft: "#6B6355",
  hairline: "#C9BFA4",
  rust: "#B0522D",
  rustSoft: "#E7C3B1",
  teal: "#3E6259",
  tealSoft: "#CBDBD5",
  amber: "#B4841E",
  amberSoft: "#EEDBAE",
  moss: "#6B7A3B",
  mossSoft: "#DDE3C6",
};

const PRIORITIES = {
  low: { label: "Low", fg: PALETTE.teal, bg: PALETTE.tealSoft },
  medium: { label: "Medium", fg: PALETTE.amber, bg: PALETTE.amberSoft },
  high: { label: "High", fg: PALETTE.rust, bg: PALETTE.rustSoft },
  urgent: { label: "Urgent", fg: "#8C2A1A", bg: "#EFC0AF" },
};

const uid = (() => {
  let n = 1000;
  return () => `TKT-${n++}`;
})();

const initialColumns = [
  { id: "col-1", title: "Intake" },
  { id: "col-2", title: "In progress" },
  { id: "col-3", title: "Review" },
  { id: "col-4", title: "Dispatched" },
];

const initialTasks = {
  "col-1": [
    mkTask("Repaint loading dock signage", "Faded arrows, needs two coats.", "medium"),
    mkTask("Source replacement casters", "Bin 14 shelving, four units.", "low"),
  ],
  "col-2": [
    mkTask("Rebuild pallet jack #3", "Hydraulic seal is weeping.", "high"),
  ],
  "col-3": [
    mkTask("QA the new label printer", "Check alignment on 4x6 stock.", "medium"),
  ],
  "col-4": [
    mkTask("Crate 220 — customs paperwork", "Filed and stamped.", "low"),
  ],
};

function mkTask(title, description, priority) {
  return { id: uid(), title, description, priority };
}

export default function KanbanBoard() {
  const [columns, setColumns] = useState(initialColumns);
  const [tasks, setTasks] = useState(initialTasks);
  const [addingIn, setAddingIn] = useState(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [editingTask, setEditingTask] = useState(null); // { colId, task }
  const [addingColumn, setAddingColumn] = useState(false);
  const [newColTitle, setNewColTitle] = useState("");
  const [renamingCol, setRenamingCol] = useState(null);

  const dragRef = useRef(null); // { taskId, fromCol }
  const [dragOverCol, setDragOverCol] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  /* ---------- task CRUD ---------- */

  const addTask = (colId) => {
    const title = draftTitle.trim();
    if (!title) {
      setAddingIn(null);
      return;
    }
    const task = mkTask(title, "", "medium");
    setTasks((prev) => ({ ...prev, [colId]: [...(prev[colId] || []), task] }));
    setDraftTitle("");
    setAddingIn(null);
  };

  const deleteTask = (colId, taskId) => {
    setTasks((prev) => ({
      ...prev,
      [colId]: prev[colId].filter((t) => t.id !== taskId),
    }));
    setEditingTask(null);
  };

  const updateTask = (colId, updated) => {
    setTasks((prev) => ({
      ...prev,
      [colId]: prev[colId].map((t) => (t.id === updated.id ? updated : t)),
    }));
  };

  /* ---------- column CRUD ---------- */

  const addColumn = () => {
    const title = newColTitle.trim();
    if (!title) {
      setAddingColumn(false);
      return;
    }
    const id = `col-${Date.now()}`;
    setColumns((prev) => [...prev, { id, title }]);
    setTasks((prev) => ({ ...prev, [id]: [] }));
    setNewColTitle("");
    setAddingColumn(false);
  };

  const renameColumn = (colId, title) => {
    setColumns((prev) =>
      prev.map((c) => (c.id === colId ? { ...c, title: title.trim() || c.title } : c))
    );
    setRenamingCol(null);
  };

  const deleteColumn = (colId) => {
    setColumns((prev) => prev.filter((c) => c.id !== colId));
    setTasks((prev) => {
      const next = { ...prev };
      delete next[colId];
      return next;
    });
  };

  /* ---------- drag and drop ---------- */

  const handleDragStart = useCallback((e, taskId, fromCol) => {
    dragRef.current = { taskId, fromCol };
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", taskId);
  }, []);

  const handleDragOverCard = (e, colId, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverCol(colId);
    setDragOverIndex(index);
  };

  const handleDragOverColumn = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverCol(colId);
    setDragOverIndex(tasks[colId]?.length ?? 0);
  };

  const handleDrop = (e, colId) => {
    e.preventDefault();
    const drag = dragRef.current;
    dragRef.current = null;
    const dropIndex = dragOverIndex;
    setDragOverCol(null);
    setDragOverIndex(null);
    if (!drag) return;
    const { taskId, fromCol } = drag;

    setTasks((prev) => {
      const sourceList = [...(prev[fromCol] || [])];
      const movingIndex = sourceList.findIndex((t) => t.id === taskId);
      if (movingIndex === -1) return prev;
      const [moving] = sourceList.splice(movingIndex, 1);

      if (fromCol === colId) {
        let insertAt = dropIndex;
        if (insertAt === null || insertAt === undefined) insertAt = sourceList.length;
        if (movingIndex < insertAt) insertAt -= 1;
        sourceList.splice(Math.max(0, insertAt), 0, moving);
        return { ...prev, [colId]: sourceList };
      }

      const destList = [...(prev[colId] || [])];
      let insertAt = dropIndex === null || dropIndex === undefined ? destList.length : dropIndex;
      insertAt = Math.max(0, Math.min(insertAt, destList.length));
      destList.splice(insertAt, 0, moving);
      return { ...prev, [fromCol]: sourceList, [colId]: destList };
    });
  };

  const handleDragEnd = () => {
    dragRef.current = null;
    setDragOverCol(null);
    setDragOverIndex(null);
  };

  return (
    <div style={styles.board}>
      <style>{`
        @keyframes stamp-in {
          from { opacity: 0; transform: scale(1.15) rotate(-2deg); }
          to { opacity: 1; transform: scale(1) rotate(-2deg); }
        }
        .dispatch-card { transition: transform 120ms ease, box-shadow 120ms ease; }
        .dispatch-card:hover { transform: translateY(-2px); }
        .dispatch-card:active { cursor: grabbing; }
        .col-scroll::-webkit-scrollbar { width: 8px; }
        .col-scroll::-webkit-scrollbar-thumb { background: ${PALETTE.hairline}; border-radius: 4px; }
        .ghost-slot { transition: height 120ms ease; }
        input.dispatch-input, textarea.dispatch-input {
          font-family: inherit;
          border: 1px solid ${PALETTE.hairline};
          background: ${PALETTE.card};
          color: ${PALETTE.ink};
          border-radius: 4px;
          padding: 6px 8px;
          font-size: 13px;
          outline: none;
          width: 100%;
          box-sizing: border-box;
        }
        input.dispatch-input:focus, textarea.dispatch-input:focus {
          border-color: ${PALETTE.rust};
        }
      `}</style>

      <header style={styles.header}>
        <div>
          <div style={styles.eyebrow}>Job floor — live board</div>
          <h1 style={styles.h1}>Dispatch</h1>
        </div>
        <div style={styles.stamp}>
          {columns.length} stations · {Object.values(tasks).reduce((n, l) => n + l.length, 0)} open tickets
        </div>
      </header>

      <div style={styles.columnsRow}>
        {columns.map((col) => {
          const list = tasks[col.id] || [];
          const isOverThisCol = dragOverCol === col.id;
          return (
            <div
              key={col.id}
              style={styles.column}
              onDragOver={(e) => handleDragOverColumn(e, col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div style={styles.colHeader}>
                {renamingCol === col.id ? (
                  <input
                    className="dispatch-input"
                    autoFocus
                    defaultValue={col.title}
                    onBlur={(e) => renameColumn(col.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") renameColumn(col.id, e.target.value);
                      if (e.key === "Escape") setRenamingCol(null);
                    }}
                  />
                ) : (
                  <div
                    style={styles.colTitleWrap}
                    onClick={() => setRenamingCol(col.id)}
                    title="Click to rename"
                  >
                    <span style={styles.colTitle}>{col.title}</span>
                    <span style={styles.colCount}>{list.length}</span>
                  </div>
                )}
                <button
                  style={styles.iconBtn}
                  title="Remove station"
                  onClick={() => deleteColumn(col.id)}
                >
                  ×
                </button>
              </div>

              <div className="col-scroll" style={styles.colBody}>
                {list.map((task, index) => (
                  <React.Fragment key={task.id}>
                    {isOverThisCol && dragOverIndex === index && (
                      <div className="ghost-slot" style={styles.ghostSlot} />
                    )}
                    <TicketCard
                      task={task}
                      onDragStart={(e) => handleDragStart(e, task.id, col.id)}
                      onDragOver={(e) => handleDragOverCard(e, col.id, index)}
                      onDragEnd={handleDragEnd}
                      onClick={() => setEditingTask({ colId: col.id, task })}
                    />
                  </React.Fragment>
                ))}
                {isOverThisCol && dragOverIndex === list.length && (
                  <div className="ghost-slot" style={styles.ghostSlot} />
                )}

                {addingIn === col.id ? (
                  <div style={styles.addBox}>
                    <input
                      className="dispatch-input"
                      autoFocus
                      placeholder="Describe the job…"
                      value={draftTitle}
                      onChange={(e) => setDraftTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addTask(col.id);
                        if (e.key === "Escape") {
                          setAddingIn(null);
                          setDraftTitle("");
                        }
                      }}
                    />
                    <div style={styles.addBoxRow}>
                      <button style={styles.primaryBtn} onClick={() => addTask(col.id)}>
                        Add ticket
                      </button>
                      <button
                        style={styles.ghostBtn}
                        onClick={() => {
                          setAddingIn(null);
                          setDraftTitle("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    style={styles.addTaskBtn}
                    onClick={() => {
                      setAddingIn(col.id);
                      setDraftTitle("");
                    }}
                  >
                    + New ticket
                  </button>
                )}
              </div>
            </div>
          );
        })}

        <div style={styles.newColumnWrap}>
          {addingColumn ? (
            <div style={styles.addColBox}>
              <input
                className="dispatch-input"
                autoFocus
                placeholder="Station name…"
                value={newColTitle}
                onChange={(e) => setNewColTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addColumn();
                  if (e.key === "Escape") setAddingColumn(false);
                }}
              />
              <div style={styles.addBoxRow}>
                <button style={styles.primaryBtn} onClick={addColumn}>
                  Add station
                </button>
                <button style={styles.ghostBtn} onClick={() => setAddingColumn(false)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button style={styles.newColumnBtn} onClick={() => setAddingColumn(true)}>
              + New station
            </button>
          )}
        </div>
      </div>

      {editingTask && (
        <TaskModal
          colId={editingTask.colId}
          task={editingTask.task}
          onClose={() => setEditingTask(null)}
          onSave={(updated) => {
            updateTask(editingTask.colId, updated);
            setEditingTask(null);
          }}
          onDelete={() => deleteTask(editingTask.colId, editingTask.task.id)}
        />
      )}
    </div>
  );
}

function TicketCard({ task, onDragStart, onDragOver, onDragEnd, onClick }) {
  const p = PRIORITIES[task.priority] || PRIORITIES.medium;
  return (
    <div
      className="dispatch-card"
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onClick={onClick}
      style={styles.card}
      title="Drag to move · click to edit"
    >
      <div style={styles.punchHole} />
      <div style={styles.cardTop}>
        <span style={styles.ticketNo}>{task.id}</span>
        <span style={{ ...styles.priorityTag, color: p.fg, background: p.bg }}>
          {p.label}
        </span>
      </div>
      <div style={styles.cardTitle}>{task.title}</div>
      {task.description && <div style={styles.cardDesc}>{task.description}</div>}
    </div>
  );
}

function TaskModal({ task, onClose, onSave, onDelete }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState(task.priority);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <span style={styles.ticketNoLarge}>{task.id}</span>
          <button style={styles.iconBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <label style={styles.label}>Job description</label>
        <input
          className="dispatch-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label style={styles.label}>Notes</label>
        <textarea
          className="dispatch-input"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ resize: "vertical" }}
        />

        <label style={styles.label}>Priority</label>
        <div style={styles.priorityRow}>
          {Object.entries(PRIORITIES).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setPriority(key)}
              style={{
                ...styles.priorityChip,
                background: priority === key ? val.bg : "transparent",
                color: priority === key ? val.fg : PALETTE.inkSoft,
                borderColor: priority === key ? val.fg : PALETTE.hairline,
              }}
            >
              {val.label}
            </button>
          ))}
        </div>

        <div style={styles.modalFooter}>
          <button style={styles.dangerBtn} onClick={onDelete}>
            Delete ticket
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={styles.ghostBtn} onClick={onClose}>
              Cancel
            </button>
            <button
              style={styles.primaryBtn}
              onClick={() => onSave({ ...task, title: title.trim() || task.title, description, priority })}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const serif = "'Iowan Old Style', 'Palatino Linotype', Georgia, serif";
const sans = "'Helvetica Neue', Arial, sans-serif";
const mono = "'SFMono-Regular', Menlo, Consolas, monospace";

const styles = {
  board: {
    fontFamily: sans,
    background: PALETTE.paper,
    color: PALETTE.ink,
    minHeight: "100vh",
    padding: "28px 28px 40px",
    boxSizing: "border-box",
    backgroundImage: `linear-gradient(${PALETTE.paperDark} 1px, transparent 1px)`,
    backgroundSize: "100% 32px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 22,
    flexWrap: "wrap",
    gap: 12,
  },
  eyebrow: {
    fontFamily: mono,
    fontSize: 11,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: PALETTE.rust,
    marginBottom: 2,
  },
  h1: {
    fontFamily: serif,
    fontSize: 34,
    margin: 0,
    fontWeight: 700,
    letterSpacing: "0.01em",
  },
  stamp: {
    fontFamily: mono,
    fontSize: 12,
    color: PALETTE.inkSoft,
    border: `1px dashed ${PALETTE.hairline}`,
    borderRadius: 4,
    padding: "6px 12px",
    transform: "rotate(-1.5deg)",
    background: PALETTE.card,
  },
  columnsRow: {
    display: "flex",
    gap: 16,
    overflowX: "auto",
    paddingBottom: 8,
    alignItems: "flex-start",
  },
  column: {
    flex: "0 0 260px",
    background: "rgba(255,255,255,0.35)",
    border: `1px solid ${PALETTE.hairline}`,
    borderRadius: 8,
    display: "flex",
    flexDirection: "column",
    maxHeight: "72vh",
  },
  colHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 12px 10px",
    borderBottom: `1px solid ${PALETTE.hairline}`,
  },
  colTitleWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    cursor: "text",
    minWidth: 0,
  },
  colTitle: {
    fontFamily: serif,
    fontWeight: 700,
    fontSize: 15,
    letterSpacing: "0.02em",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  colCount: {
    fontFamily: mono,
    fontSize: 11,
    color: PALETTE.inkSoft,
    background: PALETTE.paperDark,
    borderRadius: 10,
    padding: "1px 7px",
  },
  iconBtn: {
    border: "none",
    background: "transparent",
    color: PALETTE.inkSoft,
    fontSize: 18,
    lineHeight: 1,
    cursor: "pointer",
    padding: "2px 6px",
    borderRadius: 4,
  },
  colBody: {
    padding: 10,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    minHeight: 40,
  },
  card: {
    position: "relative",
    background: PALETTE.card,
    border: `1px solid ${PALETTE.hairline}`,
    borderLeft: `3px dashed ${PALETTE.rust}`,
    borderRadius: 6,
    padding: "10px 12px 10px 18px",
    cursor: "grab",
    boxShadow: "0 1px 0 rgba(43,38,32,0.05)",
  },
  punchHole: {
    position: "absolute",
    left: -6,
    top: "50%",
    transform: "translateY(-50%)",
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: PALETTE.paper,
    border: `1px solid ${PALETTE.hairline}`,
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  ticketNo: {
    fontFamily: mono,
    fontSize: 10,
    color: PALETTE.inkSoft,
    letterSpacing: "0.03em",
  },
  ticketNoLarge: {
    fontFamily: mono,
    fontSize: 13,
    color: PALETTE.inkSoft,
    letterSpacing: "0.04em",
  },
  priorityTag: {
    fontFamily: sans,
    fontSize: 10,
    fontWeight: 700,
    borderRadius: 3,
    padding: "2px 7px",
    textTransform: "uppercase",
    letterSpacing: "0.03em",
  },
  cardTitle: {
    fontFamily: serif,
    fontSize: 14.5,
    lineHeight: 1.35,
    marginBottom: 4,
  },
  cardDesc: {
    fontFamily: sans,
    fontSize: 12,
    color: PALETTE.inkSoft,
    lineHeight: 1.4,
  },
  ghostSlot: {
    height: 6,
    borderRadius: 4,
    background: PALETTE.rustSoft,
    opacity: 0.6,
  },
  addTaskBtn: {
    border: `1px dashed ${PALETTE.hairline}`,
    background: "transparent",
    color: PALETTE.inkSoft,
    fontFamily: sans,
    fontSize: 12.5,
    borderRadius: 6,
    padding: "8px 10px",
    cursor: "pointer",
    textAlign: "left",
  },
  addBox: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    background: PALETTE.card,
    border: `1px solid ${PALETTE.hairline}`,
    borderRadius: 6,
    padding: 8,
  },
  addBoxRow: {
    display: "flex",
    gap: 6,
  },
  primaryBtn: {
    background: PALETTE.rust,
    color: "#FBF2EC",
    border: "none",
    borderRadius: 4,
    padding: "6px 12px",
    fontSize: 12.5,
    fontWeight: 700,
    cursor: "pointer",
  },
  ghostBtn: {
    background: "transparent",
    color: PALETTE.inkSoft,
    border: `1px solid ${PALETTE.hairline}`,
    borderRadius: 4,
    padding: "6px 12px",
    fontSize: 12.5,
    cursor: "pointer",
  },
  dangerBtn: {
    background: "transparent",
    color: "#8C2A1A",
    border: `1px solid #8C2A1A`,
    borderRadius: 4,
    padding: "7px 12px",
    fontSize: 12.5,
    fontWeight: 700,
    cursor: "pointer",
  },
  newColumnWrap: {
    flex: "0 0 220px",
  },
  newColumnBtn: {
    width: "100%",
    border: `1px dashed ${PALETTE.hairline}`,
    background: "transparent",
    color: PALETTE.inkSoft,
    fontFamily: sans,
    fontSize: 13,
    borderRadius: 8,
    padding: "12px",
    cursor: "pointer",
  },
  addColBox: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    background: PALETTE.card,
    border: `1px solid ${PALETTE.hairline}`,
    borderRadius: 8,
    padding: 10,
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(43,38,32,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 20,
  },
  modal: {
    width: 380,
    maxWidth: "100%",
    background: PALETTE.card,
    borderRadius: 10,
    border: `1px solid ${PALETTE.hairline}`,
    padding: 18,
    boxShadow: "0 12px 30px rgba(43,38,32,0.25)",
    fontFamily: sans,
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  label: {
    display: "block",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: PALETTE.inkSoft,
    margin: "12px 0 5px",
  },
  priorityRow: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
  },
  priorityChip: {
    fontSize: 12,
    fontWeight: 700,
    borderRadius: 4,
    border: "1px solid",
    padding: "5px 10px",
    cursor: "pointer",
    background: "transparent",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
  },
};
