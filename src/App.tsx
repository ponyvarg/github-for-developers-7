import { useState } from "react";
import BottomNav from "./components/BottomNav";
import Account from "./screens/Account";
import AllLists from "./screens/AllLists";
import EditList from "./screens/EditList";
import ListDetail from "./screens/ListDetail";
import NewList from "./screens/NewList";
import SignIn from "./screens/SignIn";
import { useStore } from "./store";

export type Tab = "play" | "account";

type Route =
  | { kind: "lists" }
  | { kind: "new" }
  | { kind: "list"; id: string }
  | { kind: "edit"; id: string };

export default function App() {
  const { account } = useStore();
  const [tab, setTab] = useState<Tab>("play");
  const [route, setRoute] = useState<Route>({ kind: "lists" });

  const showBottomNav = route.kind === "lists";

  return (
    <div className="phone-shell">
      <div className="phone">
        {!account ? (
          <SignIn />
        ) : tab === "account" ? (
          <Account />
        ) : route.kind === "lists" ? (
          <AllLists
            onOpen={(id) => setRoute({ kind: "list", id })}
            onNew={() => setRoute({ kind: "new" })}
          />
        ) : route.kind === "new" ? (
          <NewList
            onCancel={() => setRoute({ kind: "lists" })}
            onCreated={(id) => setRoute({ kind: "list", id })}
          />
        ) : route.kind === "list" ? (
          <ListDetail
            listId={route.id}
            onBack={() => setRoute({ kind: "lists" })}
            onEdit={() => setRoute({ kind: "edit", id: route.id })}
          />
        ) : (
          <EditList
            listId={route.id}
            onBack={() => setRoute({ kind: "list", id: route.id })}
            onLeft={() => setRoute({ kind: "lists" })}
          />
        )}

        {account && (showBottomNav || tab === "account") && (
          <BottomNav
            active={tab}
            onChange={(t) => {
              setTab(t);
              if (t === "play") setRoute({ kind: "lists" });
            }}
          />
        )}
      </div>
    </div>
  );
}
