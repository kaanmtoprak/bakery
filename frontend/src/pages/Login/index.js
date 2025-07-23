import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import s from './login.module.scss';
import Button from '../../components/Button';
import {Form} from 'antd';
import { Input } from '../../components';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (values) => {
    console.log(values);
    
    // Kullanıcı bilgilerini oluştur
    const userData = {
      username: values.username,
      email: `${values.username}@bakery.com`,
      role: 'admin'
    };

    // localStorage'a kaydet
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(userData));

    // AuthContext'teki login fonksiyonunu çağır
    login(userData);

    // Ana sayfaya yönlendir
    navigate('/');
  };

  return (
    <div className={s.login}>
      <Form className={s.form} onFinish={handleSubmit}>
        <h1>Giriş Yap</h1>
        <Form.Item name="username" >
          <Input label="Kullanıcı Adı" />
        </Form.Item>
        <Form.Item name="password" >
          <Input.Password label="Şifre" />
        </Form.Item>
        <Button width={"full"} type='dark'>Giriş Yap</Button>
      </Form>
    </div>
  );
};

export default Login; 