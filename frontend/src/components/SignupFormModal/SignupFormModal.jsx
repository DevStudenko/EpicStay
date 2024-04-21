import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import styles from './SignupFormPage.module.css'

const SignupFormModal = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal, modalOpen } = useModal();

    useEffect(() => {
        // Reset the state when the modal is opened or closed
        setEmail("");
        setUsername("");
        setFirstName("");
        setLastName("");
        setPassword("");
        setConfirmPassword("");
        setErrors({});
    }, [modalOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let newErrors = {};

        // Validation checks
        if (!email) newErrors.email = "Email is required";
        if (!username) newErrors.username = "Username is required";
        if (!firstName) newErrors.firstName = "First name is required";
        if (!lastName) newErrors.lastName = "Last name is required";
        if (!password) newErrors.password = "Password is required";
        if (!confirmPassword) newErrors.confirmPassword = "Confirm password is required";
        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Confirm Password field must be the same as the Password field";
        }


        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await dispatch(sessionActions.signup({
                email,
                username,
                firstName,
                lastName,
                password
            }));
            closeModal();
        } catch (res) {
            const data = await res.json();

            if (data?.errors) {
                newErrors = { ...newErrors, ...data.errors };
            } else {
                newErrors.message = 'Something went wrong.Please try again.'
            }
            setErrors(newErrors);
        }
    };

    return (
        <div className={styles.main}>
            <h1>Sign Up</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.input_group}>
                    Email
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input}
                        required
                    />
                </label>
                <p className={styles.error}>{errors.email}</p>
                <label className={styles.input_group}>
                    Username
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={styles.input}
                        required
                    />
                </label>
                <p className={styles.error}>{errors.username}</p>
                <label className={styles.input_group}>
                    First Name
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={styles.input}
                        required
                    />
                </label>
                <p className={styles.error}>{errors.firstName}</p>
                <label className={styles.input_group}>
                    Last Name
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        autoComplete="family-name"
                        className={styles.input_group}
                    />
                </label>
                <p className='errors'>{errors.lastName}</p>
                <label className={styles.input_group}>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                        className={styles.input_group}
                    />
                </label>
                <p className='errors'>{errors.password}</p>
                <label className={styles.input_group}>
                    Confirm Password
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={styles.input}
                        required
                    />
                </label>
                <p className={styles.confirmError}>{errors.confirmPassword}</p>
                <button className={styles.button} type="submit" disabled={!email || !username || !firstName || !lastName || !password || !confirmPassword}>Sign Up</button>
            </form>
            <p className={styles.error}>{errors.message}</p>
        </div>
    );
}

export default SignupFormModal;
