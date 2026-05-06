import Avatar from "../components/Avatar";
import { useStore } from "../store";

type Props = {
  onOpen: (listId: string) => void;
  onNew: () => void;
};

export default function AllLists({ onOpen, onNew }: Props) {
  const { lists, account } = useStore();
  const myName = account?.name ?? "You";
  return (
    <div className="screen">
      <div className="topbar">
        <div className="left" />
        <div className="title">All lists</div>
        <div className="right">
          <button className="icon-btn" onClick={onNew} aria-label="New list">
            +
          </button>
        </div>
      </div>
      <div className="screen-body">
        {lists.length === 0 ? (
          <div className="empty">
            <div>No lists yet.</div>
            <div style={{ marginTop: 14 }}>
              <button className="btn" onClick={onNew}>
                Create your first list
              </button>
            </div>
          </div>
        ) : (
          lists.map((l) => (
            <button
              key={l.id}
              className="list-card"
              onClick={() => onOpen(l.id)}
            >
              <div className="name">{l.name}</div>
              <div className="score">
                {l.meScore} - {l.mateScore}
              </div>
              <div className="avatar left">
                <Avatar name={myName} variant="me" />
              </div>
              <div className="avatar right">
                <Avatar name={l.mateName} variant="mate" />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
