export const toBengaliNumber = (num: number | string): string => {
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toString()
    .replace(/\d/g, (digit) => bengaliDigits[parseInt(digit)]);
};

export const formatBengaliCurrency = (num: number | string): string => {
  if (num === null || num === undefined || num === "") return "০";

  let numberVal: number;
  if (typeof num === "string") {
    const englishNum = toEnglishNumber(num);
    numberVal = parseFloat(englishNum);
  } else {
    numberVal = num;
  }

  if (isNaN(numberVal)) return "০";

  return numberVal.toLocaleString("bn-BD");
};

export const toEnglishNumber = (str: string): string => {
  const bengaliToEnglish: { [key: string]: string } = {
    "০": "0",
    "১": "1",
    "২": "2",
    "৩": "3",
    "৪": "4",
    "৫": "5",
    "৬": "6",
    "৭": "7",
    "৮": "8",
    "৯": "9",
  };
  return str.replace(/[০-৯]/g, (digit) => bengaliToEnglish[digit]);
};
export const formatInputAsBengaliNumber = (str: string): string => {
  // Remove any existing commas
  const cleanStr = str.replace(/,/g, "");

  // Convert to English to check validity and process
  const englishStr = toEnglishNumber(cleanStr);

  // Allow empty string
  if (englishStr === "") return "";

  // Check if it's a valid number format (digits, optional one decimal point)
  if (!/^[0-9]*\.?[0-9]*$/.test(englishStr)) return str;

  const parts = englishStr.split(".");
  let integerPart = parts[0];
  const decimalPart = parts.length > 1 ? "." + parts[1] : "";

  // Format integer part with commas
  if (integerPart !== "") {
    integerPart = parseInt(integerPart).toLocaleString("en-IN");
  }

  // Convert back to Bengali
  return toBengaliNumber(integerPart + decimalPart);
};
