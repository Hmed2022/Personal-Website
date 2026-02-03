import { writable } from "svelte/store";

export const nameId = writable(13);
export const language = writable("English");
export const filterQuran = writable(false);
export const filterDerived = writable(false);
export const filterHadith = writable(false);
export const showDisputed = writable(false);
export const audioPlaying = writable(false);
export const audioCurrentTime = writable(0);
export const seekToTime = writable(null);
