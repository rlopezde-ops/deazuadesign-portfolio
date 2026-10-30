import type { KeyboardEvent } from "react";

/**
 * Space/Enter activation for elements given role="button" — mirrors native button keyboard semantics
 * (preventDefault stops Space from scrolling and Enter from submitting) before invoking the handler.
 */
export function activateOnKey(event: KeyboardEvent, onActivate: () => void): void {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onActivate();
    }
}
