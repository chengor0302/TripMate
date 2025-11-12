import { useState, useEffect } from "react";
import TripList from "./TripList.jsx";
import mainImage from "../assets/mainImage.jpeg";
import Profile from "./Profile.jsx";
import { useLoading } from "./LoadingContext.jsx";

function MainPage({ token, onLogout }) {
  const { setLoading } = useLoading();
  const [showTrips, setShowTrips] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400); 
    return () => clearTimeout(timer);
  }, [showTrips, showProfile]);


  if (showTrips) {
    return <TripList token={token} onBack={() => setShowTrips(false)} />;
  }

  if (showProfile) {
    return <Profile token={token} onBack={() => setShowProfile(false)} />;
  }

  return (
    <div className="container">
      <h1 className="h1">Welcome to TripMate!</h1>
      <h2 className="h2">
        Planning a trip with friends has never been easier!
      </h2>
      <img src={mainImage} alt="Travel" className="main-image" />
      <button className="button" onClick={() => setShowTrips(true)}>
        My trips
      </button>
      <button className="button" onClick={() => setShowProfile(true)}>
        To your profile
      </button>
      <button className="button" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}

export default MainPage;
