"use client";
/* import { register } from "@/components/firebase/config"; */
/* import { useMail } from "@/hooks/useMail"; */
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  /* const { setMail } = useMail(); */

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const router = useRouter();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  /* function validate() {
    const errors = {};
    if (!formData.name || !formData.email )
      errors.isError = "Por favor llene todo los campos";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  } */

  async function handleSubmit(e) {
    /* e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      setMail(formData.email);
      await register(formData.name, formData.email);
    } el router va dentro del if */
    router.push("/capture");
  }

  return (
    <main className="register w-screen h-screen flex flex-col justify-start items-center pt-[102px] relative">
      {isLoading && (
        <div className="absolute z-50 h-screen w-screen flex justify-center items-center bg-black/50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="48"
            viewBox="0 -960 960 960"
            width="500"
            className="animate-spin w-[150px] h-[150px]"
          >
            <path
              className="fill-white"
              d="M480-80q-84 0-157-31t-127-85q-54-54-85-127T80-480q0-84 31-157t85-127q54-54 127-85t157-31q12 0 21 9t9 21q0 12-9 21t-21 9q-141 0-240.5 99.5T140-480q0 141 99.5 240.5T480-140q141 0 240.5-99.5T820-480q0-12 9-21t21-9q12 0 21 9t9 21q0 84-31 157t-85 127q-54 54-127 85T480-80Z"
            />
          </svg>
        </div>
      )}
      <form onSubmit={handleSubmit} className="pt-[180px]">
        <div className="flex flex-col pt-[150px] pb-10 w-[820px]">
          <img
            src="/register/register.svg"
            alt="registrate text"
            className="h-[80px]"
          />
          <div className="relative flex mt-10 mb-5 w-[820px]">
            <label htmlFor="name">
              <img
                src="/register/name.svg"
                alt="Icono de una persona"
                className="absolute z-50 text-white/50 top-[25px] left-[38px]"
              />
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              placeholder="Tu nombre"
              className={`font-montserrat font-normal text-[35px] flex flex-1 h-[90px] w-[820px] pl-[100px] text-white/100 bg-white/40 placeholder-gray-200 rounded-3xl border-[1.5px] border-white`}
              autoComplete="off"
              onChange={handleChange}
            />
          </div>
          <div className="relative flex mb-5">
            <label htmlFor="email">
              <img
                src="/register/email.svg"
                alt="Icono de mail"
                className="absolute z-50 text-white/50 top-[25px] left-[28px]"
              />
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              className={`font-montserrat font-normal text-[35px] flex flex-1 h-[90px] w-[820px] pl-[100px]
                text-white/100 bg-white/40 placeholder-gray-200 rounded-3xl border-[1.5px] border-white`}
              placeholder="Tu correo"
              autoComplete="off"
              onChange={handleChange}
            />
          </div>
        
          {errors.isError && (
            <p className="font-poppins font-bold text-[20px] text-[#FFFFFF] text-wrap">
              *Completa los campos y accede a una experiencia exclusiva.
            </p>
          )}
        </div>

        <button
          type="submit"
          className="font-montserrat text-[50px] font-bold w-full bg-[#EB0AFF] text-white py-0 rounded-3xl h-[120px] "
        >
          Comenzar
        </button>
      </form>
    </main>
  );
}
