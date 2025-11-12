import { useState } from "react";
import {FaSearch } from "react-icons/fa";
import { useLoading } from "./LoadingContext.jsx";

function AddFriend({ token, tripId, onFriendAdded, onCancel }) {
  const {setLoading} = useLoading();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    if (!query) return;
    try {
      const res = await fetch(`http://localhost:5000/auth/search?name=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to search users");
      setResult(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally{
      setLoading(false);
    }
  };

  const handleAddFriend = async (userId) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/trips/${tripId}/add-friend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add friend");

      onFriendAdded(data); 
      setResult([]);
      setQuery("");
      setError(null);
    } catch (err) {
      setError(err.message);
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Add Friend</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text"
        placeholder="Search friend by user name"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="button" onClick={handleSearch}>
        <FaSearch/> Search
      </button>

      <ul>
        {result.map((user) => (
          <li key={user._id}>
            {user.name} ({user.email}){" "}
            <button className="button" onClick={() => handleAddFriend(user._id)}>
              Add
            </button>
          </li>
        ))}
      </ul>

      <button className="button" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
}

export default AddFriend;
