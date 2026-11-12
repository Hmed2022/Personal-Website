// The joke note in the binder ($20 or €20): what it was, and whether you gave it to Dali or kept it.
// Shared so Dali can bring it up again later in the piece (see the "Why French?" answer in TunInfo.svelte).
import { writable } from 'svelte/store';

export const strayNote = writable({ tag: null, choice: null });   // tag: '$20' | '€20'; choice: null | 'gave' | 'kept'

// asked by the floating "Back to the binder" button: the timeline returns to the binder view
export const binderRequest = writable(0);

// true once the reader has sorted the binder (the notebook of questions appears then, and stays)
export const sortedOnce = writable(false);

// asked by Dali's "Sort the notes" button under the binder: the binder sorts itself, same as its own button
export const sortRequest = writable(0);
