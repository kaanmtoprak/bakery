import React from "react";
import s from "./input.module.scss";
import PropTypes from "prop-types";
import { Input as AntdInput } from "antd";

const Input = ({ label, inputType = "text", disabled, ...props }) => {
  return (
    <div className={s.input}>
      {label && <label className={s.label}>{label}</label>}
      <AntdInput {...props} type={inputType} disabled={disabled} />
    </div>
  );
};

// Password alt komponenti
const Password = ({ label, disabled, ...props }) => {
  return (
    <div className={s.input}>
      {label && <label className={s.label}>{label}</label>}
      <AntdInput.Password {...props} disabled={disabled} />
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  inputType: PropTypes.string,
  disabled: PropTypes.bool,
};

Password.propTypes = {
  label: PropTypes.string,
  disabled: PropTypes.bool,
};

// Password komponentini Input'a alt komponent olarak ekle
Input.Password = Password;

export default Input;
