export type Activity = {
  id: string;
  occurs_at: string;
  title: string;
};

export type ActivityCreate = Omit<Activity, "id"> & {
  tripId: string;
};

export type ActivityResponse = {
  activities: {
    date: string;
    activities: Activity[];
  }[];
};
