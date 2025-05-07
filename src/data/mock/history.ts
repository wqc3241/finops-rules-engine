
import { HistoryItem, Note } from '../../types/application';

export const historyItems: HistoryItem[] = Array(4).fill({
  title: 'History Title',
  previously: 'Placeholder Text',
  now: 'Placeholder Text',
  time: '11.22 am',
  date: 'Friday, Feb 14',
  user: 'Michael McCann'
});

export const notes: Note[] = [
  {
    content: 'Hey @Tom, this customer is the best',
    time: '11.22 am',
    date: 'Friday, Feb 14',
    user: 'Michael McCann'
  }
];
