export type PlayerKey = "me" | "mate";

export type Task = {
  id: string;
  name: string;
  // -1 = mate did it last (lead), 0 = balanced, +1 = me did it last (lead)
  // We use a numeric "lead" tracking who served most recently across history.
  lastServedBy: PlayerKey | null;
  meCount: number;
  mateCount: number;
};

export type TaskList = {
  id: string;
  name: string;
  mateName: string;
  // counts of completed serves per player for the whole list
  meScore: number;
  mateScore: number;
  tasks: Task[];
};

export type Account = {
  name: string;
  role: string;
};

export type AppState = {
  account: Account | null;
  lists: TaskList[];
};
