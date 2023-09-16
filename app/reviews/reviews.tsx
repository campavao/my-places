"use client";

import React from "react";
import { LabelAndInput } from "../components/text-input";

import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";

export interface CompleteReview {
  atmosphere: number;
  service: number;
  music: number;
  /** Reviews for foods and drinks */
  items: ReviewItem[];
}

function Reviews({
  completeReview,
  disabled = false,
}: {
  completeReview: CompleteReview;
  disabled?: boolean;
}) {
  const [updatedReview, setUpdatedReview] =
    React.useState<CompleteReview>(completeReview);

  const updateReviewItems = React.useCallback(
    (index: number, item: ReviewItem) => {
      const newItems = [...updatedReview.items];
      newItems[index] = item;

      setUpdatedReview((review) => ({ ...review, items: newItems }));
    },
    [updatedReview.items]
  );

  const overall = React.useMemo(() => {
    const sum =
      updatedReview.atmosphere +
      updatedReview.service +
      updatedReview.music +
      updatedReview.items.reduce((acc, curr) => acc + curr.review, 0);

    const total = 3 + updatedReview.items.length;

    return sum / total;
  }, [
    updatedReview.atmosphere,
    updatedReview.items,
    updatedReview.music,
    updatedReview.service,
  ]);

  return (
    <div>
      <div className='flex justify-between gap-4'>
        Overall: <ReviewStars review={overall} />
      </div>
      <div className='flex justify-between gap-4'>
        Service:
        <ReviewStars
          review={updatedReview.service}
          disabled={disabled}
          onChange={(amount) =>
            setUpdatedReview((item) => ({ ...item, service: amount }))
          }
        />
      </div>
      <div className='flex justify-between gap-4'>
        Atmosphere:
        <ReviewStars
          review={updatedReview.atmosphere}
          disabled={disabled}
          onChange={(amount) =>
            setUpdatedReview((item) => ({ ...item, atmosphere: amount }))
          }
        />
      </div>
      <div className='flex justify-between gap-4'>
        Music:
        <ReviewStars
          review={updatedReview.music}
          disabled={disabled}
          onChange={(amount) =>
            setUpdatedReview((item) => ({ ...item, music: amount }))
          }
        />
      </div>
      {(!disabled || updatedReview.items.length > 0) && (
        <div className='flex flex-col gap-4'>
          Food & Drink:
          {updatedReview.items.map((item, index) => (
            <ReviewItem
              disabled={disabled}
              key={item.name}
              item={item}
              onChange={(item) => updateReviewItems(index, item)}
            />
          ))}
          {!disabled && <Button>Add</Button>}
        </div>
      )}
    </div>
  );
}

export enum ReviewItemType {
  APP = "Appetizer",
  ENTREE = "Entree",
  DRINK = "Drink",
  DESSERT = "Dessert",
}

interface ReviewItem {
  name: string;
  review: number;
  type: string;
  description?: string;
  imgUrl?: string;
}

interface ReviewItemProps {
  item: ReviewItem;
  disabled?: boolean;
  onChange: (item: ReviewItem) => void;
}

function ReviewItem(props: ReviewItemProps) {
  const { item, onChange, disabled } = props;
  const [isEdit, setEditing] = React.useState<boolean>(false);

  return (
    <div className='flex items-center gap-4 border rounded-md p-2'>
      <div className='h-20 w-20 border rounded-md'>{item.imgUrl}</div>
      <button
        onClick={(e) => {
          e.preventDefault();
          setEditing(true);
        }}
        className='flex flex-col gap-2 text-left w-full'
      >
        <div>{item.name}</div>
        <div>{item.description}</div>
        <div>{item.type.toString()}</div>
        <ReviewStars review={item.review} />
      </button>
      <Modal show={isEdit} onHide={() => setEditing(false)}>
        <Modal.Header closeButton>Update item</Modal.Header>
        <Modal.Body>
          <div className='h-20 w-20 border rounded-md'>{item.imgUrl}</div>
          <div className='flex flex-col gap-2'>
            <LabelAndInput
              labelText='Name'
              value={item.name}
              onTextChange={(name) => onChange({ ...item, name })}
            />
            <LabelAndInput
              labelText='Description'
              value={item.description}
              onTextChange={(description) => onChange({ ...item, description })}
            />
            <div>
              Review
              <ReviewStars
                review={item.review}
                disabled={disabled}
                onChange={(review) => onChange({ ...item, review })}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Reviews;

interface ReviewStars {
  review: number;
  disabled?: boolean;
  onChange?: (amount: number) => void;
}

function ReviewStars({ review, onChange, disabled = false }: ReviewStars) {
  return (
    <div className='flex'>
      {Array(5)
        .fill(1)
        .map((_, key) => (
          <Star
            key={key + "_selected"}
            fill={key + 1 <= review}
            isButton={!!onChange || !disabled}
            onClick={() => {
              if (disabled) {
                return;
              }

              onChange?.(key + 1);
            }}
          />
        ))}
    </div>
  );
}

function Star({
  fill = true,
  onClick,
  isButton,
}: {
  fill?: boolean;
  isButton: boolean;
  onClick: () => void;
}) {
  const star = fill ? (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='currentColor'
      className='w-6 h-6'
    >
      <path
        fillRule='evenodd'
        d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z'
        clipRule='evenodd'
      />
    </svg>
  ) : (
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
        d='M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z'
      />
    </svg>
  );

  if (isButton) {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
      >
        {star}
      </button>
    );
  }

  return star;
}
