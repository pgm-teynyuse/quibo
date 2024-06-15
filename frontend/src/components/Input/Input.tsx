import React, { useState } from "react";
import "./input-field.css";
import {IconPasswordInvisible, IconPasswordVisible} from "../Icon/Icon";

type InputFieldProps = {
  label: string;
  name: string;
  type: string;
  value?: string;
  placeholder?: string;
  toggle?: boolean;
  applyToggleStyle?: boolean;
  handler?: any;
  onChange?: any;
  ref?: any;
  id?: string;
  fieldClassName?: string;
  autoComplete?: string;
};

const InputSmall = ({
  label,
  name,
  type,
  value,
  placeholder,
  toggle,
  applyToggleStyle,
  onChange,
}: InputFieldProps) => {
  return (
    <div className={`input input--small `}>
      <label htmlFor={name} className={`input__label`}>
        {label}
      </label>
      <div className={`bg-white input__input-field`}>
        <input
          onChange={onChange}
          disabled={toggle}
          name={name}
          type={type}
          defaultValue={value}
          placeholder={placeholder}
          className={`input__field border-q_primary-100`}
        />
      </div>
    </div>
  );
};

const InputBig = ({
  label,
  name,
  type,
  value,
  placeholder,
  toggle,
  applyToggleStyle,
  onChange,
  ref,
  id,
  fieldClassName,
  autoComplete,
  ...props
}: InputFieldProps) => {
  return (
    <div className={`input input--big`}>
      <label htmlFor={name} className={`input__label`}>
        {label}
      </label>
      <div className={`input__input-field bg-white`}>
        <input
          disabled={toggle}
          name={name}
          type={type}
          defaultValue={value}
          placeholder={placeholder}
          onChange={onChange}
          className={`input__field border-q_primary-100`}
          ref={ref}
          id={id}
          autoComplete={autoComplete}
          {...props}
        />
      </div>
    </div>
  );
};

type PasswordInputProps = {
  label: string;
  name: string;
  value?: string;
  placeholder?: string;
  onChange?: any;
  ref?: any;
  type?: string;
  id?: string;
  fieldClassName?: string;
  autoComplete?: string;
  applyToggleStyle?: boolean;
};

const PasswordInput = ({
  label,
  name,
  value,
  placeholder,
  onChange,
  ref,
  type,
  id,
  fieldClassName,
  autoComplete,
  applyToggleStyle,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`input-password`}>
      <label htmlFor={name} className={`input__label`}>
        {label}
      </label>
      <div className={`input__input-field`}>
        <input
          name={name}
          type={showPassword ? "text" : "password"}
          defaultValue={value}
          placeholder={placeholder}
          onChange={onChange}
          className={`input__field border-q_primary-100`}
          ref={ref}
          id={id}
          autoComplete={autoComplete}
        />
        <span
          onClick={togglePasswordVisibility}
          className="password-toggle-icon"
        >
          {showPassword ? <IconPasswordInvisible /> : <IconPasswordVisible />}{" "}
          {/* Use an icon library or a custom SVG */}
        </span>
      </div>
    </div>
  );
};
export { InputSmall, InputBig, PasswordInput };
