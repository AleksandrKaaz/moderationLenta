export interface Announcement {

    /**
     * @description int ID объявления
     */
    id: number;

    /**
     * @description int timestamp даты публикации
     */
    publishDate: number;

    /**
     * @description string дата публикации в человекочитаемом формате
     */
    publishDateString: string;

    /**
     * @description  int ID владельца объявления
     */
    ownerId: number;

    /**
     * @description string имя пользователя владельца объявления
     */
    ownerLogin: string;

    /**
     * @description string заголовок объявления
     */
    bulletinSubject: string;

    /**
     * @description string текст объявления
     */
    bulletinText:string;

    /**
     * @description string[] ссылки на прикрепленные к объявлению изображения
     */
    bulletinImagees:string[];
}