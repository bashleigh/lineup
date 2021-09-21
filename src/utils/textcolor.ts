export const getCorrectTextColor = (hex: string, opposite: boolean = false) => {
  const hexToR = h => parseInt(cutHex(h).substring(0, 2), 16);
  const hexToG = h => parseInt(cutHex(h).substring(2, 4), 16);
  const hexToB = h => parseInt(cutHex(h).substring(4, 6), 16);
  const cutHex = h => (h.charAt(0) == "#" ? h.substring(1, 7) : h);

  const threshold = 130;
  const [hRed, hGreen, hBlue] = [hexToR(hex), hexToG(hex), hexToB(hex)];

  const contrast: "black" | "white" =
    (hRed * 299 + hGreen * 587 + hBlue * 114) / 1000 > threshold
      ? "black"
      : "white";

  if (opposite) {
    return contrast === "black" ? "#FFFFFF" : "#000000";
  }
  return contrast === "black" ? "#000000" : "#FFFFFF";
};
