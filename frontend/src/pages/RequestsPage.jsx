import { useEffect, useState } from "react";
import ViewRequests from "../components/ViewRequests";
import API from "../api/api";

export default function RequestsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/profile/me")
      .then((res) => setUser(res.data.user))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>No user data found</p>;

  return <ViewRequests userProvince={user.location?.province} />;
}
