import { useEffect, useState } from "react";
import Avatar from "../components/Avatar";
import { actions, useStore } from "../store";
import type { PlayerKey, Task } from "../types";

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
  const [toastClosing, setToastClosing] = useState(false);
  const [smashId, setSmashId] = useState<string | null>(null);
  const [scoreFlash, setScoreFlash] = useState<PlayerKey | null>(null);

  useEffect(() => {
    if (!toast) return;
    setToastClosing(false);
    const closeAt = setTimeout(() => setToastClosing(true), 2200);
    const dropAt = setTimeout(() => setToast(null), 2500);
    return () => {
      clearTimeout(closeAt);
      clearTimeout(dropAt);
    };
  }, [toast]);

  useEffect(() => {
    if (!smashId) return;
    const id = setTimeout(() => setSmashId(null), 700);
    return () => clearTimeout(id);
  }, [smashId]);

  useEffect(() => {
    if (!scoreFlash) return;
    const id = setTimeout(() => setScoreFlash(null), 600);
    return () => clearTimeout(id);
  }, [scoreFlash]);

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

  const flip = (t: Task) => {
    const mine = isMyTurn(t);
    const by: PlayerKey = mine ? "me" : "mate";
    actions.serve(list.id, t.id, by);
    setSmashId(t.id);
    setScoreFlash(by);
    setToast(mine ? `Smashed — ${t.name}` : `${list.mateName} smashed back`);
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
          <div className={`score ${scoreFlash ? `flash ${scoreFlash}` : ""}`}>
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
            const smashing = smashId === t.id;
            return (
              <div className="task" key={t.id}>
                <div className="label">{t.name}</div>
                <button
                  type="button"
                  className={`toggle ${mine ? "mine" : "mate"} ${smashing ? "smashing" : ""}`}
                  onClick={() => flip(t)}
                  aria-pressed={!mine}
                  aria-label={`${t.name} — ${mine ? "your smash" : `${list.mateName}'s smash`}`}
                >
                  <span className="toggle-knob" />
                  <span className="toggle-trail" aria-hidden />
                  {smashing && <span className="smash-text">SMASH!</span>}
                </button>
              </div>
            );
          })
        )}

      </div>

      {toast && (
        <div
          className={`ios-notif ${toastClosing ? "closing" : ""}`}
          role="status"
          aria-live="polite"
        >
          <div className="ios-notif-icon" aria-hidden>
            pp
          </div>
          <div className="ios-notif-body">
            <div className="ios-notif-row">
              <strong className="ios-notif-app">Ping Pong</strong>
              <span className="ios-notif-time">now</span>
            </div>
            <div className="ios-notif-msg">{toast}</div>
          </div>
        </div>
      )}
    </div>
  );
}

