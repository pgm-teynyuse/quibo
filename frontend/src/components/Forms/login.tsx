"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { login, UserData } from "../../../services/authService";
import { useRouter } from "next/navigation";
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
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-q_primary-100 text-sm font-bold mb-2"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="voorbeeld@quibo.be"
          className="  rounded-q_s w-full py-2 px-3 text-q_primary-100 leading-tight focus:outline-none focus:shadow-outline"
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="password"
          className="block text-q_primary-100 text-sm font-bold mb-2"
        >
          Wachtwoord
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="********"
          className="  rounded-q_s w-full py-2 px-3 text-q_primary-100 leading-tight focus:outline-none focus:shadow-outline"
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
      <div className="flex justify-between mb-5 items-center mt-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={handleCheckboxChange}
            className="mr-2 leading-tight"
          />
          <label htmlFor="rememberMe" className="text-sm text-gray-600">
            Onthoud me
          </label>
        </div>
        <Link href="/login">
          <p className="text-sm text-q_primary-100 hover:text-q_primary-100">
            Wachtwoord vergeten
          </p>
        </Link>
      </div>
      <div>
        <button
          type="submit"
          className="bg-q_primary-100  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-q_s focus:outline-none focus:shadow-outline w-full"
        >
          Inloggen
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
