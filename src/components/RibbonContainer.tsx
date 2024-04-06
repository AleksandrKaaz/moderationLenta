import React, { useCallback, useEffect, useRef, useState } from 'react';
import './styles.css';
import { Announcement } from '../types/announcement';
import api from '../api/announcement';
import { AnnouncementToServer } from '../types/announcementToServer';
import { Actions } from './Actions';

export const RibbonContainer = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const announcementsToServer = useRef<AnnouncementToServer[]>([]);
  const firstItemRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (firstItemRef.current && announcements.length > 0) {
      firstItemRef.current.focus();
    }
  }, [announcements]);

  const checkAndPushItems = (
    announcementId: string | undefined,
    status: 'approved' | 'declined' | 'escalated',
    commentElement?: string,
  ) => {
    if (announcementId) {
      let approvedAnnouncement = announcementsToServer.current.find(
        (element) => element.id === +announcementId,
      );

      if (!approvedAnnouncement) {
        announcementsToServer.current.push({
          id: +announcementId,
          status: status,
          comment: commentElement?.innerHTML,
        });
      } else {
        approvedAnnouncement.status = status;
      }
    }
  };

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.code === 'Enter' && event.shiftKey === false) {
        if (announcements.length === 0) {
          api.getAnnouncements().then(
            (response) => {
              setAnnouncements(response);
            },
            (error) => alert(error),
          );
        } else {
          alert('Необходимо промодерировать текущие объявления');
        }
      }

      if (event.code === 'Space' && event.shiftKey === true) {
        event.preventDefault();

        let focusedElement = document.activeElement;

        if (focusedElement?.tagName != 'ARTICLE') {
          let article = focusedElement.closest('article');
          if (article) {
            article.focus();
            focusedElement = document.activeElement;
          }
        }

        let commentElement = focusedElement?.querySelector('textarea');
        if (commentElement) {
          commentElement.classList.add('comment');
        }

        let labelStatus = focusedElement.querySelector('label.status');
        if (labelStatus) {
          labelStatus.classList.value = 'status';
          labelStatus.innerHTML = 'Одобрено';
          labelStatus?.classList.add('green');
        }

        let announcementId = focusedElement?.querySelector('span.hyperlink')?.innerHTML;

        checkAndPushItems(announcementId, 'approved');

        const siblingArticle = focusedElement?.nextElementSibling;
        if (siblingArticle) {
          siblingArticle.focus();
        }
      }

      if (event.code === 'Delete') {
        event.preventDefault();

        let focusedElement = document.activeElement;

        if (focusedElement?.tagName === 'TEXTAREA') {
          let article = focusedElement.closest('article');
          const siblingArticle = article?.nextElementSibling;
          if (siblingArticle) {
            siblingArticle.focus();
          } else {
            article.focus();
          }
        } else {
          let commentElement = focusedElement?.querySelector('textarea');
          commentElement?.focus();
        }

        let labelStatus = focusedElement.querySelector('label.status');

        if (labelStatus) {
          labelStatus.innerHTML = 'Отклонено';
          labelStatus.classList.value = 'status';
          labelStatus?.classList.add('orange');
        }

        let announcementId = focusedElement?.querySelector('span.hyperlink')?.innerHTML;
        let commentElement = focusedElement?.querySelector('textarea');

        if (commentElement && commentElement.classList.contains('comment')) {
          commentElement.classList.value = '';
        }

        checkAndPushItems(announcementId, 'declined');
      }

      if (event.code === 'Enter' && event.shiftKey === true) {
        event.preventDefault();

        let focusedElement = document.activeElement;

        if (focusedElement?.tagName === 'TEXTAREA') {
          let article = focusedElement.closest('article');
          const siblingArticle = article?.nextElementSibling;
          if (siblingArticle) {
            siblingArticle.focus();
          } else {
            article.focus();
          }
        } else {
          let commentElement = focusedElement?.querySelector('textarea');
          commentElement?.focus();
        }

        let labelStatus = focusedElement.querySelector('label.status');

        if (labelStatus) {
          labelStatus.innerHTML = 'Эскалировано';
          labelStatus.classList.value = 'status';
          labelStatus?.classList.add('blue');
        }

        let announcementId = focusedElement?.querySelector('span.hyperlink')?.innerHTML;
        let commentElement = focusedElement?.querySelector('textarea');

        if (commentElement && commentElement.classList.contains('comment')) {
          commentElement.classList.value = '';
        }
        checkAndPushItems(announcementId, 'escalated');
      }

      if (event.code === 'F7') {
        event.preventDefault();

        if (announcementsToServer.current.length !== announcements.length) {
          alert('Не все объявления обработаны');
          return;
        }

        api
          .sendAnnouncements(announcementsToServer.current)
          .finally(() => alert(`Отправлено: ${JSON.stringify(announcementsToServer.current)}`))
          .then(
            (response) => {
              alert(`Статус ответа: ${response.status}`);
              setAnnouncements([]);
              announcementsToServer.current = [];
            },
            (error) => alert(error),
          );
      }
    },
    [announcements],
  );

  const onTextareaFocusOut = (event: FocusEvent) => {
    let announcementId = event.target.dataset.announcementId;
    let approvedAnnouncement = announcementsToServer.current.find(
      (element) => element.id === +announcementId,
    );
    if (approvedAnnouncement) {
      approvedAnnouncement.comment = event.target?.value || undefined;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('focusout', onTextareaFocusOut);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('focusout', onTextareaFocusOut);
    };
  }, [handleKeyPress]);

  return (
    <main className="container">
      <section className="announcements">
        {announcements.length === 0 ? (
          <div>Нажмите Enter, чтобы загрузить объявления</div>
        ) : (
          announcements.map((announcement, index) => (
            <article
              tabIndex={0}
              ref={index === 0 ? firstItemRef : null}
              key={announcement.id}
              className="announcement"
            >
              <header className="announcementHeader">
                <div className="announcementHeaderLeftSide">
                  <span className="hyperlink">{announcement.id}</span> -{' '}
                  {announcement.publishDateString}
                </div>
                <div className="announcementHeaderRightSide hyperlink">
                  {announcement.ownerLogin}
                </div>
              </header>
              <div className="announcementBody">
                <div className="announcementBodyTitle">{announcement.bulletinSubject}</div>
                <div className="announcementBodyContent">
                  <div className="announcementBodyContentText">{announcement.bulletinText}</div>
                  <div className="verticalLine" />
                  <div className="announcementBodyContentImages">
                    {announcement.bulletinImagees.map((image) => (
                      <img src={image} alt="Картинка" decoding="async" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="forModerator">
                <label className="commentLabel"></label>
                <textarea className="comment" data-announcement-id={announcement.id}></textarea>
                <label className="status"></label>
              </div>
            </article>
          ))
        )}
      </section>
      <Actions />
    </main>
  );
};
