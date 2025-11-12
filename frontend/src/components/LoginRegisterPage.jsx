import { useState } from "react";
import { useLoading } from "./LoadingContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoginRegisterPage({setToken}) {
    const {setLoading} = useLoading();
    const [isLogin, setIsLogin] = useState(true); //Shows login form by defualt
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    //A function that takes care of pressing submit in case of login/ register
    const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const url = isLogin
      ? 'http://localhost:5000/auth/login'
      : 'http://localhost:5000/auth/register';
    const body = isLogin ? { email, password } : { name, email, password };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        if (isLogin) setToken(data.token);
        toast.success('Success');
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
};


return (
    <div>
        <h2 className='h2'> {isLogin? 'Login' : 'Register'} </h2>
        <form onSubmit={handleSubmit}>
        { !isLogin && (
            <input
            type = 'text'
            placeholder="Name"
            value={name}
            onChange={(e)=>{setName(e.target.value)}}
            required
            />
        )}
        <input
        type='text'
        placeholder="Email"
        value={email}
        onChange = {(e)=>setEmail(e.target.value)}
        required
        />
        <input
        type = 'password'
        placeholder = "Password"
        value = {password}
        onChange = {(e) => setPassword(e.target.value)}
        required
        />
        <div><button type="submit" className="button">{isLogin ? 'Login' : 'Register'}</button> </div>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: 'pointer' }}>
        {isLogin ? 'Create an account' : 'Already have an account? Login'}
        </p>
    </div>
);

}
export default LoginRegisterPage;