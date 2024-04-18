import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal'
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { Link } from 'react-router-dom';
import './ProfileButton.css'

const ProfileButton = ({ user }) => {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    const toggleMenu = (e) => {
        e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
        setShowMenu(!showMenu);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
        closeMenu();
    };

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    return (
        <>
            <div className='profile-container'>
                {user && (
                    <Link to="/spots/new" className="create-new-spot-link">
                        Create a New Spot
                    </Link>
                )}
                <MdOutlineKeyboardArrowDown onClick={toggleMenu} className='profile-arrow' />
                <FaUserCircle className='profile-icon' />
            </div>
            <ul className={ulClassName} ref={ulRef}>
                {user ? (
                    <div className='profile-info'>
                        <li className='profile-item'>Hello, {user.firstName}</li>
                        <li className='profile-item'>{user.email}</li>
                        <Link to="/spots/current" className="manage-spots-link">
                            Manage Spots
                        </Link>
                        <li>
                            <div className="profile-logout-button-container">
                                <button onClick={logout}>Log Out</button>
                            </div>
                        </li>
                    </div>
                ) : (
                    <>
                        <OpenModalMenuItem
                            itemText="Log In"
                            onItemClick={closeMenu}
                            modalComponent={<LoginFormModal />}
                        />
                        <OpenModalMenuItem
                            itemText="Sign Up"
                            onItemClick={closeMenu}
                            modalComponent={<SignupFormModal />}
                        />
                    </>
                )}
            </ul>
        </>
    );
}

export default ProfileButton;
