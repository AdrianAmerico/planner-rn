export type Link = {
  id: string;
  title: string;
  url: string;
};

export type LinkCreate = Omit<Link, "id"> & {
  tripId: string;
};
