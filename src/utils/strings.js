export function nullIfEmpty(str)
{
    return str !== "" ? str : null;
}

export function convertToSlug(text) {
    return text.toLowerCase().replace(/\s+/g, '-');
}

export function formatDate(datetimeString) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const dt = new Date(datetimeString);
    const month = months[dt.getMonth()];
    const day = dt.getDate();
    let hours = dt.getHours();
    const minutes = dt.getMinutes();
    const ampm = hours >= 12 ? ' PM' : ' AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // handle midnight
    const formattedTime = hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ampm;

    return month + ' ' + day + ', ' + formattedTime;
}