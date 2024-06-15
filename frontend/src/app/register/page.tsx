"use client";
import RegisterForm from "../../components/Forms/register";
import { TitleMain } from "../../components/Title/Title";
import { ButtonLink } from "../../components/Button/button";
import { useRouter } from "next/navigation";
import { register, UserData } from "../../../services/authService";
import React from "react";

const RegisterPage = () => {
  const router = useRouter();


  const handleRegister = async (formData: UserData) => {
    try {
      await register(formData);
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div>
      <TitleMain
        text="Maak een acccount"
        subText="Vul de onderstaande velden in om een account aan te maken."
      />
      <RegisterForm onSubmit={handleRegister} />
      <ButtonLink
        link="/login"
        question="Heb je al een account?"
        text="Inloggen"
      />
    </div>
  );
};

export default RegisterPage;
function useState(arg0: boolean): [any, any] {
  throw new Error("Function not implemented.");
}

