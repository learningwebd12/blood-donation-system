import { useState } from "react";

export default function LocationSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const searchLocation = async (q) => {
    if (q.length < 3) return;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${q}&countrycodes=np`,
    );
    const data = await res.json();
    setResults(data);
  };

  return (
    <div>
      <input
        placeholder="Search location in Nepal"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          searchLocation(e.target.value);
        }}
      />

      <ul>
        {results.map((r) => (
          <li
            key={r.place_id}
            style={{ cursor: "pointer" }}
            onClick={() => {
              onSelect({
                address: r.display_name,
                lat: r.lat,
                lon: r.lon,
              });
              setQuery(r.display_name);
              setResults([]);
            }}
          >
            {r.display_name}
          </li>
        ))}
      </ul>
    </div>
  );
}
