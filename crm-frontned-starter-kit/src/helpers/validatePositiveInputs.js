export function extractNumbers(num) {
  return num.replace( /^\D+/g, "");
}

export default (event) => {
  if (event.key == ".")
    return true;
  if (!/[0-9]/.test(event.key))
    event.preventDefault();
};