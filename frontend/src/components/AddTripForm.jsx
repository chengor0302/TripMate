import { useState } from "react";
import { useLoading } from "./LoadingContext.jsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function AddTripForm({token, onTripAdded, onCancel}){
    const {setLoading} = useLoading();
    const [dest, setDest] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [hotel, setHotel] = useState('')
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try{
            const res = await fetch("/trips", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ dest, description, startDate, endDate, hotel }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(error.data || "Failed to create trip");
            setSuccess(true);
            setDest('');
            setDescription('');
            setStartDate('');
            setEndDate('');
            setHotel('');
            toast.success("Trip Added successfuly!")
            onTripAdded(data);
        } catch(err){
            setError(err.message);
        }
        finally{
            setLoading(false);
        }
    };


    return(
        <div>
            <h1> Add trip</h1>
            <form onSubmit={handleSubmit}>
                <h2>Destination</h2>
                <input 
                type= "text"
                placeholder="Destination"
                value={dest}
                onChange={(e) => {setDest(e.target.value)}}
                required/> <br/>
                <h2>Description</h2>
                <textarea
                placeHolder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                /> <br/>
                <h2>Start Date</h2>
                <input 
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                /> <br/>
                <h2>End Date</h2>
                <input 
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                /> <br/>
                <h2>Hotel name</h2>
                <input 
                type="text"
                placeholder="Hotel"
                value={hotel}
                onChange={(e) => setHotel(e.target.value)}
                /> <br/>
                <button className="button" type="submit"> Add trip</button>
            </form>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '10px' }}>
            <button className='button'type="button" onClick={onCancel}>Cancel</button>
            </div>
            {error && <p style={{color: "red"}}>{error}</p>}
            {success && <p style={{color: "green"}}>Trip added successfuly</p>}
        </div>
    );
}

export default AddTripForm;