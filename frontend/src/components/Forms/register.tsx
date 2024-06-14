"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { ButtonBig } from "../Button/button";
import { InputBig, InputSmall, PasswordInput } from "../Input/Input";
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
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-5">
          <InputSmall
            label="Voornaam"
            name="first_name"
            type="text"
            placeholder="Voornaam"
            applyToggleStyle={false}
            onChange={handleChange}
          />
          <InputSmall
            label="Achternaam"
            name="last_name"
            type="text"
            placeholder="Achternaam"
            applyToggleStyle={false}
            onChange={handleChange}
          />
        </div>
        <InputBig
          label="Gebruikersnaam"
          name="username"
          type="text"
          placeholder="quibooks"
          applyToggleStyle={false}
          onChange={handleChange}
          autoComplete="off"
        />
        <InputBig
          label="Email"
          name="email"
          type="email"
          placeholder="voorbeeld@quibo.be"
          applyToggleStyle={false}
          onChange={handleChange}
          autoComplete="off"
        />
        <div className="flex gap-5">
          <InputSmall
            label="Straatnaam"
            name="street_name"
            type="text"
            placeholder="Straatnaam"
            applyToggleStyle={false}
            onChange={handleChange}
          />
          <InputSmall
            label="Huisnummer"
            name="house_number"
            type="text"
            placeholder="12"
            applyToggleStyle={false}
            onChange={handleChange}
          />
        </div>
        <div className="flex gap-5">
          <InputSmall
            label="Gemeente"
            name="city"
            type="text"
            placeholder="Gemeente"
            applyToggleStyle={false}
            onChange={handleChange}
          />
          <InputSmall
            label="Postcode"
            name="postal_code"
            type="text"
            placeholder="1234"
            applyToggleStyle={false}
            onChange={handleChange}
          />
        </div>
        <PasswordInput
          label="Wachtwoord"
          name="password"
          type="password"
          placeholder="********"
          applyToggleStyle={true}
          onChange={handleChange}
          autoComplete="off"
        />
        <ButtonBig type="submit" content="Registreren" />
      </form>
    </>
  );
};

export default RegisterForm;
