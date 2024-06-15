"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { UserData } from "../../../services/authService";

type RegisterFormProps = {
  onSubmit: (formData: UserData) => void;
};

const RegisterForm = ({ onSubmit }: RegisterFormProps) => {
  const [formData, setFormData] = useState<UserData>({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    street_name: "",
    house_number: "",
    postal_code: "",
    city: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="flex gap-5 mb-4">
        <div className="w-1/2">
          <label
            htmlFor="first_name"
            className="block text-q_primary-100 text-sm font-bold mb-2"
          >
            Voornaam
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            placeholder="Voornaam"
            className="  rounded-q_s w-full py-2 px-3 text-q_primary-100 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleChange}
          />
        </div>
        <div className="w-1/2">
          <label
            htmlFor="last_name"
            className="block text-q_primary-100 text-sm font-bold mb-2"
          >
            Achternaam
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            placeholder="Achternaam"
            className="  rounded-q_s w-full py-2 px-3 text-q_primary-100 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="mb-4">
        <label
          htmlFor="username"
          className="block text-q_primary-100 text-sm font-bold mb-2"
        >
          Gebruikersnaam
        </label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="quibooks"
          className="  rounded-q_s w-full py-2 px-3 text-q_primary-100 leading-tight focus:outline-none focus:shadow-outline"
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
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
      <button
        type="submit"
        className="bg-q_primary-100  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-q_s focus:outline-none focus:shadow-outline w-full"
      >
        Registreren
      </button>
    </form>
  );
};

export default RegisterForm;
