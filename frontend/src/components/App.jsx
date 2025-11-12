import { useState } from 'react'
import LoginRegisterPage from './LoginRegisterPage.jsx';
import MainPage from "./MainPage.jsx"
import "../styles/App.css"
import { LoadingProvider } from './LoadingContext.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [token, setToken] = useState(null);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    toast.success('Disconnected');
  }

  return (
    <LoadingProvider>
    <div className='container'>
      {token ? <MainPage token={token} onLogout={handleLogout} /> : <LoginRegisterPage setToken={setToken} />}
       <ToastContainer 
          position="top-center" 
          autoClose={1500} 
          hideProgressBar={false} 
          newestOnTop={false} 
          closeOnClick 
          rtl={false} 
          pauseOnFocusLoss 
          draggable 
          pauseOnHover
          theme='dark'
        />
    </div>
    </LoadingProvider>
  );
}

export default App;

