interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div style={{ margin: "1rem 0" }}>
      <input
        type="text"
        placeholder="Search by ingredient (e.g. chicken)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", padding: "0.5rem" }}
      />
    </div>
  );
}
