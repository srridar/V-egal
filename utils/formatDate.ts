// Format time (e.g., 10:30 AM)
export const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};








// Format date (e.g., Apr 14, 2026)
export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};





// Format chat timestamp (WhatsApp style)
export const formatChatTime = (date: Date) => {
  const now = new Date();
  const messageDate = new Date(date);

  const isToday =
    now.toDateString() === messageDate.toDateString();

  const isYesterday =
    new Date(now.setDate(now.getDate() - 1)).toDateString() ===
    messageDate.toDateString();

  if (isToday) {
    return formatTime(messageDate);
  }

  if (isYesterday) {
    return "Yesterday";
  }

  return formatDate(messageDate);
};