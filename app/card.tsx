"use client";

import React from "react";

import _ from "lodash";

import Image, { StaticImageData } from "next/image";

import defaultRestaurantImg from "../public/default_restaurant.jpg";

import { fullData } from "./dummyData";
import Reviews, { CompleteReview } from "./reviews/reviews";

const EMPTY_DETAILS: PlaceInfo = {
  name: "",
  description: "",
  location: "",
  completeReview: {
    atmosphere: 0,
    service: 0,
    music: 0,
    items: [],
  },
  thingsToTry: [],
};

function Card({ id }: { id: number }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isEditing, setEditing] = React.useState(false);
  const [details, setDetails] = React.useState<PlaceInfo>(
    fullData[id] ?? EMPTY_DETAILS
  );

  const imgSrc: StaticImageData = details.imgUrl ?? defaultRestaurantImg;

  const isChanged = React.useMemo(
    () => _.isEqual(details, fullData[id] ?? EMPTY_DETAILS),
    [details, id]
  );

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
            <div className='p-5'>
              <a href='#'>
                <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900'>
                  {details.name}
                </h5>
              </a>
              <p className='mb-3 font-normal text-gray-700'>
                {details.description}
              </p>
            </div>
          </button>
        )}

        {isEditing && (
          <EditCard
            details={details}
            setDetails={setDetails}
            isChanged={isChanged}
            close={() => {
              setEditing(false);

              if (containerRef.current) {
                console.log("scorlling back");
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
}: {
  details: PlaceInfo;
  setDetails: React.Dispatch<React.SetStateAction<PlaceInfo>>;
  close: () => void;
  isChanged: boolean;
}) {
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    console.log(formRef.current);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const update = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      console.log(details);
      close();
    },
    [close, details]
  );

  return (
    <form ref={formRef} className='flex flex-col gap-4 p-4 text-black'>
      <LabelAndInput
        labelText='Name'
        value={details.name}
        defaultValue={details.name ?? ""}
        onTextChange={(text) =>
          setDetails((detail) => ({ ...detail, name: text }))
        }
      />
      <LabelAndInput
        labelText='Description'
        value={details.description}
        defaultValue={details.description ?? ""}
        onTextChange={(text) =>
          setDetails((detail) => ({ ...detail, description: text }))
        }
      />
      <LabelAndInput
        labelText='Location'
        value={details.location}
        defaultValue={details.location ?? ""}
        onTextChange={(text) =>
          setDetails((detail) => ({ ...detail, location: text }))
        }
      />
      <LabelAndInput
        labelText='Website'
        value={details.website}
        defaultValue={details.website ?? ""}
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

interface TextInput extends React.InputHTMLAttributes<HTMLInputElement> {
  labelText: string;
  onTextChange: (text: string) => void;
}

export function LabelAndInput(props: TextInput) {
  return (
    <div>
      <label className='block mb-2 text-sm font-medium text-gray-900'>
        {props.labelText}
      </label>
      <Input value={props.value as string} onTextChange={props.onTextChange} />
    </div>
  );
}

export function Input(props: {
  value?: string;
  onTextChange: (text: string) => void;
}) {
  return (
    <input
      value={props.value ?? ""}
      onChange={(e) => {
        e.preventDefault();
        props.onTextChange(e.target.value);
      }}
      className='bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
    />
  );
}

{
  /* <button data-modal-target="authentication-modal" data-modal-toggle="authentication-modal" class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
  Toggle modal
</button> */
}

interface ModalProps {
  id: string;
}

function Modal({ id }: ModalProps) {
  return (
    <div
      id={id}
      data-te-modal-init
      tabIndex={-1}
      aria-hidden='true'
      className='fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full'
    >
      <div
        data-te-modal-dialog-ref
        className='relative w-full max-w-md max-h-full'
      >
        <div className='relative bg-white rounded-lg shadow dark:bg-gray-700'>
          <button
            type='button'
            className='absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white'
            data-modal-hide='authentication-modal'
          >
            <svg
              className='w-3 h-3'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 14 14'
            >
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
              />
            </svg>
            <span className='sr-only'>Close modal</span>
          </button>
          <div className='px-6 py-6 lg:px-8'>
            <h3 className='mb-4 text-xl font-medium text-gray-900 dark:text-white'>
              Sign in to our platform
            </h3>
            <form className='space-y-6' action='#'>
              <div>
                <label
                  htmlFor='email'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Your email
                </label>
                <input
                  type='email'
                  name='email'
                  id='email'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                  placeholder='name@company.com'
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='password'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Your password
                </label>
                <input
                  type='password'
                  name='password'
                  id='password'
                  placeholder='••••••••'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                  required
                />
              </div>
              <div className='flex justify-between'>
                <div className='flex items-start'>
                  <div className='flex items-center h-5'>
                    <input
                      id='remember'
                      type='checkbox'
                      value=''
                      className='w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-600 dark:border-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800'
                      required
                    />
                  </div>
                  <label
                    htmlFor='remember'
                    className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                  >
                    Remember me
                  </label>
                </div>
                <a
                  href='#'
                  className='text-sm text-blue-700 hover:underline dark:text-blue-500'
                >
                  Lost Password?
                </a>
              </div>
              <button
                type='submit'
                className='w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
              >
                Login to your account
              </button>
              <div className='text-sm font-medium text-gray-500 dark:text-gray-300'>
                Not registered?{" "}
                <a
                  href='#'
                  className='text-blue-700 hover:underline dark:text-blue-500'
                >
                  Create account
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
