import { FiMenu } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

const Navbar = ({ onMenuClick, title }) => {
  return (
    <header className="navbar">
      <button className="navbar-menu" onClick={onMenuClick}>
        <FiMenu />
      </button>
      <h1 className="navbar-title">{title}</h1>
      <div className="navbar-actions">
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Navbar;
