"use client";

import { useState, useEffect, useCallback } from "react";
import { FlowMapCanvas } from "@/components/flow-map-canvas";
import { flowMapConfig, flowSections } from "@/lib/flow-data";
import type { Note } from "@/lib/flow-map-types";

function emailToName(email: string): string {
  const local = email.split("@")[0] || "user";
  const parts = local.split(/[._-]/);
  const first = parts[0] || "user";
  return first.charAt(0).toUpperCase() + first.slice(1);
}

export default function FlowPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteMode, setNoteMode] = useState(false);
  const [authorEmail, setAuthorEmail] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [showAuthorPrompt, setShowAuthorPrompt] = useState(false);
  const [pendingNote, setPendingNote] = useState<{ x: number; y: number } | null>(
    null
  );
  const [newNoteId, setNewNoteId] = useState<string | null>(null);
  const [subscribedAll, setSubscribedAll] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("flow-notes-email");
    if (savedEmail) {
      setAuthorEmail(savedEmail);
      setAuthorName(emailToName(savedEmail));
    }
    fetchNotes();
  }, []);

  useEffect(() => {
    if (!authorEmail) return;
    fetch(`/api/subscribers?email=${encodeURIComponent(authorEmail)}`)
      .then((r) => r.json())
      .then((data) => setSubscribedAll(Boolean(data.subscribed_all)))
      .catch(() => {});
  }, [authorEmail]);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (e) {
      console.error("Failed to fetch notes", e);
    }
  };

  const createNote = async (
    x: number,
    y: number,
    author: string,
    email: string
  ) => {
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          x,
          y,
          arrow_x: x,
          arrow_y: y + 40,
          content: "",
          author,
          items: [],
          authorEmail: email,
        }),
      });
      if (res.ok) {
        const note = await res.json();
        setNotes((prev) => [...prev, note]);
        setNewNoteId(note.id);
        setNoteMode(false);
      }
    } catch (e) {
      console.error("Failed to create note", e);
    }
  };

  const handleCanvasClick = useCallback(
    (canvasX: number, canvasY: number) => {
      if (!noteMode) return;
      setPendingNote({ x: canvasX, y: canvasY });
      if (!authorEmail) {
        setShowAuthorPrompt(true);
      } else {
        createNote(canvasX, canvasY, authorName, authorEmail);
      }
    },
    [noteMode, authorEmail, authorName]
  );

  const handleAuthorSubmit = () => {
    if (!authorEmail.trim() || !authorEmail.includes("@")) return;
    const name = emailToName(authorEmail);
    setAuthorName(name);
    localStorage.setItem("flow-notes-email", authorEmail);
    setShowAuthorPrompt(false);
    if (pendingNote) {
      createNote(pendingNote.x, pendingNote.y, name, authorEmail);
      setPendingNote(null);
    }
  };

  const updateNote = async (note: Note & { contentChanged?: boolean }) => {
    try {
      const existingNote = notes.find((n) => n.id === note.id);
      const replyAdded =
        (note.replies?.length || 0) > (existingNote?.replies?.length || 0);
      const contentChanged =
        note.content !== existingNote?.content ||
        JSON.stringify(note.items) !==
          JSON.stringify(existingNote?.items || []) ||
        note.done !== existingNote?.done;
      await fetch("/api/notes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...note,
          contentChanged,
          replyAdded,
          author: authorName || note.author,
          authorEmail,
        }),
      });
      setNotes((prev) => prev.map((n) => (n.id === note.id ? note : n)));
    } catch (e) {
      console.error("Failed to update note", e);
    }
  };

  const positionUpdateNote = async (note: Note) => {
    try {
      await fetch("/api/notes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...note,
          contentChanged: false,
          author: authorName || note.author,
        }),
      });
      setNotes((prev) => prev.map((n) => (n.id === note.id ? note : n)));
    } catch (e) {
      console.error("Failed to update note position", e);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await fetch(
        `/api/notes?id=${id}&author=${encodeURIComponent(authorName)}`,
        { method: "DELETE" }
      );
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (e) {
      console.error("Failed to delete note", e);
    }
  };

  return (
    <>
      <FlowMapCanvas
        {...flowMapConfig}
        sections={flowSections}
        notes={notes}
        noteMode={noteMode}
        currentAuthor={authorName}
        currentAuthorEmail={authorEmail}
        newNoteId={newNoteId}
        onNewNoteHandled={() => setNewNoteId(null)}
        onNoteToggle={() => setNoteMode(!noteMode)}
        onCanvasClickForNote={handleCanvasClick}
        onUpdateNote={updateNote}
        onPositionUpdateNote={positionUpdateNote}
        onDeleteNote={deleteNote}
        onRequireAuthor={() => setShowAuthorPrompt(true)}
      />
      {showAuthorPrompt ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#1e1e2e",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 12,
              padding: 24,
              width: 320,
            }}
          >
            <p
              style={{
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                margin: "0 0 12px",
              }}
            >
              Enter your email to leave notes and replies
            </p>
            <input
              autoFocus
              type="email"
              value={authorEmail}
              onChange={(e) => setAuthorEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAuthorSubmit()}
              placeholder="you@asurion.com"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.05)",
                color: "#fff",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 12,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={subscribedAll}
                onChange={(e) => setSubscribedAll(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: "#fbbf24" }}
              />
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
                Email me all activity (comments, replies)
              </span>
            </label>
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 16,
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setShowAuthorPrompt(false);
                  setPendingNote(null);
                  setNoteMode(false);
                }}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "transparent",
                  color: "rgba(255,255,255,0.7)",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleAuthorSubmit();
                  if (authorEmail.includes("@")) {
                    fetch("/api/subscribers", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        email: authorEmail,
                        subscribed_all: subscribedAll,
                      }),
                    }).catch(() => {});
                  }
                }}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "none",
                  background: "#fbbf24",
                  color: "#000",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
