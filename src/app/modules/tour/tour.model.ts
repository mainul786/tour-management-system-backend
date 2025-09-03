import { model, Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";

const tourTypeSchema = new Schema<ITourType>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export const TourType = model<ITourType>("TourType", tourTypeSchema);

const tourSchema = new Schema<ITour>(
  {
    title: {
      type: String,
    },
    slug: {
      type: String,
    },
    description: {
      type: String,
    },
    images: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
    },
    costForm: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    departureLocatioin: {
      type: String,
    },
    arrivalLocation: {
      type: String,
    },
    included: {
      type: [String],
    },
    excluded: {
      type: [String],
    },
    amenities: {
      type: [String],
    },
    tourPlain: {
      type: [String],
    },
    maxGuest: {
      type: Number,
    },
    minAge: {
      type: Number,
    },
    division: {
      type: Schema.Types.ObjectId,
      ref: "Division",
      required: true,
    },
    tourTypes: {
      type: Schema.Types.ObjectId,
      ref: "TourType",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

tourSchema.pre("save", async function (next) {
  if (this.isModified("title")) {
    const baseSlug = this.title.toLocaleLowerCase().split(" ").join("-");
    let slug = `${baseSlug}-division`;
    let counter = 0;
    while (await Tour.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }
    this.slug = slug;
  }
  next();
});

tourSchema.pre("findOneAndUpdate", async function (next) {
  const tour = this.getUpdate() as Partial<ITour>;
  if (tour.title) {
    const baseSlug = tour.title.toLocaleLowerCase().split(" ").join("-");
    let slug = `${baseSlug}-division`;
    let counter = 0;
    while (await Tour.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }
    tour.slug = slug;
  }
  this.setUpdate(tour);
  next();
});

export const Tour = model<ITour>("Tour", tourSchema);
