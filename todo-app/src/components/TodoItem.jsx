
const TodoItem = ({todo, toggleComplete, deleteTodo}) => {
  return (
    <div className="flex justify-between items-center bg-gray-100 rounded-md p-2 shadow-sm">
        <span
        onClick={()=>toggleComplete(todo.id)}
        className={`cursor-pointer flex-grow ${todo.completed?'line-through text-gray-400':'text-gray-800'}`}
      >{todo.text}</span>
      <button onClick={()=>deleteTodo(todo.id)}
      className="text-red-500 hover:text-red-700 border-black font-bold ml-4">delete</button>
    </div>
  )
}

export default TodoItem
