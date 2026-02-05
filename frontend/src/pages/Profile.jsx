import { useEffect, useState } from "react";
import API from "../api/api";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get("/profile/me").then((res) => setUser(res.data.user));
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.phone}</p>
      <p>{user.userType?.join(", ")}</p>
      <p>{user.bloodType}</p>
    </div>
  );
}
