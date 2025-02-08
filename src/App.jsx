import { useState, useEffect } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.css'
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';


function App() {

  const [todoList, setTodoList] = useState([])
  const [taskTitle, setTaskTitle]= useState('')
  const [tempDelTodos, setTempDelTodos] = useState([])

  // 控制弹窗
  const [showModal, setShowModal] = useState(false)
  const [open, setOpen] = useState(false)
  // 存储临时的todo给组件使用
  const [tempTodo, setTempTodo] = useState([])
  // 存储临时的优先级
  const [tempPriority, setTempPriority] = useState(0)

  // -------------------------------------------------------------------------------------------------------- useEffect
  // 渲染页面时获取localStorage
  useEffect(() => {
    const storedTodos = localStorage.getItem('TODOS')
    setTodoList(JSON.parse(storedTodos) || [])
  }, [])

  // todoList变化就更新localStorage
  useEffect(()=>{
    if (todoList.length > 0) {
      localStorage.setItem('TODOS', JSON.stringify(todoList))
    } 
  }, [todoList])

  // 渲染页面时获取 回收站
  useEffect(() => {
    const storedTempDel = localStorage.getItem('TempDel')
    setTempDelTodos(JSON.parse(storedTempDel) || [])
  }, [])

  // tempDelTodos变化就更新 回收站
  useEffect(()=>{
    if (tempDelTodos.length > 0) {
      localStorage.setItem('TempDel', JSON.stringify(tempDelTodos))
    }
  }, [tempDelTodos])
  // -------------------------------------------------------------------------------------------------------- useEffect

  function handleTitleInput(e) {
    setTaskTitle(e.target.value)
  }

  function newTask() {
    const timestamp = Date.now()
    const date = new Date(timestamp)
    const formateDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`

    const newTodo = {
      id: timestamp,                                      // 根据时间生成id
      name: taskTitle,                                     // 用户输入的任务名称
      content: ["", "", "", "", ""],                       // 内容初始化为空字符串，最多五条
      priority: 3,                                         // 默认优先级为3
      isCompleted: false,                                  // 初始为未完成
      isDeleted: false,                                    // 初始为未删除
      date: formateDate
    }
    setTodoList([...todoList, newTodo])
    setTaskTitle('')
  }

  function testFunc() {
    console.log(todoList)
  }

  // --------------------------------------------------------------- 需要学习
  function handleTodoIsCompleted(todo) {
    const newTodoList = todoList.map(item => {
      if (todo.id === item.id) {
        return {...item, isCompleted: !todo.isCompleted}
      } else {
        return item
      }
    })

    setTodoList(newTodoList)
  }
  // ------------------------------------------------------------------------

  function handleTempDelete(todo) {
    // 加入回收站
    setTempDelTodos([...tempDelTodos, todo])

    const newTodos = todoList.filter(item => item.id !== todo.id)

    // 这里是为了处理StrictMode下，useEffect在加入了todoList.length > 0的判断，导致了最后一个项目无法正常删除的问题，删除main.jsx中的StrictMode后也就不需要这行代码
    // 因为删除了唯一一个项目后，todoList.length = 0 也就无法触发useEffect了
    if (newTodos.length === 0) {
      setTodoList(newTodos)
      localStorage.setItem('TODOS', JSON.stringify(newTodos))
    }
    // ------------------------------------------------------

    setTodoList(newTodos)
  }

  function handleModalCancel() {
    setShowModal(false)
  }

  function handleTodoInfo(todo) {
    setShowModal(true)
    setTempTodo(todo)
  }

  function handlePriorityInput(e) {
    setTempPriority(e.target.value)
  }

  function hanlePriorityChange() {
    const newTodoList = todoList.map(item => {
      if (tempTodo.id === item.id) {
        return {...item, priority: tempPriority}
      } else {
        return item
      }
    })

    setTodoList(newTodoList)
    setShowModal(false)
  }

  const handleAlertOpen = () => {
    setOpen(true);
  }

  const handleAlertClose = (event, reason) => {
    // 如果点击了点击空白区域而非关闭按钮，可以选择忽略
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  // ------------------------------------------------------------------------------------------------------------------------ 组件部分
  const [selectedButton, setSelectedButton] = useState(1)
  // 控制侧边栏按钮
  const handleClick = (buttonId) => {
    setSelectedButton(buttonId);
  };

  // 默认排序组件
  const SortDefult = () => {
    return (
      todoList.length > 0 ? todoList.map(todo => (
        <div className={`todoBox ${todo.isCompleted ? 'todoBox-completed' : ''}`} key={todo.id}>
          {/* <input type="checkbox" className='checkbox' checked={todo.isCompleted} onChange={()=>{handleTodoIsCompleted(todo)}}/> */}
          <label className="container">
            <input type="checkbox" checked={todo.isCompleted} onChange={()=>{handleTodoIsCompleted(todo)}}/>
            <div className="checkmark"></div>
          </label>
          <div className={todo.isCompleted ? 'todoTitle-comp' : 'todoTitle-incomp'} onClick={()=>handleTodoInfo(todo)}>{todo.name}</div>
          {/* <button className='deletTodoBtn' onClick={()=>{handleTempDelete(todo)}}>删除</button> */}
          <button className="delete-button" onClick={()=>{handleTempDelete(todo)}}>
            <svg className="delete-svgIcon" viewBox="0 0 448 512">
                              <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                            </svg>
          </button>
        </div>
      )) : (
        <div>No task</div>
      )
    )
  }

  // 按时间排序
  const SortByDate = () => {
    const [dateList, setDateList] = useState([])

    function createDateList() {
      const tempDate = []
      const tempList = []
  
      for (const item of todoList) {
        if (!tempDate.includes(item.date)) {
          tempDate.push(item.date)
          tempList.push([item])
        } else {
          const index = tempDate.indexOf(item.date)
          tempList[index].push(item)
        }
      }
      console.log(tempList)
      setDateList(tempList)
    }

    useEffect(() => {
      createDateList()
    }, [todoList])
     
    return (
      dateList.length > 0 ? dateList.map(todos => (
        <div key={todos[0].date} className='showTodoBox-dom'>
          <h3>{todos[0].date}</h3>
          {todos.map(todo => (
            // <div className='todoBox' key={todo.id}>
            //   <input type="checkbox" className='checkbox' checked={todo.isCompleted} onChange={()=>{handleTodoIsCompleted(todo)}}/>
            //   <div className={todo.isCompleted ? 'todoTitle-comp' : 'todoTitle-incomp'}>{todo.name}</div>
            //   <button className='deletTodoBtn' onClick={()=>{handleTempDelete(todo)}}>删除</button>
            // </div>
            <div className={`todoBox ${todo.isCompleted ? 'todoBox-completed' : ''}`} key={todo.id}>
              {/* <input type="checkbox" className='checkbox' checked={todo.isCompleted} onChange={()=>{handleTodoIsCompleted(todo)}}/> */}
              <label className="container">
                <input type="checkbox" checked={todo.isCompleted} onChange={()=>{handleTodoIsCompleted(todo)}}/>
                <div className="checkmark"></div>
              </label>
              <div className={todo.isCompleted ? 'todoTitle-comp' : 'todoTitle-incomp'} onClick={()=>handleTodoInfo(todo)}>{todo.name}</div>
              {/* <button className='deletTodoBtn' onClick={()=>{handleTempDelete(todo)}}>删除</button> */}
              <button className="delete-button" onClick={()=>{handleTempDelete(todo)}}>
                <svg className="delete-svgIcon" viewBox="0 0 448 512">
                                  <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                                </svg>
              </button>
            </div>
          ))}
        </div>
      )) : (
        <div>No task</div>
      )

    )
  }

  // 按优先级排序
  const SortByPriority = () => {
    const [priorityList, setPriorityList] = useState([])
    
    function createPriorityList() {
      const tempList = [...todoList]
      // const tempList = todoList
      const sortTempList = tempList.sort((a, b) => b.priority - a.priority)
      setPriorityList(sortTempList)
    }

    useEffect(() => {
      createPriorityList()
    }, [todoList])

    function getPriorityClass(priority) {
      // 这里根据 priority 的范围返回不同的 class 名，可以根据需求自定义
      if (priority <= 1) {
        return 'priority-vlow'      
      } else if (priority <= 3) {
        return 'priority-low'
      } else if (priority <= 5) {
        return 'priority-medium'  
      } else if (priority <= 7) {
        return 'priority-high'
      } else {
        return 'priority-vhigh'  
      }
    }

    return (
      priorityList.length > 0 ? priorityList.map(todo => (
        <div className={`todoBox ${todo.isCompleted ? 'todoBox-completed' : ''}`} key={todo.id}>
          {/* <input type="checkbox" className='checkbox' checked={todo.isCompleted} onChange={()=>{handleTodoIsCompleted(todo)}}/> */}
          <label className="container">
            <input type="checkbox" checked={todo.isCompleted} onChange={()=>{handleTodoIsCompleted(todo)}}/>
            <div className="checkmark"></div>
          </label>
          <div className={todo.isCompleted ? 'todoTitle-comp' : 'todoTitle-incomp'} onClick={()=>handleTodoInfo(todo)}>{todo.name}</div>
          {/* <button className='deletTodoBtn' onClick={()=>{handleTempDelete(todo)}}>删除</button> */}
          <div className={`cardPriority ${getPriorityClass(todo.priority)}`} >
            <div className="contentPriority">
              <p className="heading">{todo.priority}</p>
            </div>
          </div>
          <button className="delete-button" onClick={()=>{handleTempDelete(todo)}}>
            <svg className="delete-svgIcon" viewBox="0 0 448 512">
                              <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                            </svg>
          </button>
        </div>
      )) : (
        <div>No task</div>
      )
    )
  }

  // 按未完成排序
  const SortByUndo = () => {
    const [undoList, setUndoList] = useState([])

    function createUndoList() {
      const tempUndoList = todoList.filter(item => !item.isCompleted)
      setUndoList(tempUndoList)
    }

    useEffect(() => {
      createUndoList()
    }, [todoList])

    return (
      undoList.length > 0 ? undoList.map(todo => (
        <div className={`todoBox ${todo.isCompleted ? 'todoBox-completed' : ''}`} key={todo.id}>
          {/* <input type="checkbox" className='checkbox' checked={todo.isCompleted} onChange={()=>{handleTodoIsCompleted(todo)}}/> */}
          <label className="container">
            <input type="checkbox" checked={todo.isCompleted} onChange={()=>{handleTodoIsCompleted(todo)}}/>
            <div className="checkmark"></div>
          </label>
          <div className={todo.isCompleted ? 'todoTitle-comp' : 'todoTitle-incomp'} onClick={()=>handleTodoInfo(todo)}>{todo.name}</div>
          {/* <button className='deletTodoBtn' onClick={()=>{handleTempDelete(todo)}}>删除</button> */}
          <button className="delete-button" onClick={()=>{handleTempDelete(todo)}}>
            <svg className="delete-svgIcon" viewBox="0 0 448 512">
                              <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                            </svg>
          </button>
        </div>
      )) : (
        <div>No task</div>
      )
    )
  }

  const SortByDone = () => {
    const [doneList, setDoneList] = useState([])

    function createDoneList() {
      const tempDoneList = todoList.filter(item => item.isCompleted)
      setDoneList(tempDoneList)
    }

    useEffect(() => {
      createDoneList()
    }, [todoList])

    return (
      doneList.length > 0 ? doneList.map(todo => (
        <div className={`todoBox ${todo.isCompleted ? 'todoBox-completed' : ''}`} key={todo.id}>
          {/* <input type="checkbox" className='checkbox' checked={todo.isCompleted} onChange={()=>{handleTodoIsCompleted(todo)}}/> */}
          <label className="container">
            <input type="checkbox" checked={todo.isCompleted} onChange={()=>{handleTodoIsCompleted(todo)}}/>
            <div className="checkmark"></div>
          </label>
          <div className={todo.isCompleted ? 'todoTitle-comp' : 'todoTitle-incomp'} onClick={()=>handleTodoInfo(todo)}>{todo.name}</div>
          {/* <button className='deletTodoBtn' onClick={()=>{handleTempDelete(todo)}}>删除</button> */}
          <button className="delete-button" onClick={()=>{handleTempDelete(todo)}}>
            <svg className="delete-svgIcon" viewBox="0 0 448 512">
                              <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                            </svg>
          </button>
        </div>
      )) : (
        <div>No task</div>
      )
    )
  }

  

  return (
    <>
      <div className='title'>TODO LIST 📝 待办事件薄</div>
      <div className='newTodoBox'>
        <input type="text" className='userInputTitle' placeholder='🍟 新增待办事项...' value={taskTitle} onChange={handleTitleInput}/>
        <button className='newTodoBtn' onClick={() => {newTask(); handleAlertOpen()}}>新增事项</button>
        {/* <button className='newTodoBtn' onClick={testFunc}>Test btn</button> */}
      </div>
      <div className='showTodoBox'>
      <TransitionGroup>
        <CSSTransition
          key={selectedButton}      // 每次切换时 key 变化，触发动画
          timeout={300}             // 动画持续时间，与 CSS 中的 transition 时间保持一致
          classNames="fade"         // 动画类名前缀
        >
          {/* 为了让 CSSTransition 包裹单个 DOM 节点，这里用一个 <div> 包裹 */}
          <div className='showTodoBox-dom'>
            {selectedButton === 1 && <SortDefult/>}
            {selectedButton === 2 && <SortByDate/>}
            {selectedButton === 3 && <SortByPriority/>}
            {selectedButton === 4 && <SortByUndo/>}
            {selectedButton === 5 && <SortByDone/>}
          </div>
        </CSSTransition>
      </TransitionGroup>
        {/* {
          todoList.length > 0 ? todoList.map(todo => (
            <div className='todoBox' key={todo.id}>
              <input type="checkbox" className='checkbox' checked={todo.isCompleted} onChange={()=>{handleTodoIsCompleted(todo)}}/>
              <div className={todo.isCompleted ? 'todoTitle-comp' : 'todoTitle-incomp'}>{todo.name}</div>
              <button className='deletTodoBtn' onClick={()=>{handleTempDelete(todo)}}>删除</button>
            </div>
          )) : (
            <div>No task</div>
          )
        } */}
      </div>
      {/* <div className='btnContainer'>
        <button className='sortBtn' onClick={()=>handleClick(1)}>默认排序</button>
        <button className='sortBtn' onClick={()=>handleClick(2)}>按时间排序</button>
        <button className='sortBtn' onClick={()=>handleClick(3)}>按优先级排序</button>
        <button className='sortBtn' onClick={()=>handleClick(4)}>未完成</button>
        <button className='sortBtn' onClick={()=>handleClick(5)}>已完成</button>
      </div> */}
      <div className='btnContainer'>
        <div className="cards">
            <div className="card lightblue" onClick={()=>handleClick(1)}>
                <p className="tip">默认排序</p>
            </div>
            <div className="card lightblue" onClick={()=>handleClick(2)}>
                <p className="tip">按时间排序</p>
            </div>
            <div className="card lightblue" onClick={()=>handleClick(3)}>
                <p className="tip">按优先级排序</p>
            </div>
            <div className="card lightblue" onClick={()=>handleClick(4)}>
                <p className="tip">未完成的事项</p>
            </div>
            <div className="card lightblue" onClick={()=>handleClick(5)}>
                <p className="tip">已完成的事项</p>
            </div>
        </div>
      </div>

      {showModal && (
        <div className='modal'>
          <div>{tempTodo.name}</div>
          <p>修改优先级 输入数字0-9</p>
          <input type="text" className='priorityInput' value={tempPriority} onChange={handlePriorityInput}/>
          <button className='button' onClick={hanlePriorityChange}>确认修改</button>
          <button className='button' onClick={handleModalCancel}>取消</button>
        </div>
      )}

      <Snackbar
        open={open}
        autoHideDuration={6000} // 6秒后自动关闭
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // 定位在页面顶部居中
      >
        <Alert onClose={handleAlertClose} severity="success" sx={{ width: '100%' }}>
        🐑新增待办事项成功🐑
        </Alert>
      </Snackbar>

      <div className='buttomBar'></div>

    </>
  )
}

export default App
