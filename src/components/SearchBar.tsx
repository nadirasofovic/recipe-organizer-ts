interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="searchRow">
      <input
        className="input"
        type="text"
        placeholder="Search by ingredient (e.g. mlijeko)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      <button
        className="btn"
        type="button"
        onClick={() => onChange("")}
        disabled={!value}
      >
        Clear
      </button>
    </div>
  );
}
