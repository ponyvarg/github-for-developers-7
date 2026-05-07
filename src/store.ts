import { useEffect, useState } from "react";
import type { AppState, PlayerKey, Task, TaskList } from "./types";

const STORAGE_KEY = "pingpong:v1";

const seed: AppState = {
  account: null,
  lists: [],
};

const seededDemo = (name: string): AppState => ({
  account: { name, role: "Player" },
  lists: [
    {
      id: id(),
      name: "Some things to do",
      mateName: "Sam",
      meScore: 1,
      mateScore: 3,
      tasks: [
        { id: id(), name: "Do laundry", lastServedBy: "mate", meCount: 0, mateCount: 2 },
        { id: id(), name: "Take out the trash", lastServedBy: "mate", meCount: 1, mateCount: 1 },
        { id: id(), name: "Vacuum", lastServedBy: "me", meCount: 1, mateCount: 0 },
        { id: id(), name: "Feed the cat", lastServedBy: null, meCount: 0, mateCount: 0 },
        { id: id(), name: "Feed the neighbour's annoying cat", lastServedBy: null, meCount: 0, mateCount: 0 },
      ],
    },
    {
      id: id(),
      name: "Talk to relatives",
      mateName: "Sam",
      meScore: 5,
      mateScore: 3,
      tasks: [
        { id: id(), name: "Call mom", lastServedBy: "me", meCount: 3, mateCount: 1 },
        { id: id(), name: "Email Aunt Lena", lastServedBy: "mate", meCount: 2, mateCount: 2 },
      ],
    },
  ],
});

export function id(): string {
  return Math.random().toString(36).slice(2, 10);
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed;
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed || typeof parsed !== "object") return seed;
    return parsed;
  } catch {
    return seed;
  }
}

function save(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

type Listener = (s: AppState) => void;
let state: AppState = load();
const listeners = new Set<Listener>();

function emit() {
  save(state);
  listeners.forEach((l) => l(state));
}

export function getState(): AppState {
  return state;
}

export function useStore(): AppState {
  const [s, setS] = useState(state);
  useEffect(() => {
    const fn: Listener = (next) => setS(next);
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, []);
  return s;
}

export const actions = {
  signUp(name: string) {
    state = seededDemo(name || "You");
    emit();
  },
  signOut() {
    state = { account: null, lists: [] };
    emit();
  },
  updateAccount(patch: Partial<{ name: string; role: string }>) {
    if (!state.account) return;
    state = { ...state, account: { ...state.account, ...patch } };
    emit();
  },
  createList(name: string, mateName: string): TaskList {
    const list: TaskList = {
      id: id(),
      name: name.trim() || "New list",
      mateName: mateName.trim() || "Mate",
      meScore: 0,
      mateScore: 0,
      tasks: [],
    };
    state = { ...state, lists: [list, ...state.lists] };
    emit();
    return list;
  },
  deleteList(listId: string) {
    state = { ...state, lists: state.lists.filter((l) => l.id !== listId) };
    emit();
  },
  renameList(listId: string, name: string) {
    state = updateList(state, listId, (l) => ({ ...l, name }));
    emit();
  },
  addTask(listId: string, taskName: string) {
    const t: Task = {
      id: id(),
      name: taskName.trim() || "New task",
      lastServedBy: null,
      meCount: 0,
      mateCount: 0,
    };
    state = updateList(state, listId, (l) => ({ ...l, tasks: [...l.tasks, t] }));
    emit();
  },
  renameTask(listId: string, taskId: string, name: string) {
    state = updateList(state, listId, (l) => ({
      ...l,
      tasks: l.tasks.map((t) => (t.id === taskId ? { ...t, name } : t)),
    }));
    emit();
  },
  deleteTask(listId: string, taskId: string) {
    state = updateList(state, listId, (l) => ({
      ...l,
      tasks: l.tasks.filter((t) => t.id !== taskId),
    }));
    emit();
  },
  reorderTasks(listId: string, taskIds: string[]) {
    state = updateList(state, listId, (l) => {
      const map = new Map(l.tasks.map((t) => [t.id, t]));
      const ordered = taskIds.map((tid) => map.get(tid)).filter(Boolean) as Task[];
      // Add any tasks not in the order list at the end (defensive)
      for (const t of l.tasks) {
        if (!taskIds.includes(t.id)) ordered.push(t);
      }
      return { ...l, tasks: ordered };
    });
    emit();
  },
  serve(listId: string, taskId: string, by: PlayerKey) {
    state = updateList(state, listId, (l) => {
      const tasks = l.tasks.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          lastServedBy: by,
          meCount: by === "me" ? t.meCount + 1 : t.meCount,
          mateCount: by === "mate" ? t.mateCount + 1 : t.mateCount,
        };
      });
      return {
        ...l,
        tasks,
        meScore: by === "me" ? l.meScore + 1 : l.meScore,
        mateScore: by === "mate" ? l.mateScore + 1 : l.mateScore,
      };
    });
    emit();
  },
};

function updateList(
  s: AppState,
  listId: string,
  fn: (l: TaskList) => TaskList
): AppState {
  return {
    ...s,
    lists: s.lists.map((l) => (l.id === listId ? fn(l) : l)),
  };
}

