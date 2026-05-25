"use client";

import { create } from "zustand";
import type { Project, ProjectFile, UserProfile } from "./types";

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  setUser: (u: UserProfile | null) => void;
  setLoading: (b: boolean) => void;
  patchUser: (p: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),
  patchUser: (p) =>
    set((s) => (s.user ? { user: { ...s.user, ...p } } : s)),
}));

interface IDEState {
  project: Project | null;
  activePath: string | null;
  files: ProjectFile[];
  dirty: boolean;
  previewKey: number;          // bump to force iframe reload
  consoleLog: string[];
  setProject: (p: Project | null) => void;
  openFile: (path: string) => void;
  updateFile: (path: string, content: string) => void;
  addFile: (file: ProjectFile) => void;
  deleteFile: (path: string) => void;
  renameFile: (oldPath: string, newPath: string) => void;
  markSaved: () => void;
  bumpPreview: () => void;
  pushLog: (line: string) => void;
  clearLog: () => void;
}

export const useIDEStore = create<IDEState>((set) => ({
  project: null,
  activePath: null,
  files: [],
  dirty: false,
  previewKey: 0,
  consoleLog: [],
  setProject: (project) =>
    set({
      project,
      files: project?.files ?? [],
      activePath: project?.files?.[0]?.path ?? null,
      dirty: false,
      previewKey: 0,
      consoleLog: [],
    }),
  openFile: (activePath) => set({ activePath }),
  updateFile: (path, content) =>
    set((s) => ({
      files: s.files.map((f) => (f.path === path ? { ...f, content } : f)),
      dirty: true,
    })),
  addFile: (file) =>
    set((s) => ({
      files: [...s.files.filter((f) => f.path !== file.path), file],
      activePath: file.path,
      dirty: true,
    })),
  deleteFile: (path) =>
    set((s) => {
      const files = s.files.filter((f) => f.path !== path);
      const activePath =
        s.activePath === path ? files[0]?.path ?? null : s.activePath;
      return { files, activePath, dirty: true };
    }),
  renameFile: (oldPath, newPath) =>
    set((s) => ({
      files: s.files.map((f) =>
        f.path === oldPath ? { ...f, path: newPath } : f
      ),
      activePath: s.activePath === oldPath ? newPath : s.activePath,
      dirty: true,
    })),
  markSaved: () => set({ dirty: false }),
  bumpPreview: () => set((s) => ({ previewKey: s.previewKey + 1 })),
  pushLog: (line) => set((s) => ({ consoleLog: [...s.consoleLog.slice(-200), line] })),
  clearLog: () => set({ consoleLog: [] }),
}));

interface ThemeState {
  theme: "dark" | "light" | "system";
  setTheme: (t: "dark" | "light" | "system") => void;
}
export const useThemeStore = create<ThemeState>((set) => ({
  theme: "dark",
  setTheme: (theme) => set({ theme }),
}));
