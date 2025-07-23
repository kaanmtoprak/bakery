import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { MenuOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import s from './header.module.scss';
import {Button} from '../';

const Header = () => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className={s.header}>
      <div className={s.leftSection}>
        <button className={s.menuButton}>
          <MenuOutlined />
        </button>
        <div className={s.logo}>Bakery</div>
      </div>
      
      <div className={s.rightSection}>
        <div className={s.userInfo}>
          <UserOutlined className={s.userIcon} />
          {user && <span className={s.username}>Hoş geldin, {user.username}!</span>}
        </div>
        <Button iconLeft={<LogoutOutlined />} type='dark' onClick={handleLogout} className={s.logoutButton}>
          Çıkış Yap
        </Button>
      </div>
    </header>
  );
};

export default Header;