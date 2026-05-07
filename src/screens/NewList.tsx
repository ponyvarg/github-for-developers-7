import { useState } from "react";
import { actions } from "../store";

type Props = {
  onCancel: () => void;
  onCreated: (listId: string) => void;
};

export default function NewList({ onCancel, onCreated }: Props) {
  const [name, setName] = useState("");
  const [mate, setMate] = useState("");
  const canSave = name.trim().length > 0;

  const submit = () => {
    if (!canSave) return;
    const list = actions.createList(name, mate);
    onCreated(list.id);
  };

  return (
    <div className="screen">
      <div className="topbar">
        <div className="left">
          <button className="icon-btn" onClick={onCancel} aria-label="Back">
            ‹
          </button>
        </div>
        <div className="title">New list</div>
        <div className="right">
          <button
            className="link-btn"
            onClick={submit}
            disabled={!canSave}
          >
            Save
          </button>
        </div>
      </div>
      <div className="screen-body">
        <div className="field">
          <div className="field-label">Give the list a name</div>
          <input
            className="input"
            placeholder="e.g. Some things to do"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>
        <div className="field">
          <div className="field-label">Invite a mate</div>
          <input
            className="input"
            placeholder="Mate's name or email"
            value={mate}
            onChange={(e) => setMate(e.target.value)}
          />
        </div>
        <div style={{ marginTop: 24 }}>
          <button className="btn" onClick={submit} disabled={!canSave}>
            Create list
          </button>
        </div>
      </div>
    </div>
  );
}
