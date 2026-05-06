import { useState } from "react";
import Avatar from "../components/Avatar";
import { actions, useStore } from "../store";

type Props = {
  listId: string;
  onBack: () => void;
  onLeft: () => void;
};

export default function EditList({ listId, onBack, onLeft }: Props) {
  const { lists, account } = useStore();
  const list = lists.find((l) => l.id === listId);
  const myName = account?.name ?? "You";
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");

  if (!list) {
    return (
      <div className="screen">
        <div className="topbar">
          <div className="left">
            <button className="icon-btn" onClick={onBack}>
              ‹
            </button>
          </div>
          <div className="title">Edit</div>
          <div className="right" />
        </div>
        <div className="screen-body">
          <p className="empty">List not found.</p>
        </div>
      </div>
    );
  }

  const startAdd = () => {
    setAdding(true);
    setNewName("");
  };
  const commitAdd = () => {
    if (newName.trim()) actions.addTask(list.id, newName);
    setAdding(false);
    setNewName("");
  };
  const startEdit = (taskId: string, current: string) => {
    setEditingId(taskId);
    setEditingValue(current);
  };
  const commitEdit = () => {
    if (editingId && editingValue.trim()) {
      actions.renameTask(list.id, editingId, editingValue.trim());
    }
    setEditingId(null);
  };
  const leave = () => {
    if (confirm(`Leave "${list.name}"?`)) {
      actions.deleteList(list.id);
      onLeft();
    }
  };

  return (
    <div className="screen">
      <div className="topbar">
        <div className="left">
          <button className="icon-btn" onClick={onBack} aria-label="Back">
            ‹
          </button>
        </div>
        <div className="title">Edit</div>
        <div className="right">
          <button className="icon-btn" onClick={startAdd} aria-label="Add task">
            +
          </button>
        </div>
      </div>
      <div className="screen-body">
        <div className="dual-avatars">
          <Avatar name={myName} variant="me" size="lg" />
          <Avatar name={list.mateName} variant="mate" size="lg" />
        </div>
        <div className="center-name">{list.name}</div>

        {adding && (
          <div className="edit-row">
            <span className="grip">≡</span>
            <div className="row-name">
              <input
                autoFocus
                placeholder="New task name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitAdd();
                  if (e.key === "Escape") {
                    setAdding(false);
                    setNewName("");
                  }
                }}
                onBlur={commitAdd}
              />
            </div>
            <span />
            <span />
          </div>
        )}

        {list.tasks.map((t) => {
          const isEditing = editingId === t.id;
          return (
            <div className="edit-row" key={t.id}>
              <span className="grip" aria-hidden>
                ≡
              </span>
              <div className="row-name">
                {isEditing ? (
                  <input
                    autoFocus
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitEdit();
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    onBlur={commitEdit}
                  />
                ) : (
                  <span>{t.name}</span>
                )}
              </div>
              <button
                className="row-act"
                onClick={() => startEdit(t.id, t.name)}
                aria-label="Edit task"
                title="Rename"
              >
                ✎
              </button>
              <button
                className="row-act"
                onClick={() => actions.deleteTask(list.id, t.id)}
                aria-label="Delete task"
                title="Delete"
              >
                🗑
              </button>
            </div>
          );
        })}

        {!adding && (
          <div style={{ marginTop: 14 }}>
            <button className="add-btn" onClick={startAdd}>
              + Add new task
            </button>
          </div>
        )}

        <div className="spacer" />
        <div className="danger-zone">
          <button className="btn btn-ghost" onClick={leave}>
            Leave this list
          </button>
        </div>
      </div>
    </div>
  );
}
