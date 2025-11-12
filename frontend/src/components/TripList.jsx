import { useEffect, useState } from "react";
import AddTripForm from "./AddTripForm";
import Trip from "./Trip.jsx";
import { FaEdit, FaTrash, FaPlus, FaUser,FaArrowLeft } from "react-icons/fa";
import { useLoading } from "./LoadingContext.jsx";


function TripList({ token, onBack }) {
  const {setLoading} = useLoading();
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState(null);
  const [addingTrip, setAddingTrip] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [totalTrips, setTotalTrips] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const limitPerPage = 10;

  useEffect(() => {
    setLoading(true);
    const fetchTrips = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/trips?page=${currentPage}&limit=${limitPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch trips");

        setTrips(data.trips);
        setTotalTrips(data.totalTrips);
        setLoading(false);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTrips();
  }, [token, currentPage, addingTrip]);

  if (addingTrip)
    return (
      <AddTripForm
        token={token}
        onTripAdded={(newTrip) => {
          setTrips([...trips, newTrip]);
          setAddingTrip(false);
        }}
        onCancel={() => setAddingTrip(false)}
      />
    );

  if (selectedTrip)
    return (
      <Trip
        token={token}
        trip={selectedTrip}
        onEdit={(updatedTrip) => {
          setTrips(trips.map((t) => (t._id === updatedTrip._id ? updatedTrip : t)));
          setSelectedTrip(updatedTrip); 
        }}
        onDelete={(tripId) => {
          setTrips(trips.filter((t) => t._id !== tripId));
          setSelectedTrip(null);
        }}
        onBack={() => setSelectedTrip(null)}
      />
    );

  const totalPages =
    totalTrips > 0 ? Math.ceil(totalTrips / limitPerPage) : 1;

  return (
    <div>
      <button className="button" onClick={onBack}>
        <FaArrowLeft /> Back
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h1 className="h1">My Trips:</h1>

      {trips.length > 0 ? (
        <ul>
          {trips.map((trip) => (
            <li key={trip._id}>
              <button
                className="button"
                onClick={() => setSelectedTrip(trip)}
              >
                {trip.dest}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <h2>You have no trips planned</h2>
      )}

      <div className="pagination">
        <button
          className="button"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="button"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
        <button className="button" onClick={() => setAddingTrip(true)}>
           <FaPlus /> Add Trip
        </button>
      </div>
    </div>
  );
}

export default TripList;
