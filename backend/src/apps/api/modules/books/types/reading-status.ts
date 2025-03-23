export enum EReadingStatus {
  WANT_TO_READ = 'want_to_read',
  READING = 'reading',
  READ = 'read',
  RE_READING = 're_reading', // for books being read again
  ON_HOLD = 'on_hold', // for books that are temporarily paused
  DROPPED = 'dropped', // for books that were started but not finished
  PLAN_TO_RE_READ = 'plan_to_re_read', // for books planned to be read again in the future
}
