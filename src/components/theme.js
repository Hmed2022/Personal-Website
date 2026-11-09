// Night mode for the personal pages (Home, Projects, About me, plus the top bar on About Leghreeb,
// which is already a night scene). Project stories keep their own look:
// App.svelte only puts data-theme="dark" on <html> while one of PERSONAL_PAGES is open.
// index.html applies the saved choice before first paint so a dark visit doesn't flash white.
import { writable } from 'svelte/store';

const KEY = 'theme';
export const PERSONAL_PAGES = ['', '/', '/projects', '/about', '/leghreeb'];

let saved = 'light';
try { if (localStorage.getItem(KEY) === 'dark') saved = 'dark'; } catch (e) { /* storage blocked: default to light */ }

export const theme = writable(saved);
theme.subscribe((v) => { try { localStorage.setItem(KEY, v); } catch (e) { /* ignore */ } });
export const toggleTheme = () => theme.update((v) => (v === 'dark' ? 'light' : 'dark'));
