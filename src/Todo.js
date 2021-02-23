import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import axios from 'axios';

const CreatTask = ({
  onCreateTask,
  resetForm,
  buttonText,
  data = {task: '', student: '', _id: null},
}) => {
  const {register, handleSubmit, reset, setValue} = useForm({});

  useEffect(() => {
    if (resetForm) {
      reset({
        task: '',
        student: '',
      });
    }
  }, [resetForm, reset]);

  useEffect(() => {
    setValue('_id', data._id);
    setValue('task', data.task);
    setValue('student', data.student);
  }, [data, setValue]);

  const onSubmit = (data) => {
    onCreateTask(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        <input name="task" ref={register} placeholder="Task" />
      </label>
      <label>
        <input name="student" ref={register} placeholder="Student"></input>
      </label>
      <button>{buttonText}</button>
    </form>
  );
};

const TodoItem = ({
  task,
  student,
  onDeleteTask,
  id,
  isCompleted,
  handleisCompleted,
  object,
}) => {
  return (
    <li>
      <input
        type="radio"
        value={isCompleted}
        onChange={() => handleisCompleted(object)}
      />
      Task: {task} Student: {student} is completed : {isCompleted}
      <button onClick={() => onDeleteTask(id)}>Delete</button>
    </li>
  );
};

const TodoContainer = () => {
  const [query, setQuery] = useState(null);
  const [idtoDelete, setidToDelete] = useState(null);
  const [newTask, setNewTask] = useState(null);
  const [resetForm, setResetForm] = useState(false);
  const [taskToUpdate, setTaskToUpdate] = useState(null);

  //   This if the GET Method
  useEffect(() => {
    const res = axios.get('https://todos-academlo.herokuapp.com/api/todos');
    res.then((response) => {
      setQuery(response.data.todos);
    });
  }, []);
  // This is the POST method
  useEffect(() => {
    if (newTask) {
      const res = axios({
        url: 'https://todos-academlo.herokuapp.com/api/todo',
        data: newTask,
        method: 'POST',
      });

      res.then((response) => {
        setQuery((PrevState) => [response.data, ...PrevState]);
        setResetForm(true);
      });
    }
  }, [newTask]);
  // This is the Delete Method

  useEffect(() => {
    if (idtoDelete) {
      const res = axios.delete(
        `https://todos-academlo.herokuapp.com/api/todo/${idtoDelete}`
      );

      res.then(() => {
        setQuery((PrevState) =>
          PrevState.filter((value) => value._id !== idtoDelete)
        );
      });
    }

    return () => {
      setidToDelete(null);
    };
  }, [idtoDelete]);

  useEffect(() => {
    if (taskToUpdate) {
      const res = axios.put(
        `https://todos-academlo.herokuapp.com/api/todo/${taskToUpdate._id}`,
        taskToUpdate
      );

      res.then((response) => {
        setQuery((PrevState) =>
          PrevState.map((task) => {
            if (task._id !== response.data._id) {
              return task;
            }
            return {
              ...response,
            };
          })
        );
      });
      setTaskToUpdate(null);
    }
  }, [taskToUpdate]);

  const handleCreatetask = (data) => {
    setNewTask(data);
  };
  const handleDeleteTask = (id) => {
    setidToDelete(id);
  };

  const changetoIscompleted = (data) => {
    let temp_task = data;
    temp_task.isCompleted = !data.isCompleted;
    setTaskToUpdate(temp_task);
  };

  let ArrayTodoItems = [];
  if (query) {
    ArrayTodoItems = query.map((value) => (
      <TodoItem
        key={value._id}
        task={value.task}
        student={value.student}
        id={value._id}
        value={value.isCompleted}
        object={value}
        isCompleted={value.isCompleted ? 'True' : 'False'}
        handleisCompleted={changetoIscompleted}
        onDeleteTask={handleDeleteTask}
      />
    ));
  }

  return (
    <div>
      <div>
        <CreatTask
          resetForm={resetForm}
          onCreateTask={handleCreatetask}
          buttonText="Create Task"
        />
      </div>
      {query && <ul>{ArrayTodoItems}</ul>}
    </div>
  );
};
export default TodoContainer;
