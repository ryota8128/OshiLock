import { z } from "zod";

export const USER_RANK = {
  LEGEND: "LEGEND",
  STAR: "STAR",
  ACE: "ACE",
  REGULAR: "REGULAR",
  ROOKIE: "ROOKIE",
  NO_RANK: "NO_RANK",
} as const;

export type UserRank = (typeof USER_RANK)[keyof typeof USER_RANK];

export namespace UserRank {
  export const schema = z.enum(["LEGEND", "STAR", "ACE", "REGULAR", "ROOKIE", "NO_RANK"]);
}
