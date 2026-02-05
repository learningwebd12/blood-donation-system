import { useEffect, useState } from "react";
import API from "../api/api";

export default function CompleteProfile() {
  const [locations, setLocations] = useState({});
  const [form, setForm] = useState({
    userType: [],
    bloodType: "",
    province: "",
    district: "",
    age: "",
    weight: "",
    gender: "",
  });

  useEffect(() => {
    API.get("/profile/locations").then((res) =>
      setLocations(res.data.locations),
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/profile/complete", form);
      alert("Profile completed");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Complete Profile</h2>

      <label>
        <input
          type="checkbox"
          onChange={(e) =>
            setForm({
              ...form,
              userType: e.target.checked ? ["donor"] : [],
            })
          }
        />
        Donor
      </label>

      <label>
        <input
          type="checkbox"
          onChange={(e) =>
            setForm({
              ...form,
              userType: e.target.checked
                ? [...form.userType, "receiver"]
                : form.userType.filter((u) => u !== "receiver"),
            })
          }
        />
        Receiver
      </label>

      {form.userType.includes("donor") && (
        <select
          onChange={(e) => setForm({ ...form, bloodType: e.target.value })}
        >
          <option value="">Select Blood Group</option>
          <option>A+</option>
          <option>A-</option>
          <option>B+</option>
          <option>B-</option>
          <option>AB+</option>
          <option>AB-</option>
          <option>O+</option>
          <option>O-</option>
        </select>
      )}

      <select onChange={(e) => setForm({ ...form, province: e.target.value })}>
        <option value="">Province</option>
        {Object.keys(locations).map((p) => (
          <option key={p}>{p}</option>
        ))}
      </select>

      <select onChange={(e) => setForm({ ...form, district: e.target.value })}>
        <option value="">District</option>
        {form.province &&
          locations[form.province]?.districts.map((d) => (
            <option key={d}>{d}</option>
          ))}
      </select>

      <input
        placeholder="Age"
        onChange={(e) => setForm({ ...form, age: e.target.value })}
      />
      <input
        placeholder="Weight"
        onChange={(e) => setForm({ ...form, weight: e.target.value })}
      />

      <select onChange={(e) => setForm({ ...form, gender: e.target.value })}>
        <option value="">Gender</option>
        <option>male</option>
        <option>female</option>
        <option>other</option>
      </select>

      <button type="submit">Save</button>
    </form>
  );
}
