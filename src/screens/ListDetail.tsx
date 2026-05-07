import { useEffect, useState } from "react";
import Avatar from "../components/Avatar";
import { actions, useStore } from "../store";
import type { Task } from "../types";

type Props = {
  listId: string;
  onBack: () => void;
  onEdit: () => void;
};

const isMyTurn = (t: Task) => t.lastServedBy !== "me";

export default function ListDetail({ listId, onBack, onEdit }: Props) {
  const { lists, account } = useStore();
  const list = lists.find((l) => l.id === listId);
  const myName = account?.name ?? "You";
  const [toast, setToast] = useState<string | null>(null);

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

  const nextForMe = list.tasks.find(isMyTurn);

  const flip = (t: Task) => {
    const mine = isMyTurn(t);
    const by = mine ? "me" : "mate";
    actions.serve(list.id, t.id, by);
    setToast(mine ? `Served — ${t.name}` : `${list.mateName} served back`);
  };

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
            const mine = isMyTurn(t);
            return (
              <div className="task" key={t.id}>
                <div className="label">{t.name}</div>
                <button
                  type="button"
                  className={`toggle ${mine ? "mine" : "mate"}`}
                  onClick={() => flip(t)}
                  aria-pressed={!mine}
                  aria-label={`${t.name} — ${mine ? "your serve" : `${list.mateName}'s serve`}`}
                >
                  <span className="toggle-fill" />
                  <span className="toggle-knob" />
                </button>
              </div>
            );
          })
        )}

        {list.tasks.length > 0 && (
          <div className="task serve">
            <div className="label">
              {nextForMe ? nextForMe.name : `Waiting for ${list.mateName}…`}
            </div>
            <button
              className="btn"
              disabled={!nextForMe}
              onClick={() => nextForMe && flip(nextForMe)}
            >
              {nextForMe ? "Serve!" : "Waiting for serve"}
            </button>
          </div>
        )}
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
