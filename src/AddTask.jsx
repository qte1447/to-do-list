import React, { useState } from 'react';

// компонент формы добавления задачи, получает функцию addTask из App
const ToDoForm = ({ addTask }) => {
  // локальное состояние текстового поля
  const [text, setText] = useState('');

  // обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault(); // отменяем перезагрузку страницы
    addTask(text);
    setText(''); // очищаем поле после добавления
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={text}
        type="text"
        onChange={(e) => setText(e.target.value)} // обновляем состояние при вводе
        placeholder="Введите задачу..."
      />
      <button type="submit">Сохранить</button>
    </form>
  );
};

export default ToDoForm;
