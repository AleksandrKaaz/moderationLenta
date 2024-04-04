export interface AnnouncementToServer {
  /**
   * @description int ID объявления
   */
  id: number;

  /**
   * @description статус объявления перед отправкой
   */
  status?: 'approved' | 'declined' | 'escalated';

  /**
   * @description комментарий при отклонении или отправке модератору
   */
  comment?: string;
}
