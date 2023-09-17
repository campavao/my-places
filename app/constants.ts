import { PlaceInfo } from "./card";
import { ReviewItem } from "./reviews/reviews";

export const EMPTY_DETAILS: PlaceInfo = {
  name: "",
  description: "",
  location: "",
  completeReview: {
    atmosphere: 0,
    service: 0,
    music: 0,
    bathroom: 0,
    items: [],
  },
  thingsToTry: [],
};

export enum ReviewItemType {
  APP = "Appetizer",
  ENTREE = "Entree",
  DRINK = "Drink",
  DESSERT = "Dessert",
}

interface Details {
  variant: string;
}

export const ReviewItemTypeDetails: Record<ReviewItemType, Details> = {
  [ReviewItemType.APP]: {
    variant: "secondary",
  },
  [ReviewItemType.ENTREE]: {
    variant: "primary",
  },
  [ReviewItemType.DRINK]: {
    variant: "tertiary",
  },
  [ReviewItemType.DESSERT]: {
    variant: "info",
  },
};

export const EMPTY_REVIEW_ITEM: ReviewItem = {
  name: "",
  review: 0,
  type: ReviewItemType.APP,
  imgName: "",
};
