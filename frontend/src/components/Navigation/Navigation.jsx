import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import EpicStayLogo from '../../../../images/EpicStayLogo.png'
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import './Navigation.css'

const Navigation = ({ isLoaded }) => {
    const sessionUser = useSelector(state => state.session.user);

    const sessionLinks = sessionUser ? (
        <div className='nav-right-profile'>
            <ProfileButton user={sessionUser} />
        </div>
    ) : (
        <div className='nav-right-auth'>
            <OpenModalButton
                buttonText="Log In"
                modalComponent={<LoginFormModal />}
            />
            <NavLink className='auth-link' to="/signup">Sign Up</NavLink>
        </div>
    );

    return (
        <nav className='header-nav'>
            <div className='nav-left'>
                <NavLink to="/"><img className='nav-logo' src={EpicStayLogo} alt="Logo" /></NavLink>
            </div>
            {isLoaded && sessionLinks}
        </nav>
    );
}
export default Navigation