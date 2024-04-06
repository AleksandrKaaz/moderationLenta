import React from 'react';

export const Actions = () => {
  return (
    <section className="actions">
      <article className="action">
        <div className="actionName">Одобрить</div>
        <div className="actionCircle green" />
        <div className="actionHotkey">Shift+Space</div>
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
  );
};
