"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FEATURE_FLAGS } from "@/lib/feature-flags";

// One successful unlock covers every protected case study in the session.
const CORRECT_PASSWORD = "morecowbell";
const STORAGE_KEY = "pw_case_studies";

export function PasswordGate() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [visible, setVisible] = useState(false);
  const [showError, setShowError] = useState(false);
  const [shake, setShake] = useState(false);
  const shakeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (FEATURE_FLAGS.caseStudyPasswordProtection && sessionStorage.getItem(STORAGE_KEY) !== "unlocked") {
      setOpen(true);
    }
    return () => {
      if (shakeTimer.current) clearTimeout(shakeTimer.current);
    };
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Restore type="password" before submit so autocomplete never saves plain text.
    setVisible(false);
    if (value === CORRECT_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "unlocked");
      setOpen(false);
      return;
    }
    setValue("");
    setShowError(true);
    setShake(true);
    shakeTimer.current = setTimeout(() => setShake(false), 400);
  }

  return (
    // Controlled with no onOpenChange: only the right password closes it.
    <Dialog open={open} disablePointerDismissal>
      <DialogContent
        showCloseButton={false}
        className="password-modal z-[10001] block ring-0 data-open:animate-none"
        overlayClassName="z-[10001] bg-[rgba(10,8,15,0.8)] supports-backdrop-filter:backdrop-blur-[20px] data-open:animate-none"
      >
        <div className="password-modal-icon">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <DialogTitle render={<h3 />} className="password-modal-title">
          Protected Content
        </DialogTitle>
        <DialogDescription className="password-modal-description">
          This case study contains confidential work. Please enter the password to continue.
        </DialogDescription>
        <form className="password-form" onSubmit={handleSubmit}>
          <div className="password-input-wrapper" role="group">
            <Input
              type={visible ? "text" : "password"}
              className={`password-input h-auto${shake ? " error" : ""}`}
              id="passwordInput"
              placeholder="Enter password"
              autoComplete="off"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setShowError(false);
              }}
            />
            <button
              type="button"
              className="password-toggle"
              aria-pressed={visible}
              aria-controls="passwordInput"
              aria-label="Show password"
              title={visible ? "Hide password" : "Show password"}
              onClick={() => setVisible((v) => !v)}
            >
              <i className={visible ? "iconoir-eye-closed" : "iconoir-eye"} aria-hidden="true"></i>
            </button>
          </div>
          <div aria-live="assertive" className="visually-hidden">
            {visible ? "Your password is shown." : ""}
          </div>
          <p className={`password-error${showError ? " visible" : ""}`}>
            Incorrect password. Please try again.
          </p>
          <Button type="submit" className="password-submit h-auto">
            Unlock
          </Button>
        </form>
        <a href="/#case-studies" className="password-back">
          ← Back to Case Studies
        </a>
        <a
          href="mailto:ricardo@deazuadesign.com?subject=Please%20send%20me%20your%20case%20study%20password."
          className="password-contact"
        >
          Don&apos;t have the password? <span className="password-contact-link">Email me</span>
        </a>
      </DialogContent>
    </Dialog>
  );
}
