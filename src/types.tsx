export enum Position {
  GK = "GK",
  LB = "LB",
  CB = "CB",
  RB = "RB",
  LWB = "LWB",
  RWB = "RWB",
  CM = "CM",
  CDM = "CDM",
  CAM = "CAM",
  LM = "LM",
  LW = "LW",
  RW = "RW",
  RM = "RM",
  ST = "ST",
  LST = "LST",
  RST = "RST",
}

export type Player = {
  id: string,
  number?: string;
  name?: string;
  position?: Position[];
};
