"use client";

import { useEffect, useMemo, useState } from "react";

export default function Page() {
  const ratingOptions = [
    { value: 5, label: "Sehr gut", icon: "😍" },
    { value: 4, label: "Gut", icon: "🙂" },
    { value: 3, label: "Neutral", icon: "😐" },
    { value: 2, label: "Schlecht", icon: "🙁" },
    { value: 1, label: "Sehr schlecht", icon: "😡" },
  ];

  const today = () => new Date().toISOString().slice(0, 10);

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [note, setNote] = useState("");
  const [rating, setRating] = useState(0);
  const [orderDate, setOrderDate] = useState(today());
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  async function loadEntries() {
    try {
      setLoading(true);
      const response = await fetch("/api/entries", { cache: "no-store" });
      const data = await response.json();
      setEntries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      alert("Einträge konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEntries();
  }, []);

  function formatDate(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("de-DE");
  }

  function getRatingMeta(value) {
    return ratingOptions.find((option) => option.value === value) || ratingOptions[2];
  }

  function resetForm() {
    setName("");
    setAuthor("");
    setNote("");
    setRating(0);
    setOrderDate(today());
    setEditingId(null);
  }

  async function saveEntry() {
    if (!name.trim() || !author.trim() || !rating || !orderDate) return;

    const payload = {
      name: name.trim(),
      author: author.trim(),
      note: note.trim(),
      rating,
      orderDate,
    };

    try {
      const response = await fetch(
        editingId ? `/api/entries/${editingId}` : "/api/entries",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Speichern fehlgeschlagen");

      await loadEntries();
      resetForm();
    } catch (error) {
      console.error(error);
      alert("Speichern fehlgeschlagen.");
    }
  }

  function editEntry(entry) {
    setEditingId(entry.id);
    setName(entry.name || "");
    setAuthor(entry.author || "");
    setNote(entry.note || "");
    setRating(entry.rating || 0);
    setOrderDate(new Date(entry.orderDate).toISOString().slice(0, 10));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteEntry(id) {
    try {
      const response = await fetch(`/api/entries/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Löschen fehlgeschlagen");

      await loadEntries();
      if (editingId === id) resetForm();
    } catch (error) {
      console.error(error);
      alert("Löschen fehlgeschlagen.");
    }
  }

  const filteredEntries = useMemo(() => {
    const term = search.toLowerCase();

    return entries.filter((entry) => {
      const matchesSearch =
        (entry.name || "").toLowerCase().includes(term) ||
        (entry.author || "").toLowerCase().includes(term) ||
        (entry.note || "").toLowerCase().includes(term);

      const matchesFilter =
        filter === "all"
          ? true
          : filter === "good"
          ? entry.rating >= 4
          : filter === "neutral"
          ? entry.rating === 3
          : filter === "bad"
          ? entry.rating <= 2
          : true;

      return matchesSearch && matchesFilter;
    });
  }, [entries, search, filter]);

  const stats = useMemo(() => {
    const total = entries.length;
    const top = entries.filter((e) => e.rating >= 4).length;
    const avg = total ? entries.reduce((sum, e) => sum + e.rating, 0) / total : 0;
    return { total, top, avg };
  }, [entries]);

  const page = {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, rgba(99,102,241,0.22), transparent 22%), radial-gradient(circle at top right, rgba(34,211,238,0.16), transparent 25%), linear-gradient(180deg, #020617 0%, #0f172a 60%, #000 100%)",
    color: "#e2e8f0",
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    paddingBottom: 40,
  };

  const shell = {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "28px 16px 32px",
  };

  const glass = {
    background: "rgba(15,23,42,0.72)",
    border: "1px solid rgba(51,65,85,0.9)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.28)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
  };

  const hero = {
    ...glass,
    borderRadius: 30,
    padding: 24,
    maxWidth: 920,
    margin: "0 auto 20px",
  };

  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 12,
    marginBottom: 20,
  };

  const statCard = {
    ...glass,
    borderRadius: 22,
    padding: 18,
  };

  const layout = {
    display: "grid",
    gridTemplateColumns: "420px 1fr",
    gap: 24,
  };

  const panel = {
    ...glass,
    borderRadius: 28,
    padding: 24,
  };

  const input = {
    width: "100%",
    background: "#1e293b",
    border: "1px solid #334155",
    color: "#e2e8f0",
    borderRadius: 16,
    padding: "14px 16px",
    outline: "none",
    boxSizing: "border-box",
  };

  const smallBtn = {
    border: "none",
    borderRadius: 12,
    padding: "8px 12px",
    cursor: "pointer",
    color: "white",
  };

  const entryCard = {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
  };

  return (
    <div style={page}>
      <div style={shell}>
        <div style={hero}>
          <div style={{ color: "#818cf8", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", fontSize: 12, marginBottom: 10 }}>
            LieferRadar
          </div>
          <h1 style={{ margin: 0, fontSize: 42 }}>Dein Food Radar</h1>
          <p style={{ margin: "12px 0 0", color: "#94a3b8" }}>
            Stylische iPhone-Optik, MySQL-Anbindung und getrennte Felder für Lieferant und Verfasser.
          </p>
        </div>

        <div style={grid}>
          <div style={statCard}>
            <div style={{ color: "#94a3b8", fontSize: 14 }}>Einträge</div>
            <div style={{ fontSize: 30, fontWeight: 800, marginTop: 6 }}>{stats.total}</div>
          </div>
          <div style={statCard}>
            <div style={{ color: "#94a3b8", fontSize: 14 }}>Gut oder besser</div>
            <div style={{ fontSize: 30, fontWeight: 800, marginTop: 6 }}>{stats.top}</div>
          </div>
          <div style={statCard}>
            <div style={{ color: "#94a3b8", fontSize: 14 }}>Durchschnitt</div>
            <div style={{ fontSize: 30, fontWeight: 800, marginTop: 6 }}>
              {stats.total ? stats.avg.toFixed(1) : "–"}
            </div>
          </div>
        </div>

        <div style={layout}>
          <section style={panel}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 24 }}>
                {editingId ? "Eintrag bearbeiten" : "Neuer Eintrag"}
              </h2>
              {editingId && (
                <button
                  onClick={resetForm}
                  style={{ ...smallBtn, background: "#334155" }}
                >
                  Abbrechen
                </button>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Lieferant"
                style={input}
              />

              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Verfasser"
                style={input}
              />

              <input
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                style={input}
              />

              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
                {ratingOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRating(option.value)}
                    style={{
                      borderRadius: 16,
                      padding: "10px 6px",
                      border: "1px solid #334155",
                      background:
                        rating === option.value
                          ? option.value === 5
                            ? "linear-gradient(135deg,#34d399,#14b8a6)"
                            : option.value === 4
                            ? "linear-gradient(135deg,#38bdf8,#06b6d4)"
                            : option.value === 3
                            ? "linear-gradient(135deg,#94a3b8,#64748b)"
                            : option.value === 2
                            ? "linear-gradient(135deg,#fbbf24,#f97316)"
                            : "linear-gradient(135deg,#fb7185,#ec4899)"
                          : "#1e293b",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontSize: 24 }}>{option.icon}</div>
                    <div style={{ fontSize: 10, marginTop: 4 }}>{option.label}</div>
                  </button>
                ))}
              </div>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                placeholder="Notiz"
                style={{ ...input, resize: "vertical" }}
              />

              <button
                onClick={saveEntry}
                style={{
                  border: "none",
                  borderRadius: 16,
                  padding: "14px 16px",
                  background: "#6366f1",
                  color: "white",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {editingId ? "Speichern" : "Eintrag speichern"}
              </button>
            </div>
          </section>

          <div>
            <section style={panel}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <h2 style={{ margin: 0, fontSize: 24 }}>Einträge</h2>
                <span style={{ color: "#94a3b8", fontSize: 14 }}>
                  {loading ? "Lädt..." : filteredEntries.length}
                </span>
              </div>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Suchen nach Lieferant, Verfasser oder Notiz"
                style={{ ...input, marginBottom: 14 }}
              />

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                {[
                  ["all", "Alle"],
                  ["good", "Gut"],
                  ["neutral", "Neutral"],
                  ["bad", "Schlecht"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    style={{
                      border: "none",
                      borderRadius: 999,
                      padding: "10px 14px",
                      background: filter === key ? "#6366f1" : "#1e293b",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {!loading && filteredEntries.length === 0 ? (
                <div style={{ ...entryCard, color: "#94a3b8" }}>
                  Noch keine Einträge vorhanden.
                </div>
              ) : (
                filteredEntries.map((entry) => {
                  const meta = getRatingMeta(entry.rating);
                  return (
                    <div key={entry.id} style={entryCard}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>
                          {entry.name} {meta.icon}
                        </div>
                        <div style={{ color: "#94a3b8", fontSize: 14, marginTop: 4 }}>
                          {meta.label} · {formatDate(entry.orderDate)}
                        </div>
                        <div style={{ color: "#64748b", fontSize: 14, marginTop: 6 }}>
                          Verfasser: {entry.author || "Unbekannt"}
                        </div>
                        {entry.note && (
                          <div style={{ color: "#cbd5e1", fontSize: 14, marginTop: 10, lineHeight: 1.6 }}>
                            {entry.note}
                          </div>
                        )}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <button
                          onClick={() => editEntry(entry)}
                          style={{ ...smallBtn, background: "#334155" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          style={{ ...smallBtn, background: "#e11d48" }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
