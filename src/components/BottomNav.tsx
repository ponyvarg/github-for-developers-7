import type { Tab } from "../App";

type Props = {
  active: Tab;
  onChange: (tab: Tab) => void;
};

export default function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="bottom-nav">
      <button
        className={active === "play" ? "active" : ""}
        onClick={() => onChange("play")}
      >
        PLAY
      </button>
      <button
        className={active === "account" ? "active" : ""}
        onClick={() => onChange("account")}
      >
        ACCOUNT
      </button>
    </nav>
  );
}
