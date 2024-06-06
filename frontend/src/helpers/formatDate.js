export const formatDate = (inputDate) => {
  // Split the input date string into date and time parts
  const [datePart, timePart] = inputDate.split("T");

  // Extract year, month, and day from the date part
  const [year, month, day] = datePart.split("-");

  // Extract hour and minute from the time part
  const [hour, minute] = timePart.slice(0, -5).split(":"); // Remove ".000Z" and split by ":" to get hour and minute

  // Define month names array
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Convert hour to 12-hour format and determine AM/PM
  let formattedHour = parseInt(hour, 10);
  const amPm = formattedHour >= 12 ? "PM" : "AM";
  formattedHour = formattedHour % 12 || 12;

  // Format the date string
  const formattedDate = `${days[new Date(inputDate).getDay()]} ${day} ${
    monthNames[month - 1]
  } ${year} at ${formattedHour}:${minute} ${amPm}`;

  return formattedDate;
};

export function formatSingleEventDate(isoString) {
  const date = new Date(isoString);

  const day = date.getUTCDate();
  const month = date.toLocaleString("default", {
    month: "long",
    timeZone: "UTC",
  });
  const year = date.getUTCFullYear();

  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minutesStr = minutes < 10 ? "0" + minutes : minutes;

  const daySuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${daySuffix(
    day
  )} ${month} ${year} at ${hours}:${minutesStr} ${ampm}`;
}

export function convertToDateTimeLocal(inputDate) {
  // Parse the input date string into a Date object
  const date = new Date(inputDate);

  // Extract the date components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // Format the components into a string suitable for datetime-local
  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;

  return formattedDate;
}

// Example usage:
const inputDate = "2024-04-21T10:07:00.000Z";
const dateTimeLocal = convertToDateTimeLocal(inputDate);
console.log(dateTimeLocal); // Output: "2024-04-21T10:07"
