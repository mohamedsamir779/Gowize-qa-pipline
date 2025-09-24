export function captilazeFirstLetter(word){
  if (!word) return "-";
  const firstLetterCaptilaziedWord = word.charAt(0).toUpperCase() + word.slice(1);
  return firstLetterCaptilaziedWord;
}
export function displaySubString(word){
  let subString = "";
  for (let i = 0; i < 4; i++){
    subString += word[i];
  }
  return subString;
}

export const capitalToReadable = (str = "") => {
  var frags = str.split("_");
  for (let i = 0; i < frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1).toLowerCase();
  }
  return frags.join(" ");
};