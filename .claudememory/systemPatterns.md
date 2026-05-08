# System Patterns

- SPA architecture: React routes are defined in `src/App.tsx`, with `HashRouter` used at the root in `src/main.tsx`.
- Access control pattern: admin access is derived from Firebase auth state, while upload access is gated by a persisted passcode flag in Zustand.
- State pattern: `useQuizStore`, `useAuthStore`, and `useThemeStore` use Zustand persistence; parser text is temporary, while quiz loop state, passcode memory, and theme survive refreshes.
- Data pattern: Firestore access is isolated in `src/api/firestoreService.ts` for batch writes, question reads, updates, and deletes.
- UI pattern: theme is applied by toggling `light`/`dark` classes on the document root; route titles are updated from the active translation strings.
- Parser pattern: question input is converted from loosely formatted text using regex-based question and option detection.
