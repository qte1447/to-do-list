import React from 'react';

// компонент одной задачи, получает объект задачи и функции управления
const ToDo = ({ todo, toggleTask, removeTask }) => {
  return (
    <div className="item-todo">
      {/* текст задачи, клик меняет статус; зачёркивается если выполнена */}
      <div
        className={todo.complete ? 'item-text strike' : 'item-text'}
        onClick={() => toggleTask(todo.id)}
      >
        {todo.task}
      </div>

      {/* кнопка удаления задачи */}
      <div className="item-delete" onClick={() => removeTask(todo.id)}>
        ✕
      </div>
    </div>
  );
};

export default ToDo;
