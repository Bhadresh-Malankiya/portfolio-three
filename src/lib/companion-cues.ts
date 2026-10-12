export type CompanionCueMemory = Readonly<{
  visibleMs: number;
  read: boolean;
  cooldownUntil: number;
}>;

export type CompanionCueState = Readonly<{
  id: string | null;
  eligible: boolean;
  visible: boolean;
  stableMs: number;
  blocked: boolean;
  readThisVisit: boolean;
  updatedAt: number | null;
  cues: Readonly<Record<string, CompanionCueMemory>>;
}>;

export type CompanionCueInput = {
  now: number;
  id: string;
  eligible: boolean;
  deltaMs: number;
};

export type CompanionCueUpdate = {
  state: CompanionCueState;
  visible: boolean;
  pending: boolean;
};

const STABLE_MS = 260;
const READ_MS = 1800;
const DISPLAY_MS = 6500;
const REVISIT_MS = 20_000;
const MAX_FRAME_MS = 100;
const emptyMemory = (): CompanionCueMemory => ({ visibleMs: 0, read: false, cooldownUntil: 0 });
const memoryFor = (cues: CompanionCueState["cues"], id: string): CompanionCueMemory =>
  Object.prototype.hasOwnProperty.call(cues, id) ? cues[id] : emptyMemory();

export function createCueState(): CompanionCueState {
  return { id: null, eligible: false, visible: false, stableMs: 0, blocked: false, readThisVisit: false, updatedAt: null, cues: {} };
}

/** A visit changes only when its section id changes. Eligibility interruptions
 * can replay an unread cue, but never restart a cue that was already read. */
export function updateCompanionCue(state: CompanionCueState, input: CompanionCueInput): CompanionCueUpdate {
  const now = Number.isFinite(input.now) ? Math.max(state.updatedAt ?? input.now, input.now) : state.updatedAt ?? 0;
  // deltaMs represents observed frames, not the time spent in a suspended tab.
  const elapsed = state.updatedAt === null ? 0 : Math.min(
    MAX_FRAME_MS,
    Math.max(0, now - state.updatedAt),
    Number.isFinite(input.deltaMs) ? Math.max(0, input.deltaMs) : 0,
  );
  let cues = state.cues;
  let memory = memoryFor(cues, input.id);
  let blocked = state.blocked;
  let stableMs = state.stableMs;
  let visible = state.visible;
  let readThisVisit = state.readThisVisit;

  if (input.id !== state.id) {
    if (state.id !== null) {
      const previous = memoryFor(cues, state.id);
      if (previous.read && readThisVisit) cues = { ...cues, [state.id]: { ...previous, cooldownUntil: now + REVISIT_MS } };
    }
    // Re-arm on entry only. Waiting out a cooldown in the same section must not
    // cause repeated introductions while somebody is reading that section.
    blocked = memory.read && now < memory.cooldownUntil;
    if (memory.read && !blocked) memory = emptyMemory();
    cues = { ...cues, [input.id]: memory };
    stableMs = 0;
    visible = false;
    readThisVisit = false;
  } else if (!input.eligible) {
    if (visible && memory.read) blocked = true;
    stableMs = 0;
    visible = false;
  } else if (!blocked) {
    if (visible) {
      const visibleMs = Math.min(DISPLAY_MS, memory.visibleMs + elapsed);
      memory = { ...memory, visibleMs, read: memory.read || visibleMs >= READ_MS };
      readThisVisit ||= memory.read;
      cues = { ...cues, [input.id]: memory };
      if (visibleMs >= DISPLAY_MS) {
        visible = false;
        blocked = true;
      }
    } else {
      // The first eligible observation starts the stability window; its prior
      // interval may have been moving, obscured or outside the viewport.
      stableMs = state.eligible ? Math.min(STABLE_MS, stableMs + elapsed) : 0;
      visible = stableMs >= STABLE_MS;
    }
  }

  const next: CompanionCueState = {
    id: input.id,
    eligible: input.eligible,
    visible,
    stableMs,
    blocked,
    readThisVisit,
    updatedAt: now,
    cues,
  };
  return { state: next, visible, pending: input.eligible && !blocked };
}
