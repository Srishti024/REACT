import { useState }from 'react'
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';

const App = () => {
  const[todos,setTodos]=useState([]);
  const addTodo=(text)=>{
    setTodos([...todos,{id:Date.now(),text,completed:false}]);
  }
  const toggleComplete=(id)=>{
    setTodos(
      todos.map(todo=>
        todo.id===id?{...todo,completed:!todo.completed}:todo

      )

    )
  }
  const deleteTodo=(id)=>{
    setTodos(todos.filter(todo=>todo.id!==id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-300 to-blue-400 flex items-center justify-center p-4">
     <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-md">
    
       <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">📝 To-Do List</h1>
      <TodoForm addTodo={addTodo}/>
      <div className="mt-4 space-y-2">
        {todos.map(todo=>(
          <TodoItem
          key={todo.id}
          todo={todo}
          toggleComplete={toggleComplete}
          deleteTodo={deleteTodo}
          />
        ))}
      </div>


     </div>
    </div>
      

  )
}

export default App
