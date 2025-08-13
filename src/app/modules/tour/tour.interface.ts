import { Types } from "mongoose";

export interface ITourType {
  name: string;
}

export interface ITour {
  title: string;
  slug: string;
  description?: string;
  images?: string[];
  location?: string;
  costForm?: string;
  startDate?: Date;
  endDate?: Date;
  included?: string[];
  excluded?: string[];
  amenities?: string[];
  tourPlain?: string[];
  maxGuest?: number;
  minAge?: number;
  division: Types.ObjectId;
  tourTypes: Types.ObjectId;
}
