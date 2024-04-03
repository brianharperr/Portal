export function nullIfEmpty(str)
{
    return str !== "" ? str : null;
}

export function convertToSlug(text) {
    return text.toLowerCase().replace(/\s+/g, '-');
}