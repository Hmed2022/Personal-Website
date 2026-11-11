// The joke note in the binder ($20 or €20): what it was, and whether you gave it to Dali or kept it.
// Shared so Dali can bring it up again later in the piece (see the "Why French?" answer in TunInfo.svelte).
import { writable } from 'svelte/store';

export const strayNote = writable({ tag: null, choice: null });   // tag: '$20' | '€20'; choice: null | 'gave' | 'kept'
