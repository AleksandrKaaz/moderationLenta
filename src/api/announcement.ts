import { Announcement } from '../types/announcement';
import { AnnouncementToServer } from '../types/announcementToServer';

const pathPrefix = 'http://localhost:8082';

async function getAnnouncements(): Promise<Announcement[]> {
  const response = await fetch(`${pathPrefix}/announcements`, { method: 'GET' });
  const data = await response.json();
  return data;
}

async function sendAnnouncements(announcements: AnnouncementToServer[]): Promise<Response> {
  console.log('announcementsInPOST', announcements);
  const response = await fetch(`${pathPrefix}/announcements`, {
    method: 'POST',
    body: JSON.stringify(announcements),
  });
  const data = await response;
  return data;
}

const api = {
  getAnnouncements,
  sendAnnouncements,
};

export default api;
