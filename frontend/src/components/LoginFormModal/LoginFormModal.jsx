import { useState, useEffect } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import styles from './LoginForm.module.css';



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
        <div className={styles.main}>
            <h1>Log In</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.input_group}>
                    Username or Email
                    <input
                        type="text"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        required
                        autoComplete="username"
                        className={styles.input}
                    />
                </label>
                {errors.credential && (
                    <p className={styles.error}>{errors.credential}</p>
                )}
                <label className={styles.input_group}>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                        className={styles.input}
                    />
                </label>
                {errors.password && (
                    <p className={styles.error}>{errors.password}</p>
                )}
                {errors.message && (
                    <p className={styles.error}>{errors.message}</p>
                )}
                <button className={styles.button} disabled={credential.length < 4 || password.length < 6} type="submit">Log In</button>
                <button className={styles.demo} onClick={handleDemoLogin}>Demo Login</button>
            </form>
        </div>
    );
}

export default LoginFormModal