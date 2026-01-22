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
        placeholder="Search by title, ingredient, or instructions..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search recipes"
      />

      <button
        className="btn"
        type="button"
        onClick={() => onChange("")}
        disabled={!value}
        aria-label="Clear search"
      >
        Clear
      </button>
    </div>
  );
}
