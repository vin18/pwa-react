function convertDateTime1(dateTimeEpoch) {
  const dateTime = new Date(Number(dateTimeEpoch) * 1000);
  const year = dateTime.getFullYear();
  const month = dateTime.getMonth() + 1; // Months are zero-based, so add 1
  const day = dateTime.getDate();
  const hours = dateTime.getHours();
  const minutes = dateTime.getMinutes();
  const seconds = dateTime.getSeconds();
  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600); // Calculate hours
  const minutes = Math.floor((seconds % 3600) / 60); // Calculate remaining minutes
  const remainingSeconds = seconds % 60; // Calculate remaining seconds

  // Ensure two-digit formatting for minutes and seconds
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

function convertDateTime(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
  const options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };
  return date.toLocaleString('en-GB', options).replace(',', '').toUpperCase();
}

function convertCallDurationSeconds(seconds) {
  const date = new Date(null);
  date.setSeconds(seconds);
  return date.toISOString().substr(11, 8);
}

export { convertDateTime, formatDuration, convertCallDurationSeconds };
