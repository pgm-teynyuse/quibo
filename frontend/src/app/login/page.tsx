"use client";

import LoginForm from "../../components/Forms/login";
import { TitleMain } from "../../components/Title/Title";
import { ButtonLink } from "../../components/Button/button";
import { useRouter } from "next/navigation";
import { login, UserData } from "../../../services/authService";
import React from "react";

const LoginPage = () => {
  const router = useRouter();

  const handleLogin = async (formData: UserData) => {
    try {
      const response = await login(formData);
      localStorage.setItem("token", response.data.token);
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <TitleMain
        text="Bestel, ruil en organiseer!"
        subText="Alles samen op een platform!"
      />
      <LoginForm onSubmit={handleLogin} />
      <ButtonLink
        link="/register"
        question="Heb je nog geen account?"
        text="Registreren"
      />
    </div>
  );
};

export default LoginPage;
