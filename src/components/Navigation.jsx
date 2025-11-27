// components/Navigation.js
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
    const location = useLocation();

    return (
        <nav className="main-navigation">
            <div className="nav-brand">
                <Link to="/" className="nav-brand-link">
                    <h2><b>Трекер технологий</b></h2>
                </Link>
            </div>

            <ul className="nav-menu">
                <li>
                    <Link
                        to="/"
                        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        Главная
                    </Link>
                </li>
                <li>
                    <Link
                        to="/technologies"
                        className={`nav-link ${location.pathname === '/technologies' ? 'active' : ''}`}
                    >
                        Все
                    </Link>
                </li>
                <li>
                    <Link
                        to="/bulk-edit"
                        className={`nav-link ${location.pathname === '/bulk-edit' ? 'active' : ''}`}
                    >
                        Массовое редактирование
                    </Link>
                </li>
                <li>
                    <Link
                        to="/add-technology"
                        className={`nav-link ${location.pathname === '/add-technology' ? 'active' : ''}`}
                    >
                        Добавить
                    </Link>
                </li>
                <li>
                    <Link
                        to="/statistics"
                        className={`nav-link ${location.pathname === '/statistics' ? 'active' : ''}`}
                    >
                        Статистика
                    </Link>
                </li>
                <li>
                    <Link
                        to="/settings"
                        className={`nav-link ${location.pathname === '/settings' ? 'active' : ''}`}
                    >
                        Настройки
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navigation;