import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import EpicStayLogo from '../../../../images/EpicStayLogo.png'
import './Navigation.css';

const Navigation = ({ isLoaded }) => {
    const sessionUser = useSelector(state => state.session.user);

    return (
        <nav className='header-nav'>
            <div className='nav-left'>
                <NavLink to="/"><img className='nav-logo' src={EpicStayLogo} alt="Logo" /></NavLink>
            </div>
            {isLoaded && (
                <div className='nav-right-profile'>
                    <ProfileButton user={sessionUser} />
                </div>
            )}
        </nav>
    );
}
export default Navigation