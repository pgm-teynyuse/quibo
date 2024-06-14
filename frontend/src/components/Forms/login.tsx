"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { login, UserData } from "../../../services/authService";
import { useRouter } from "next/navigation";
import { InputBig, PasswordInput } from "../Input/Input";
import { ButtonBig } from "../../components/Button/button";
import Link from "next/link";

const LoginForm = ({
  onSubmit,
}: {
  onSubmit: (formData: UserData) => void;
}) => {
  const [formData, setFormData] = useState<UserData>({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputBig
        label="Email"
        name="email"
        type="email"
        placeholder="voorbeeld@quibo.be"
        applyToggleStyle={false}
        onChange={handleChange}
        autoComplete="off"
      />
      <PasswordInput
        label="Wachtwoord"
        name="password"
        type="password"
        placeholder="********"
        applyToggleStyle={false}
        onChange={handleChange}
        autoComplete="off"
      />
      <div className="flex justify-between mb-5 items-center mt-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={handleCheckboxChange}
          />
          <label
            htmlFor="rememberMe"
            className=" ml-1 text-subText text-q_primary-100"
          >
            Onthoud me
          </label>
        </div>
        <Link href="/login">
          <p className=" text-subText font-medium text-q_primary-100">
            Wachtwoord vergeten
          </p>
        </Link>
      </div>
      <ButtonBig  type="submit" content="Inloggen" />
    </form>
  );
};

export default LoginForm;


