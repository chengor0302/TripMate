import { useState, useEffect } from "react";
import { useLoading } from "./LoadingContext.jsx";

function Profile({ token, onBack }) {
  const {setLoading} = useLoading();
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchProfileData = async () => {
      try {
        const res = await fetch("http://localhost:5000/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch profile data");

        setUserName(data.name);
        setEmail(data.email);
        setProfileImage(data.profileImage || "");
      } catch (err) {
        setError(err.message);
      } finally{
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [token]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleDeleteImage = () => {
  setFile(null);
  setPreview(null);
  setProfileImage(""); 
  setIsDeleted(true); 
};

const handleSave = async (e) => {
  setLoading(true);
  e.preventDefault();
  const formData = new FormData();
  formData.append("name", userName);

  if (file) {
    formData.append("profileImage", file);
  } else if (isDeleted) {
    formData.append("isDeleted", "true"); 
  }

  try {
    const res = await fetch("http://localhost:5000/auth/profile", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to save profile");

    setUserName(data.name);
    setProfileImage(data.profileImage || "");
    setPreview(null);
    setIsEditing(false);
    setIsDeleted(false); 
  } catch (err) {
    setError(err.message);
  }
  finally{
    setLoading(false);
  }
};


  const displayedImage =
    preview ||
    (profileImage ? `http://localhost:5000${profileImage}` : "/defaultProfilePic.jpeg");

  return (
    <div className="container">
      <button className="button" onClick={onBack}>Back</button>
      <h1>Profile Info</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>Email: {email}</p>

      {isEditing ? (
        <form onSubmit={handleSave}>
          <label>
            User Name:
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </label>
          <br />

          <label>
            Upload Profile Image:
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
          <br />
          <img
            src={displayedImage}
            alt="Profile Preview"
            width={100}
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
          <br />
          {(profileImage || preview) && (
            <button
              type="button"
              className="button delete"
              onClick={handleDeleteImage}
            >
              Delete Image
            </button>
          )}
          <br />
          <button className="button" type="submit">Save</button>
          <button className="button" type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <>
          <p>User Name: {userName}</p>
          <img
            src={displayedImage}
            alt="Profile"
            width={100}
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
          <button className="button" onClick={() => setIsEditing(true)}>Edit Profile</button>
        </>
      )}
    </div>
  );
}

export default Profile;
