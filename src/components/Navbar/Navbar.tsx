import ArrowBack from '../../assets/arrow-back.svg';
import Menu from '../../assets/menu.svg';

import './Navbar.scss';

export const Navbar = () => {
    return (
        <div className="Navbar">
            <img src={ArrowBack} alt="arrow back" className="Navbar__Image" />
            <img src={Menu} alt="menu" className="Navbar__Image" />
            <div className="Navbar__Text">Просмотр</div>
            <div className="Navbar__Text">Управление</div>
        </div>
    )
}