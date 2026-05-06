import { useEffect, useMemo, useState } from "react";
import Avatar from "../components/Avatar";
import { actions, taskBalance, useStore } from "../store";
import type { Task } from "../types";

type Props = {
  listId: string;
  onBack: () => void;
  onEdit: () => void;
};

export default function ListDetail({ listId, onBack, onEdit }: Props) {
  const { lists, account } = useStore();
  const list = lists.find((l) => l.id === listId);
  const myName = account?.name ?? "You";
  const [toast, setToast] = useState<string | null>(null);
  const [serveIndex, setServeIndex] = useState(0);

  const serveCandidates = useMemo<Task[]>(() => {
    if (!list) return [];
    // Tasks that mate served last (or never), so it's "your" turn
    const yourTurn = list.tasks.filter((t) => t.lastServedBy !== "me");
    return yourTurn.length > 0 ? yourTurn : list.tasks;
  }, [list]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 1500);
    return () => clearTimeout(id);
  }, [toast]);

  if (!list) {
    return (
      <div className="screen">
        <div className="topbar">
          <div className="left">
            <button className="icon-btn" onClick={onBack}>
              ‹
            </button>
          </div>
          <div className="title">List</div>
          <div className="right" />
        </div>
        <div className="screen-body">
          <p className="empty">List not found.</p>
        </div>
      </div>
    );
  }

  const serveTask = serveCandidates[serveIndex % Math.max(serveCandidates.length, 1)];

  return (
    <div className="screen">
      <div className="topbar">
        <div className="left">
          <button className="icon-btn" onClick={onBack} aria-label="Back">
            ‹
          </button>
        </div>
        <div className="title">{list.name}</div>
        <div className="right">
          <button className="link-btn" onClick={onEdit}>
            Edit
          </button>
        </div>
      </div>
      <div className="screen-body">
        <div className="players">
          <Avatar name={myName} variant="me" size="lg" />
          <div className="score">
            {list.meScore} - {list.mateScore}
          </div>
          <Avatar name={list.mateName} variant="mate" size="lg" />
        </div>

        {list.tasks.length === 0 ? (
          <p className="empty">
            No tasks yet — tap <b>Edit</b> to add one.
          </p>
        ) : (
          list.tasks.map((t) => {
            const pos = taskBalance(t) * 100;
            const greenSide = t.lastServedBy === "me"; // recently your turn => mate's lead, shown green-ish
            return (
              <div className="task" key={t.id}>
                <div className="label">{t.name}</div>
                <div
                  className={`bar ${greenSide ? "green" : ""}`}
                  style={{ ["--pos" as string]: `${pos}%` }}
                  aria-label={`${t.name} balance`}
                >
                  <div className="fill-left" />
                  <div className="knob" />
                </div>
              </div>
            );
          })
        )}

        {serveTask && (
          <div className="task serve">
            <div className="label">{serveTask.name}</div>
            <button
              className="btn"
              onClick={() => {
                actions.serve(list.id, serveTask.id, "me");
                setToast(`Served! ${serveTask.name}`);
                setServeIndex((i) => i + 1);
              }}
            >
              Serve!
            </button>
          </div>
        )}
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
