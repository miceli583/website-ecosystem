/**
 * Tiny reactive store for the founder "View As" role override.
 * Both the Profile page (writer) and Sidebar (reader) subscribe to this.
 */

type Listener = () => void;
const listeners = new Set<Listener>();
let currentOverride: string | null = null;

// Hydrate from sessionStorage on first load (client only)
if (typeof window !== "undefined") {
  currentOverride = sessionStorage.getItem("roleOverride");
}

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export function setRoleOverride(role: string | null) {
  currentOverride = role;
  if (typeof window !== "undefined") {
    if (role) {
      sessionStorage.setItem("roleOverride", role);
    } else {
      sessionStorage.removeItem("roleOverride");
    }
  }
  emitChange();
}

export function getRoleOverride(): string | null {
  return currentOverride;
}

export function subscribeRoleOverride(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
