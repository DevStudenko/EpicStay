import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { Link } from 'react-router-dom';
import styles from './ProfileButton.module.css';

const ProfileButton = ({ user }) => {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    const toggleMenu = (e) => {
        e.stopPropagation(); // Prevents click from bubbling up to document and closing menu immediately
        setShowMenu(prev => !prev); // Toggle menu visibility
    };

    useEffect(() => {
        const closeMenu = (e) => {
            // Check if click is outside the ref element, and if so, close the menu
            if (ulRef.current && !ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            // Only add event listener if the menu is open
            document.addEventListener('click', closeMenu);
        }

        return () => {
            // Cleanup event listener when component unmounts or when menu toggles
            document.removeEventListener('click', closeMenu);
        };
    }, [showMenu]); // Effect dependencies should include showMenu

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
        setShowMenu(false); // Close menu when logging out
    };

    // Ensure all class names are referenced using styles object
    const ulClassName = `${styles.profile_dropdown}${showMenu ? '' : ` ${styles.hidden}`}`;


    return (
        <>
            <div className={styles.profile_container}>
                {user && (
                    <Link to="/spots/new" className={styles.create_new_spot_link}>
                        Create a New Spot
                    </Link>
                )}
                <MdOutlineKeyboardArrowDown onClick={toggleMenu} className={styles.profile_arrow} />
                <FaUserCircle className={styles.profile_icon} />
            </div>
            <ul className={ulClassName} ref={ulRef}>
                {user ? (
                    <div className={styles.profile_info}>
                        <li className={styles.profile_item}>Hello, {user.firstName}</li>
                        <li className={styles.profile_item}>{user.email}</li>
                        <li className={styles.profile_item}>
                            <Link to="/spots/current" className={styles.manage_spots_link}>
                                Manage Spots
                            </Link>
                        </li>


                        <li>
                            <div className={styles.profile_logout_button_container}>
                                <button onClick={logout}>Log Out</button>
                            </div>
                        </li>
                    </div>
                ) : (
                    <div className={styles.authMenu}>
                        <OpenModalMenuItem
                            itemText="Log In"
                            onItemClick={() => setShowMenu(false)}
                            modalComponent={<LoginFormModal />}
                            authLink={styles.authLink}
                        />
                        <OpenModalMenuItem
                            itemText="Sign Up"
                            onItemClick={() => setShowMenu(false)}
                            modalComponent={<SignupFormModal />}
                            authLink={styles.authLink}
                        />
                    </div>
                )}
            </ul>
        </>
    );
};

export default ProfileButton;

