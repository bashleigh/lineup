export const getCorrectTextColor = (hex: string) => {
  const hexToR = h => parseInt(cutHex(h).substring(0, 2), 16);
  const hexToG = h => parseInt(cutHex(h).substring(2, 4), 16);
  const hexToB = h => parseInt(cutHex(h).substring(4, 6), 16);
  const cutHex = h => (h.charAt(0) == "#" ? h.substring(1, 7) : h);

  const threshold = 130;
  const [hRed, hGreen, hBlue] = [hexToR(hex), hexToG(hex), hexToB(hex)];

  return (hRed * 299 + hGreen * 587 + hBlue * 114) / 1000 > threshold
    ? "#000000"
    : "#FFFFFF";
};
