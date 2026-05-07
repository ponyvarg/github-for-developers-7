type Props = {
  variant?: "purple" | "orange";
};

export default function Logo({ variant = "purple" }: Props) {
  return (
    <div className="logo-card">
      <div className={`logo-mark ${variant === "orange" ? "orange" : ""}`}>
        <span className="ping">ping</span>
        <span className="pong">pong</span>
      </div>
    </div>
  );
}
