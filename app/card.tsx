"use client";

import React from "react";

import _ from "lodash";

import Image, { StaticImageData } from "next/image";

import defaultRestaurantImg from "../public/default_restaurant.jpg";
import EditIcon from "../public/edit.svg";
import UpIcon from "../public/up.svg";
import DownIcon from "../public/down.svg";

import Reviews, { CompleteReview } from "./reviews/reviews";
import { LabelAndInput } from "./components/text-input";
import { EMPTY_DETAILS } from "./constants";
import addData from "@/firebase/addData";

type View = "min" | "full" | "edit";

function Card({ id, place }: { id: string; place: PlaceInfo }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [details, setDetails] = React.useState<PlaceInfo>(
    place ?? EMPTY_DETAILS
  );
  const [view, setView] = React.useState<View>(
    place.name == "" ? "edit" : "min"
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
    <div
      ref={containerRef}
      className='min-w-[95vw] bg-white border border-tan rounded-lg shadow text-left hover:shadow-lg'
    >
      <Image
        onClick={() => setView("full")}
        className='w-full max-h-48 rounded-t-lg object-cover object-bottom'
        src={imgSrc}
        alt=''
      />

      {view === "min" && (
        <button
          onClick={() => setView("full")}
          className='flex flex-col text-left w-full'
        >
          <div className='p-4 text-gray-900'>
            <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900'>
              {details.name}
            </h5>
            <div>{details.description}</div>
          </div>
          <Image
            src={DownIcon}
            alt='expand'
            width={40}
            height={40}
            className='self-center'
          />
        </button>
      )}

      {view === "full" && <DisplayCard details={details} setView={setView} />}

      {view === "edit" && (
        <EditCard
          save={save}
          details={details}
          setDetails={setDetails}
          isChanged={isChanged}
          close={() => {
            setView("full");

            if (containerRef.current) {
              containerRef.current.scrollIntoView({ behavior: "smooth" });
            }
          }}
        />
      )}
    </div>
  );
}

function DisplayCard({
  details,
  setView,
}: {
  details: PlaceInfo;
  setView: React.Dispatch<React.SetStateAction<View>>;
}) {
  return (
    <div className='p-4 position-relative'>
      <button
        onClick={() => setView("edit")}
        className='absolute top-6 right-6'
      >
        <Image alt='edit' src={EditIcon} width={20} height={20} />
      </button>
      <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900'>
        {details.name}
      </h5>
      <div className='flex flex-col gap-2 font-normal text-gray-700 pb-4'>
        <div>{details.description}</div>
        {details.location && (
          <a
            href={` https://www.google.com/maps/search/?api=1&query=${encodeURI(
              details.location
            )}`}
          >
            {details.location}
          </a>
        )}
        {details.website && <a href={details.website}>{details.website}</a>}
        <Reviews completeReview={details.completeReview} disabled />
      </div>
      <button
        onClick={() => setView("min")}
        className='flex justify-center items-center w-full absolute bottom-0 left-0'
      >
        <Image alt='close' src={UpIcon} width={40} height={40} />
      </button>
    </div>
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
        disabled={details.name === ""}
        onClick={update}
      >
        {isChanged ? "Close" : "Save"}
      </button>
    </form>
  );
}

export default Card;
