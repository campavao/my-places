"use client";

import React from "react";
import signIn from "@/firebase/auth/signin";
import signUp from "@/firebase/auth/signup";
import { useRouter } from "next/navigation";
import { LabelAndInput } from "./components/text-input";
import { Button } from "react-bootstrap";
import addData from "@/firebase/addData";

function getSubmitter(
  e: Event & { submitter?: HTMLButtonElement }
): HTMLButtonElement | undefined {
  return e?.submitter;
}

function Home() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [formError, setFormError] = React.useState("");
  const router = useRouter();

  const handleForm = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isSignUp = getSubmitter(event.nativeEvent)?.name === "sign up";
    const login = isSignUp ? signUp : signIn;

    const { result, error } = await login(email, password);
    if (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          setFormError("Email already in use. Sign in instead.");
          break;
      }
      console.log(error.code);
      console.error(error);
    } else {
      // else successful
      console.log(result);

      if (result && isSignUp) {
        const { result: dataResult, error: dataError } = await addData(
          "users",
          result.user.uid,
          {
            name: result.user.displayName,
            email: result.user.email,
            places: {},
          }
        );

        console.log(dataResult, dataError);
      }

      return router.push("/places");
    }
  };

  return (
    <main className='bg-gradient-to-b from-beige to-tan flex flex-col h-[100vh] w-full justify-center items-center'>
      <h1 className='w-full pb-8 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl text-center'>
        My Places
      </h1>
      <form onSubmit={handleForm} className='flex flex-col gap-10'>
        <LabelAndInput
          value={email}
          labelText='Email'
          onTextChange={(text) => setEmail(text)}
          labelProps={{ htmlFor: "email" }}
          inputProps={{
            required: true,
            type: "email",
            name: "email",
            id: "email",
            placeholder: "example@mail.com",
          }}
        />
        <LabelAndInput
          value={password}
          labelText='Password'
          onTextChange={(text) => setPassword(text)}
          labelProps={{ htmlFor: "password" }}
          inputProps={{
            required: true,
            type: "password",
            name: "password",
            id: "password",
            placeholder: "password",
          }}
        />
        {formError && <p className='text-red-600'>{formError}</p>}

        <Button type='submit' name='sign in'>
          Sign in
        </Button>
        <Button type='submit' name='sign up' variant='secondary'>
          Sign up
        </Button>
      </form>
    </main>
  );
}

export default Home;
