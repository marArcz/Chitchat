export function formatChatTimestamp(dateString) {
    const date = new Date(dateString);
    const now = new Date();

    const isToday = (someDate) => {
        const today = new Date();
        return (
            someDate.getDate() === today.getDate() &&
            someDate.getMonth() === today.getMonth() &&
            someDate.getFullYear() === today.getFullYear()
        );
    };

    const formatTime = (someDate) => {
        let hours = someDate.getHours();
        const minutes = someDate.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutesStr} ${ampm}`;
    };

    const formatDateTime = (someDate) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        };
        return someDate.toLocaleDateString(undefined, options);
    };

    return isToday(date) ? formatTime(date) : formatDateTime(date);
}
