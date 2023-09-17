"use client";

import React, { useCallback } from "react";
import { v4 } from "uuid";

import Card, { PlaceInfo } from "../card";

import { useRouter } from "next/navigation";
import { useAuthContext } from "../context/AuthContext";
import { signOut, getAuth } from "firebase/auth";
import { EMPTY_DETAILS } from "../constants";

import getDocument from "@/firebase/getData";
import addData from "@/firebase/addData";
import _ from "lodash";

export default function Page() {
  const { user } = useAuthContext();

  const [places, setPlaces] = React.useState<Record<string, PlaceInfo>>({});

  const router = useRouter();

  React.useEffect(() => {
    if (user == null) router.push("/");
  }, [router, user]);

  const getPlaces = React.useCallback(async () => {
    if (!user) {
      return;
    }
    const { result, error } = await getDocument("users", user.uid);

    if (error) {
      console.error(error);
    }

    if (result) {
      const userData = result.data();
      if (userData?.places && !_.isEmpty(userData?.places)) {
        console.log(userData)
        const populatedPlaces = await userData.places.reduce(
          async (acc: Promise<Record<string, PlaceInfo>>, id: string) => {
            const total = await acc;
            const { result } = await getDocument("places", id);

            if (!result) {
              throw new Error("cant find place");
            }

            return {
              ...total,
              [id]: result.data(),
            };
          },
          Promise.resolve({})
        );

        setPlaces(populatedPlaces ?? {});
      }
    }
  }, [user]);

  React.useEffect(() => {
    if (user) {
      getPlaces();
    }
  }, [getPlaces, user]);

  const handleSignOut = useCallback(async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      router.push("/");
    } catch (err) {
      console.log("couldnt sign out");
      console.error(err);
    }
  }, [router]);

  const createPlace = React.useCallback(async () => {
    const placeId = v4();
    await addData("places", placeId, EMPTY_DETAILS);

    if (user) {
      const newPlaces = { ...places, [placeId]: EMPTY_DETAILS };
      const newPlaceIds = [...Object.keys(places), placeId];
      await addData("users", user.uid, { places: newPlaceIds });

      setPlaces(newPlaces);
    }
  }, [user, places]);

  return (
    <main className='bg-gradient-to-b from-beige to-tan flex flex-col items-center p-2 pt-10 pb-40 min-h-[100vh] h-full w-full'>
      <button onClick={handleSignOut} className='absolute top-4 right-4'>
        Sign out
      </button>
      <h1 className='w-full mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl text-center'>
        {"Andrea's Places"}
      </h1>
      <div className='flex flex-col gap-4 h-full'>
        {Object.entries(places).map(([id, place]) => (
          <Card key={id} id={id} place={place} />
        ))}
      </div>
      <button
        onClick={() => createPlace()}
        className='flex justify-center items-center fixed right-10 bottom-10 rounded-full text-black bg-shrek w-20 h-20 size-20 hover:bg-green shadow-lg '
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='currentColor'
          className='w-6 h-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 4.5v15m7.5-7.5h-15'
          />
        </svg>
      </button>
    </main>
  );
}
