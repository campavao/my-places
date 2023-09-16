import { PlaceInfo } from "./card";

export const EMPTY_DETAILS: PlaceInfo = {
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
