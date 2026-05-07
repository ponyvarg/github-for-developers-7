type Props = {
  name: string;
  variant?: "me" | "mate" | "neutral";
  size?: "sm" | "lg";
};

export default function Avatar({ name, variant = "neutral", size = "sm" }: Props) {
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className={`avatar ${size === "lg" ? "lg" : ""} ${variant}`}
      aria-label={name}
      title={name}
    >
      {initials || "?"}
    </div>
  );
}
