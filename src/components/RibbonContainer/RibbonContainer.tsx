import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../styles.css';
import { Announcement } from '../../types/announcement';
import api from '../../api/announcement';
import { AnnouncementToServer } from '../../types/announcementToServer';

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

      if (event.code === 'Space') {
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
          labelStatus.innerHTML = '';
          labelStatus.classList.value = 'status';
        }

        let announcementId = focusedElement?.querySelector('span.hyperlink')?.innerHTML;

        checkAndPushItems(announcementId, 'approved');

        labelStatus.innerHTML = 'Одобрено';
        labelStatus?.classList.add('green');

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
        } else {
          checkAndPushItems(announcementId, 'declined', commentElement?.innerHTML);
        }
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
        } else {

          checkAndPushItems(announcementId, 'escalated', commentElement?.innerHTML);
        }
      }

      if (event.code === 'F7') {
        event.preventDefault();

        if (announcementsToServer.current.length !== announcements.length) {
          alert('Не все объявления обработаны');
          return;
        }

        api.sendAnnouncements(announcementsToServer.current).then(
          (response) => {
            console.log('response: ', response);
            alert(response.status);
            setAnnouncements([]);
            announcementsToServer.current = [];
          },
          (error) => alert(error),
        );
      }
    },
    [announcements],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
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
                <textarea className="comment"></textarea>
                <label className="status"></label>
              </div>
            </article>
          ))
        )}
      </section>
      <section className="actions">
        <article className="action">
          <div className="actionName">Одобрить</div>
          <div className="actionCircle green" />
          <div className="actionHotkey">Пробел</div>
        </article>
        <article className="action">
          <div className="actionName">Отклонить</div>
          <div className="actionCircle orange" />
          <div className="actionHotkey">Del</div>
        </article>
        <article className="action">
          <div className="actionName">Эскалация</div>
          <div className="actionCircle blue" />
          <div className="actionHotkey">Shift+Enter</div>
        </article>
        <article className="action">
          <div className="actionName">Сохранить</div>
          <div className="actionCircle empty" />
          <div className="actionHotkey">F7</div>
        </article>
      </section>
    </main>
  );
};
