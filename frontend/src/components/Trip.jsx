import { useState } from "react";
import AddFriend from "./AddFriend";
import { FaEdit, FaTrash, FaPlus, FaUser, FaArrowLeft } from "react-icons/fa";
import { useLoading } from "./LoadingContext.jsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Trip({ token, trip, onEdit, onDelete, onBack }) {
    const {setLoading} = useLoading();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
    dest: trip.dest,
    description: trip.description,
    startDate: trip.startDate,
    endDate: trip.endDate,
    members: trip.members,
    hotel: trip.hotel,
    flights: trip.flights,
  });
  const [members, setMembers] = useState(trip.members);
  const [addingFriend, setAddingFriend] = useState(false);
  const [showDetails, setShowDetails] = useState(true); 

  const handleSave = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/trips/${trip._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dest: formData.dest,
          description: formData.description,
          startDate: formData.startDate,
          endDate: formData.endDate,
          hotel: formData.hotel,
        }),
      });

      if (!res.ok) throw new Error("Failed to save changes");
      const modifiedTrip = await res.json();
      onEdit(modifiedTrip);
      setIsEditing(false);
      toast.success("Trip updated successfully");
    } catch (err) {
      toast.error(err.message);
    } finally{
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    if (!window.confirm("Are you sure you want to delete this trip?")) return;
    try {
      const res = await fetch(`http://localhost:5000/trips/${trip._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete Trip");
      onDelete(trip._id);
      toast.success("Trip Deleted successfully");
    } catch (err) {
      toast.error(err.message);
    }
    finally{
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (addingFriend) {
    return (
      <AddFriend
        token={token}
        tripId={trip._id}
        onFriendAdded={(updatedTrip) => {
          setMembers(updatedTrip.members);
          onEdit(updatedTrip);
          setAddingFriend(false);
        }}
        onCancel={() => setAddingFriend(false)}
      />
    );
  }

  return (
    <div className="trip-card">
      {showDetails && (
        <>
          {isEditing ? (
            <div className="trip-form">
              <form onSubmit={handleSave}>
                <input
                  type="text"
                  name="dest"
                  placeholder="Destination"
                  value={formData.dest}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                />
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="hotel"
                  placeholder="Hotel"
                  value={formData.hotel}
                  onChange={handleChange}
                />
                <div className="form-buttons">
                  <button className="button" type="submit">
                    Save
                  </button>
                  <button
                    className="button"
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        dest: trip.dest,
                        description: trip.description,
                        startDate: trip.startDate,
                        endDate: trip.endDate,
                        hotel: trip.hotel,
                        flights: trip.flights,
                        members: trip.members,
                      });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="trip-details">
              <h2 className="trip-title">{trip.dest}</h2>
              <p><strong>Description:</strong> {trip.description}</p>
              <p><strong>Start Date:</strong> {trip.startDate}</p>
              <p><strong>End Date:</strong> {trip.endDate}</p>
              <p><strong>Hotel:</strong> {trip.hotel}</p>

              <div className="trip-members">
                {trip.members && trip.members.length > 0 ? (
                  trip.members.map((p, i) => (
                    <div key={i} className="member-item">
                      <FaUser /> {p.name}
                    </div>
                  ))
                ) : (
                  <div>No participants yet</div>
                )}
              </div>

              <div className="trip-actions">
                <button className="button" onClick={onBack}><FaArrowLeft /> Back</button>
                <button className="button" onClick={handleDelete}><FaTrash /> Delete</button>
                <button className="button" onClick={() => setIsEditing(true)}><FaEdit /> Edit</button>
                <button className="button" onClick={() => setAddingFriend(true)}><FaPlus /> Add friends</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Trip;
