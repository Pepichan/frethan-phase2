import React, { useEffect, useState } from "react";

interface Supplier {
  _id: string;
  name: string;
  country: string;
  rating: number;
}

export default function SupplierList() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/suppliers")
      .then((res) => res.json())
      .then((data) => setSuppliers(data))
      .catch((err) => console.log("Error fetching suppliers:", err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ color: "red" }}>THIS IS SUPPLIER PAGE</h1>

      <p>List of verified suppliers stored in MongoDB:</p>

      <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
        {suppliers.map((s) => (
          <div
            key={s._id}
            style={{
              border: "1px solid #ddd",
              padding: "1rem",
              borderRadius: "8px",
            }}
          >
            <h3>{s.name}</h3>
            <p>Country: {s.country}</p>
            <p>Rating: ⭐ {s.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
