"use client";

import React from "react";

import _ from "lodash";

import Image from "next/image";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import DropdownItem from "react-bootstrap/DropdownItem";
import DropdownButton from "react-bootstrap/DropdownButton";

import EditIcon from "../public/edit.svg";
import UpIcon from "../public/up.svg";
import DownIcon from "../public/down.svg";

import Reviews, { CompleteReview } from "./reviews/reviews";
import { LabelAndInput } from "./components/text-input";
import { EMPTY_DETAILS } from "./constants";
import addData from "@/firebase/addData";
import ImageInput from "./components/image-input";

type View = "min" | "full" | "edit";

function Card({ id, place }: { id: string; place: PlaceInfo }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [details, setDetails] = React.useState<PlaceInfo>(
    place ?? EMPTY_DETAILS
  );
  const [view, setView] = React.useState<View>(
    place.name == "" ? "edit" : "min"
  );

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
      <ImageInput
        id='card'
        imageName={details.imgName}
        onChange={(name) => {
          setDetails((detail) => ({ ...detail, imgName: name }));
        }}
        showReupload={view === "edit"}
        imageClassName='rounded-b-none'
      />

      {view === "min" && (
        <button
          onClick={() => setView("full")}
          className='flex flex-col text-left w-full'
        >
          <div className='p-4 text-gray-900 flex flex-col gap-2'>
            <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900'>
              {details.name}
            </h5>
            <div className='flex gap-2 items-center'>
              <Badge className='w-fit text-black'>{details.cuisine}</Badge>
              {details.price && <ReviewPrice price={details.price} />}
            </div>
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
  const website = details.website
    ? details.website.includes("http://") ||
      details.website.includes("https://")
      ? details.website
      : "https://" + details.website
    : undefined;

  return (
    <div className='p-4 position-relative'>
      <button
        onClick={() => setView("edit")}
        className='absolute top-2 right-4'
      >
        <Image alt='edit' src={EditIcon} width={20} height={20} />
      </button>
      <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900'>
        {details.name}
      </h5>
      <div className='flex flex-col gap-2 font-normal text-gray-700 pb-4'>
        <div className='flex gap-2 items-center'>
          <Badge className='w-fit text-black'>{details.cuisine}</Badge>
          {details.price && <ReviewPrice price={details.price} />}
        </div>
        <div>{details.description}</div>
        {details.location && (
          <a
            target='_blank'
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURI(
              details.location
            )}`}
          >
            {details.location}
          </a>
        )}
        {website && (
          <a target='_blank' href={website}>
            {details.website}
          </a>
        )}
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

const PRICE_OPTIONS: { label: string; value: number }[] = [
  { label: "Cheap", value: 1 },
  { label: "Affordable", value: 2 },
  { label: "Pricey", value: 3 },
  { label: "Fancy", value: 4 },
];

export interface PlaceInfo {
  name: string;
  description?: string;
  cuisine?: string;
  price?: number;
  location?: string;
  website?: string;
  completeReview: CompleteReview;
  thingsToTry?: string[];
  imgName?: string;
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

  const currentPrice = React.useMemo(
    () =>
      PRICE_OPTIONS.find(({ value }) => details.price === value) ?? {
        label: "Set price",
      },
    [details.price]
  );

  return (
    <form ref={formRef} className='flex flex-col gap-4 p-4 text-black'>
      <LabelAndInput
        labelText='Name'
        value={details.name}
        onTextChange={(name) => setDetails((detail) => ({ ...detail, name }))}
      />
      <LabelAndInput
        labelText='Cuisine'
        value={details.cuisine}
        onTextChange={(cuisine) =>
          setDetails((detail) => ({ ...detail, cuisine }))
        }
      />
      <LabelAndInput
        labelText='Description'
        value={details.description}
        onTextChange={(description) =>
          setDetails((detail) => ({ ...detail, description }))
        }
      />
      <LabelAndInput
        labelText='Location'
        value={details.location}
        onTextChange={(location) =>
          setDetails((detail) => ({ ...detail, location }))
        }
      />
      <LabelAndInput
        labelText='Website'
        value={details.website}
        onTextChange={(website) =>
          setDetails((detail) => ({ ...detail, website }))
        }
      />
      <div>
        <label>Price</label>
        <DropdownButton
          variant='secondary'
          className='w-full'
          title={currentPrice.label}
        >
          {Object.values(PRICE_OPTIONS).map((price, index) => (
            <DropdownItem
              key={price.label + index}
              onClick={() =>
                setDetails((detail) => ({ ...detail, price: price.value }))
              }
            >
              {price.label}
            </DropdownItem>
          ))}
        </DropdownButton>
      </div>
      <div className='flex flex-col gap-4'>
        <label>Review</label>
        <Reviews
          completeReview={details.completeReview}
          setDetails={setDetails}
        />
      </div>
      {/* <div>
        <label>Things to try</label>
        <ul>
          {details.thingsToTry?.map((dish) => <li key={dish}>{dish}</li>)}
        </ul>
      </div> */}
      <Button
        className='font-semibold py-2 px-4 rounded'
        disabled={details.name === ""}
        onClick={update}
      >
        {isChanged ? "Close" : "Save"}
      </Button>
    </form>
  );
}

export default Card;

function ReviewPrice({ price }: { price: number }) {
  return (
    <div className='flex'>
      {Array(price)
        .fill(1)
        .map((_, key) => (
          <DollarIcon key={key} />
        ))}
    </div>
  );
}

function DollarIcon() {
  return (
    <svg
      className='w-3 h-3 text-gray-800 '
      aria-hidden='true'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 11 20'
    >
      <path
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
        d='M1.75 15.363a4.954 4.954 0 0 0 2.638 1.574c2.345.572 4.653-.434 5.155-2.247.502-1.813-1.313-3.79-3.657-4.364-2.344-.574-4.16-2.551-3.658-4.364.502-1.813 2.81-2.818 5.155-2.246A4.97 4.97 0 0 1 10 5.264M6 17.097v1.82m0-17.5v2.138'
      />
    </svg>
  );
}
