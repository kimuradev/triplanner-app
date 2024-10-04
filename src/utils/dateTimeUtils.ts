export function formatHour(input: string) {
    // Remove any non-numeric characters except ":"
    input = input.replace(/[^\d]/g, '');
    // Insert a colon if input length is greater than 2
    if (input.length > 2) {
        input = input.slice(0, 2) + ':' + input.slice(2, 4);
    }
    // Ensure hours and minutes are within valid range
    const [hours, minutes] = input.split(':');

    if (hours && parseInt(hours) > 23) {
        input = '23' + (minutes ? ':' + minutes : '');
    }

    if (minutes && parseInt(minutes) > 59) {
        input = hours + ':59';
    }

    return input;
}

export const formatTimestampToDate = (timestamp: number | undefined) => {
    if (!timestamp) return new Date();

    const date = new Date(timestamp);

    return date
}
