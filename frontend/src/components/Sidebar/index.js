import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeOutlined, 
  UserOutlined, 
  ShoppingCartOutlined, 
  BookOutlined,
  SettingOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import s from './sidebar.module.scss';

const Sidebar = () => {
  const menuItems = [
    { path: '/', name: 'Ana Sayfa', icon: <HomeOutlined /> },
    { path: '/dashboard', name: 'Dashboard', icon: <DashboardOutlined /> },
    { path: '/users', name: 'Kullanıcılar', icon: <UserOutlined /> },
    { path: '/ingredients', name: 'Malzemeler', icon: <ShoppingCartOutlined /> },
    { path: '/recipes', name: 'Tarifler', icon: <BookOutlined /> },
    { path: '/settings', name: 'Ayarlar', icon: <SettingOutlined /> },
  ];

  return (
    <aside className={s.sidebar}>
      <div className={s.logo}>
        <h2>Bakery</h2>
      </div>
      
      <nav className={s.nav}>
        <ul className={s.menuList}>
          {menuItems.map((item) => (
            <li key={item.path} className={s.menuItem}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => 
                  `${s.menuLink} ${isActive ? s.active : ''}`
                }
              >
                <span className={s.icon}>{item.icon}</span>
                <span className={s.menuText}>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;