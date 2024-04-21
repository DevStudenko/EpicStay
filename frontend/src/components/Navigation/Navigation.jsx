import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import EpicStayLogo from '../../../../images/EpicStayLogo.png'
import styles from './Navigation.module.css';

const Navigation = ({ isLoaded }) => {
    const sessionUser = useSelector(state => state.session.user);

    return (
        <nav className={styles.header_nav}>
            <div className={styles.nav_left}>
                <NavLink to="/"><img className={styles.nav_logo} src={EpicStayLogo} alt="Logo" /></NavLink>
            </div>
            {isLoaded && (
                <div className={styles.nav_right_logo}>
                    <ProfileButton user={sessionUser} />
                </div>
            )}
        </nav>
    );
}
export default Navigation