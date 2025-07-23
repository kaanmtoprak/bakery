import React from 'react';
import s from './header.module.scss';

const Header = () => {
  return (
    <header className={s.header}>
        <div className={s.logo}>Bakery</div>
        <div> Logout </div>
    </header>
  )
}

export default Header