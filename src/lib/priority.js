export function computePriorityScore(task) {
  const now = new Date();
  const importanceFactor = (task.importance / 5) * 40;
  let urgencyFactor = 10;
  if (task.deadline) {
    const hoursLeft = (new Date(task.deadline) - now) / (1000 * 60 * 60);
    if (hoursLeft <= 0)   urgencyFactor = 40;
    else if (hoursLeft <= 6)  urgencyFactor = 38;
    else if (hoursLeft <= 24) urgencyFactor = 34;
    else if (hoursLeft <= 72) urgencyFactor = 26;
    else if (hoursLeft <= 168) urgencyFactor = 18;
    else urgencyFactor = Math.max(5, 40 * Math.exp(-hoursLeft / (7 * 24)));
  }
  const hours = Math.max(0.25, task.time_estimate || 1);
  const sizeFactor = hours <= 0.5 ? 20 : hours <= 1 ? 17 : hours <= 2 ? 14 : hours <= 4 ? 10 : Math.max(2, 20 - hours * 2);
  return Math.min(100, Math.round(importanceFactor + urgencyFactor + sizeFactor));
}

export function getPriorityLabel(score) {
  if (score >= 75) return { label: 'Critical', color: 'var(--rose-400)',    bg: 'rgba(244,63,94,0.12)' };
  if (score >= 55) return { label: 'High',     color: 'var(--orange-400)',  bg: 'rgba(249,115,22,0.12)' };
  if (score >= 35) return { label: 'Medium',   color: 'var(--amber-400)',   bg: 'rgba(251,191,36,0.12)' };
  return              { label: 'Low',      color: 'var(--emerald-400)', bg: 'rgba(52,211,153,0.12)' };
}

export function getDeadlineStatus(deadline) {
  if (!deadline) return null;
  const hoursLeft = (new Date(deadline) - new Date()) / (1000 * 60 * 60);
  if (hoursLeft < 0)  return { label: 'Overdue',  color: 'var(--rose-400)' };
  if (hoursLeft < 6)  return { label: 'Due soon', color: 'var(--orange-400)' };
  if (hoursLeft < 24) return { label: 'Today',    color: 'var(--amber-400)' };
  if (hoursLeft < 72) return { label: 'This week',color: 'var(--cyan-400)' };
  return null;
}
