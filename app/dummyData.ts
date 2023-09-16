import { PlaceInfo } from "./card";
import { ReviewItemType } from "./reviews/reviews";

export const dummies = [
  {
    id: 1,
    header: "Spacca Napoli",
    body: "Really good pizza and burratta",
  },
  {
    id: 2,
    header: "Chili's",
    body: "Vibe can't be beat",
  },
  {
    id: 3,
    header: "Sweetgreen",
    body: "I'd rather be at Chipotle",
  },
];

export const fullData: Record<number, PlaceInfo> = {
  1: {
    name: "Spacca Napoli",
    description: "Really good pizza and burratta",
    location: "123 street ave",
    completeReview: {
      atmosphere: 4,
      service: 4,
      music: 2,
      items: [
        {
          name: "Burratta",
          description: "Mozzeralla",
          review: 5,
          type: "Appetizer",
        },
      ],
    },
    thingsToTry: ["Pizza", "Burratta"],
  },
  2: {
    name: "Chili's",
    description: "Vibe can't be beat",
    location: "123 street ave",
    completeReview: {
      atmosphere: 5,
      service: 3,
      music: 4,
      items: [],
    },
    thingsToTry: ["Ribs"],
  },
  3: {
    name: "Sweetgreen",
    description: "I'd rather be at Chipotle",
    location: "123 street ave",
    completeReview: {
      atmosphere: 2,
      service: 3,
      music: 1,
      items: [],
    },
    thingsToTry: ["Lettuce"],
  },
};
