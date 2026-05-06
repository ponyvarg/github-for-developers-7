import { useState } from "react";
import Avatar from "../components/Avatar";
import { actions, useStore } from "../store";

export default function Account() {
  const { account } = useStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(account?.name ?? "");
  const [role, setRole] = useState(account?.role ?? "Player");

  if (!account) return null;

  const save = () => {
    actions.updateAccount({ name: name.trim() || account.name, role: role.trim() || account.role });
    setEditing(false);
  };

  return (
    <div className="screen">
      <div className="topbar">
        <div className="left" />
        <div className="title">Account</div>
        <div className="right">
          {editing ? (
            <button className="link-btn" onClick={save}>
              Save
            </button>
          ) : (
            <button className="link-btn" onClick={() => setEditing(true)}>
              Edit
            </button>
          )}
        </div>
      </div>
      <div className="screen-body">
        <div className="account-row">
          <Avatar name={account.name} variant="me" size="lg" />
          <div className="meta">
            {editing ? (
              <>
                <input
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ marginBottom: 6 }}
                />
                <input
                  className="input"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </>
            ) : (
              <>
                <div className="name">{account.name}</div>
                <div className="role">{account.role}</div>
              </>
            )}
          </div>
        </div>

        <div className="spacer" />
        <div style={{ marginTop: 24 }}>
          <button
            className="btn btn-ghost"
            onClick={() => {
              if (confirm("Log out and clear local data?")) actions.signOut();
            }}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
