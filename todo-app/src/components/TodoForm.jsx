import {useState} from 'react'


const TodoForm = ({addTodo}) => {
    const[Text,setText]=useState('');
    const handleSubmit=(e)=>{
        e.preventDefault();
        if(Text.trim()){
            addTodo(Text);
            setText('');
        }
    }
  return (
    <form onSubmit={handleSubmit} className="flex" >
        <input
        type="text"
        placeholder="Add a task..."
        value={Text}
        onChange={(e)=>setText(e.target.value)}
         className="flex-grow p-2 border rounded-1-md outline-none focus:ring-2 focus:ring-blue-400"/>
        <button
        type="submit"
        className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600">Add</button>
      
    </form>
  )
}

export default TodoForm
