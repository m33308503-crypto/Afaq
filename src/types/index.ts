export type EventCategory = 'workshop' | 'course' | 'event';

export type EventStatus = 'draft' | 'published' | 'hidden';

export interface EventItem {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  startsAt: string;
  dateLabel: string;
  timeLabel?: string;
  location: string;
  organizer: string;
  coverImageUrl?: string;
  status: EventStatus;
  seatsTotal?: number;
  seatsTaken?: number;
}

export interface CategoryInfo {
  key: EventCategory;
  label: string;
  subtitle: string;
  description: string;
  count: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  createdAt?: string;
}

export interface RegistrationRecord {
  id: string;
  userId: string;
  eventId: string;
  createdAt: string;
}

export interface RegistrationWithEvent extends RegistrationRecord {
  event: EventItem;
}
