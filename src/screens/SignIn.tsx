import { useState } from "react";
import Logo from "../components/Logo";
import { actions } from "../store";

export default function SignIn() {
  const [name, setName] = useState("");
  return (
    <div className="screen">
      <div className="screen-body">
        <div className="brand-row">
          <span className="pp-mini">pp</span>
          <span className="name">Ping pong</span>
          <span className="tag">100% equal</span>
        </div>
        <Logo />
        <p style={{ color: "var(--text-dim)", fontSize: 14, marginTop: -4 }}>
          A shared list for two — split chores 50/50 by passing them back and
          forth like a rally.
        </p>
        <div className="field">
          <div className="field-label">What's your name?</div>
          <input
            className="input"
            placeholder="e.g. Alex"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>
        <div style={{ marginTop: 24 }}>
          <button
            className="btn"
            onClick={() => actions.signUp(name)}
            disabled={!name.trim()}
          >
            Sign up
          </button>
        </div>
        <p style={{ color: "var(--text-dim)", fontSize: 12, marginTop: 18, textAlign: "center" }}>
          Demo build — your data stays in this browser.
        </p>
      </div>
    </div>
  );
}
