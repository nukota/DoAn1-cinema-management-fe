export type CinemasPageItemDTO = {
  _id: string;
  name: string;
  address: string;
  employee_count: number;
  room_count: number;
};

// DO THIS (date backend send back)
export type CinemasPageDTO = {
  cinemas: CinemasPageItemDTO[];
};
