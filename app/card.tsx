"use client";

import React from "react";

import _ from "lodash";

import Image, { StaticImageData } from "next/image";

import defaultRestaurantImg from "../public/default_restaurant.jpg";

import Reviews, { CompleteReview } from "./reviews/reviews";
import { LabelAndInput } from "./components/text-input";
import { EMPTY_DETAILS } from "./constants";
import addData from "@/firebase/addData";

function Card({ id, place }: { id: string; place: PlaceInfo }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isEditing, setEditing] = React.useState(false);
  const [details, setDetails] = React.useState<PlaceInfo>(
    place ?? EMPTY_DETAILS
  );

  const imgSrc: StaticImageData = details.imgUrl ?? defaultRestaurantImg;

  const isChanged = React.useMemo(
    () => _.isEqual(details, place),
    [details, place]
  );

  const save = React.useCallback(async () => {
    const { error } = await addData("places", id, details);
    if (error) {
      alert((error as any).message);
      return;
    }
  }, [details, id]);

  return (
    <>
      <div
        ref={containerRef}
        className='min-w-[95vw] bg-white border border-tan rounded-lg shadow text-left hover:shadow-lg'
      >
        <Image
          onClick={() => setEditing(true)}
          className='w-full max-h-48 rounded-t-lg object-cover object-bottom'
          src={imgSrc}
          alt=''
        />

        {!isEditing && (
          <button onClick={() => setEditing(true)} className='text-left w-full'>
            <div className='p-4'>
              <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900'>
                {details.name}
              </h5>
              <p className='mb-3 font-normal text-gray-700'>
                {details.description}
              </p>
            </div>
          </button>
        )}

        {isEditing && (
          <EditCard
            save={save}
            details={details}
            setDetails={setDetails}
            isChanged={isChanged}
            close={() => {
              setEditing(false);

              if (containerRef.current) {
                containerRef.current.scrollIntoView({ behavior: "smooth" });
              }
            }}
          />
        )}
      </div>
    </>
  );
}

export interface PlaceInfo {
  name: string;
  description?: string;
  location?: string;
  website?: string;
  completeReview: CompleteReview;
  thingsToTry?: string[];
  imgUrl?: StaticImageData;
}

function EditCard({
  details,
  setDetails,
  close,
  isChanged,
  save,
}: {
  details: PlaceInfo;
  setDetails: React.Dispatch<React.SetStateAction<PlaceInfo>>;
  close: () => void;
  isChanged: boolean;
  save: () => void;
}) {
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const update = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      save();
      close();
    },
    [close, save]
  );

  return (
    <form ref={formRef} className='flex flex-col gap-4 p-4 text-black'>
      <LabelAndInput
        labelText='Name'
        value={details.name}
        onTextChange={(text) =>
          setDetails((detail) => ({ ...detail, name: text }))
        }
      />
      <LabelAndInput
        labelText='Description'
        value={details.description}
        onTextChange={(text) =>
          setDetails((detail) => ({ ...detail, description: text }))
        }
      />
      <LabelAndInput
        labelText='Location'
        value={details.location}
        onTextChange={(text) =>
          setDetails((detail) => ({ ...detail, location: text }))
        }
      />
      <LabelAndInput
        labelText='Website'
        value={details.website}
        onTextChange={(text) =>
          setDetails((detail) => ({ ...detail, website: text }))
        }
      />
      <div className='flex flex-col gap-4'>
        <label>Review</label>
        <Reviews completeReview={details.completeReview} />
      </div>
      <div>
        <label>Things to try</label>
        <ul>
          {details.thingsToTry?.map((dish) => <li key={dish}>{dish}</li>)}
        </ul>
      </div>
      <button
        className='bg-transparent hover:bg-brown text-brown font-semibold hover:text-white py-2 px-4 border border-brown hover:border-transparent rounded'
        onClick={update}
      >
        {isChanged ? "Close" : "Save"}
      </button>
    </form>
  );
}

export default Card;
