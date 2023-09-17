"use client";

import React from "react";
import { LabelAndInput } from "../components/text-input";

import Modal from "react-bootstrap/Modal";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import DropdownItem from "react-bootstrap/DropdownItem";
import DropdownButton from "react-bootstrap/DropdownButton";

import { PlaceInfo } from "../card";
import {
  EMPTY_REVIEW_ITEM,
  ReviewItemType,
  ReviewItemTypeDetails,
} from "../constants";
import _ from "lodash";
import ImageInput from "../components/image-input";

export interface CompleteReview {
  atmosphere: number;
  service: number;
  music: number;
  bathroom: number;
  /** Reviews for foods and drinks */
  items: ReviewItem[];
}

function Reviews({
  completeReview,
  disabled = false,
  setDetails,
}: {
  completeReview: CompleteReview;
  disabled?: boolean;
  setDetails?: React.Dispatch<React.SetStateAction<PlaceInfo>>;
}) {
  const updateReview = React.useCallback(
    (review: Partial<CompleteReview>) => {
      setDetails?.((detail) => ({
        ...detail,
        completeReview: { ...completeReview, ...review },
      }));
    },
    [completeReview, setDetails]
  );

  const addReviewItem = React.useCallback(() => {
    const newItems = [...completeReview.items, EMPTY_REVIEW_ITEM];

    updateReview({ items: newItems });
  }, [completeReview.items, updateReview]);

  const updateReviewItems = React.useCallback(
    (index: number, item: ReviewItem) => {
      const newItems = [...completeReview.items];
      newItems[index] = item;

      updateReview({ items: newItems });
    },
    [completeReview.items, updateReview]
  );

  const overall = React.useMemo(() => {
    const sum =
      completeReview.atmosphere +
      completeReview.service +
      completeReview.music +
      completeReview.bathroom +
      completeReview.items.reduce((acc, curr) => acc + curr.review, 0);

    const total = 4 + completeReview.items.length;

    return sum / total;
  }, [
    completeReview.atmosphere,
    completeReview.items,
    completeReview.music,
    completeReview.service,
    completeReview.bathroom,
  ]);

  return (
    <div>
      <div className='flex justify-between gap-4'>
        Overall: <ReviewStars review={overall} />
      </div>
      {Object.entries(completeReview)
        .filter(([key]) => key !== "items")
        .map(([key, value]) => (
          <div key={key} className='flex justify-between gap-4'>
            {_.capitalize(key)}:
            <ReviewStars
              review={value}
              disabled={disabled}
              onChange={(amount) => updateReview({ [key]: amount })}
            />
          </div>
        ))}
      {(!disabled || completeReview.items.length > 0) && (
        <div className='flex flex-col gap-4'>
          Food & Drink:
          {completeReview.items.map((item, index) => (
            <ReviewItem
              disabled={disabled}
              key={item.name}
              item={item}
              onChange={(item) => updateReviewItems(index, item)}
            />
          ))}
          {!disabled && (
            <Button variant='secondary' onClick={addReviewItem}>
              Add
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export interface ReviewItem {
  name: string;
  review: number;
  type: ReviewItemType;
  description?: string;
  imgName?: string;
}

interface ReviewItemProps {
  item: ReviewItem;
  disabled?: boolean;
  onChange: (item: ReviewItem) => void;
}

function ReviewItem(props: ReviewItemProps) {
  const { item, onChange, disabled } = props;
  const [changedItem, setChangedItem] = React.useState<ReviewItem>(item);
  const [isEdit, setEditing] = React.useState<boolean>(changedItem.name === "");

  const save = React.useCallback(() => {
    onChange(changedItem);
    setEditing(false);
  }, [changedItem, onChange]);

  return (
    <>
      <div className='flex items-center gap-4 border rounded-md p-2'>
        <ImageInput
          id={`${changedItem.name}-review-item`}
          imageName={changedItem.imgName}
          onChange={(name) =>
            setChangedItem((i) => {
              console.log(i, name);
              return { ...i, imgName: name };
            })
          }
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            setEditing(true);
          }}
          className='flex flex-col gap-2 text-left w-full'
        >
          <div className='flex justify-between w-full'>
            <div>{item.name}</div>
            <Badge bg={ReviewItemTypeDetails[item.type].variant}>
              {item.type.toString()}
            </Badge>
          </div>
          <div>{item.description}</div>
          <ReviewStars review={item.review} disabled={disabled} />
        </button>
      </div>
      <Modal
        show={isEdit}
        onHide={() => {
          console.log("close???");
          setEditing(false);
        }}
      >
        <Modal.Header closeButton className='border-0'>
          Update item
        </Modal.Header>
        <Modal.Body>
          <ImageInput
            id={`${changedItem.name}-review-item`}
            imageName={changedItem.imgName}
            onChange={(imgName) => setChangedItem((i) => ({ ...i, imgName }))}
            showReupload
          />
          <div className='flex flex-col gap-1 text-black pb-4'>
            <LabelAndInput
              labelText='Name'
              value={changedItem.name}
              onTextChange={(name) =>
                setChangedItem((cItem) => ({ ...cItem, name }))
              }
            />
            <LabelAndInput
              labelText='Description'
              value={changedItem.description}
              onTextChange={(description) =>
                setChangedItem((cItem) => ({ ...cItem, description }))
              }
            />
            <div>
              <label>Review</label>

              <ReviewStars
                review={changedItem.review}
                disabled={disabled}
                onChange={(review) =>
                  setChangedItem((cItem) => ({ ...cItem, review }))
                }
              />
            </div>
            <div>
              <label>Type</label>
              <DropdownButton
                variant='secondary'
                className='w-full'
                title={changedItem.type.toString()}
              >
                {Object.values(ReviewItemType).map((type, index) => (
                  <DropdownItem
                    key={type + index}
                    onClick={() =>
                      setChangedItem((cItem) => ({ ...cItem, type }))
                    }
                  >
                    {type}
                  </DropdownItem>
                ))}
              </DropdownButton>
            </div>
          </div>
          <Button className='w-full' onClick={save}>
            Save
          </Button>
        </Modal.Body>
      </Modal>
    </>
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
