import { useState, useEffect } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { NavLink } from 'react-router-dom';
import './LoginForm.css';



const LoginFormModal = () => {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal, modalOpen } = useModal();

    useEffect(() => {
        // Reset the state when the modal is opened or closed
        setCredential("");
        setPassword("");
        setErrors({});
    }, [modalOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.login({ credential, password }))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                } else {
                    setErrors(data);
                }
            });
    };


    const handleDemoLogin = (e) => {
        e.preventDefault();
        setErrors({});
        // Use the credentials for the demo user to log in
        return dispatch(sessionActions.login({ credential: 'demo@user.io', password: 'password' }))
            .then(closeModal);
    };

    return (
        <>
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Username or Email
                    <input
                        type="text"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        required
                        autoComplete="username"
                    />
                </label>
                {errors.credential && (
                    <p className='errors'>{errors.credential}</p>
                )}
                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                    />
                </label>
                {errors.password && (
                    <p className='errors'>{errors.password}</p>
                )}
                {errors.message && (
                    <p className='errors'>{errors.message}</p>
                )}
                <button disabled={credential.length < 4 || password.length < 6} type="submit">Log In</button>
                <button className='demo-login' onClick={handleDemoLogin}>Demo Login</button>
            </form>
        </>
    );
}

export default LoginFormModal