import { useState, useEffect } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.css'
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';


function App() {

  const [todoList, setTodoList] = useState([])
  const [taskTitle, setTaskTitle]= useState('')
  const [tempDelTodos, setTempDelTodos] = useState([])
  const [revrese, setRevres] = useState(false)

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
    setTempPriority(todo.priority)
  }

  function handlePriorityClick(value) {
    setTempPriority(value)
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

  function getPriorityClass(priority) {
    // 这里根据 priority 的范围返回不同的 class 名，可以根据需求自定义
    if (priority <= 1) {
      return 'priority-vlow'      
    } else if (priority <= 2) {
      return 'priority-low'
    } else if (priority <= 3) {
      return 'priority-medium'  
    } else if (priority <= 4) {
      return 'priority-high'
    } else {
      return 'priority-vhigh'  
    }
  }

  function handlePriorityEmoji(priority) {
    if (priority <= 1) {
      return '😎'      
    } else if (priority <= 2) {
      return '😀'
    } else if (priority <= 3) {
      return '😐'  
    } else if (priority <= 4) {
      return '😠'
    } else {
      return '😡'  
    }
  }
 

  // ------------------------------------------------------------------------------------------------------------------------ 组件部分
  const [selectedButton, setSelectedButton] = useState(1)
  // 控制侧边栏样式
  const [activeButton, setActiveButton] = useState(1)
  // 控制侧边栏按钮
  const handleClick = (buttonId) => {
    setSelectedButton(buttonId);
    setActiveButton(buttonId)
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
      
      const result = revrese ? [...tempList].reverse() : tempList;
      console.log(result)
      setDateList(result)
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
              <div className={`cardPriority ${getPriorityClass(todo.priority)}`} onClick={()=>handleTodoInfo(todo)} >
                <div className="contentPriority">
                  <p className="heading">{handlePriorityEmoji(todo.priority)}</p>
                </div>
              </div>
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

      const result = revrese ? [...sortTempList].reverse() : sortTempList;
      console.log(result)
      setPriorityList(result)
    }

    useEffect(() => {
      createPriorityList()
    }, [todoList])

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
          <div className={`cardPriority ${getPriorityClass(todo.priority)}`} onClick={()=>handleTodoInfo(todo)}>
            <div className="contentPriority">
              <p className="heading">{handlePriorityEmoji(todo.priority)}</p>
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
          <div className={`cardPriority ${getPriorityClass(todo.priority)}`} onClick={()=>handleTodoInfo(todo)} >
            <div className="contentPriority">
              <p className="heading">{handlePriorityEmoji(todo.priority)}</p>
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

  const Modal = () => {
    return (
      <div className='modal'>
        <div className='smallTitle'>现在处理的是：{tempTodo.name}</div>
        <div className="infoCard">  
          <div className="bg">此处是对该事项的简单说明（待开发）</div>
          <div className={`blob ${getPriorityClass(tempPriority)}`}></div>
        </div>
        <button className='newTodoBtn'>修改事项说明</button>
        <div className='infoPriorityBox'>
          <div className="infoPContainer">
            <div className="palette">
              <div className="color" onClick={()=>handlePriorityClick(1)}><span>不着急😎</span></div>
              <div className="color" onClick={()=>handlePriorityClick(2)}><span>一般般😀</span></div>
              <div className="color" onClick={()=>handlePriorityClick(3)}><span>要留意😐</span></div>
              <div className="color" onClick={()=>handlePriorityClick(4)}><span>有点急😠</span></div>
              <div className="color" onClick={()=>handlePriorityClick(5)}><span>很着急😡</span></div>
            </div>
            <div id="stats">
              <p className='infoGspan'>点击调色板修改优先级</p>
            </div>
          </div>
          <div>现在该事项的优先级➡</div>
          <div className={`cardPriority ${getPriorityClass(tempPriority)}`} >
            <div className="contentPriority">
              <p className="heading">{handlePriorityEmoji(tempPriority)}</p>
            </div>
          </div>
        </div>
        {/* <p>修改优先级 输入数字0-9</p>
        <input type="text" className='priorityInput' value={tempPriority} onChange={handlePriorityInput}/> */}
        <div className='buttonBox'>
          <button className='newTodoBtn' onClick={hanlePriorityChange}>确认修改</button>
          <button className='newTodoBtn' onClick={handleModalCancel}>取消</button>
        </div>

      </div>
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
      </div>
      <div className='btnContainer'>
      <div className="cards">
        <div className={`card ${activeButton === 1 ? 'activeBtn' : 'lightblue'}`} onClick={()=>handleClick(1)}>
            <p className="tip">简洁排序</p>
        </div>
        <div className={`card ${activeButton === 2 ? 'activeBtn' : 'lightblue'}`} onClick={()=>handleClick(2)}>
            <p className="tip">按时间排序</p>
        </div>
        <div className={`card ${activeButton === 3 ? 'activeBtn' : 'lightblue'}`} onClick={()=>handleClick(3)}>
            <p className="tip">按优先级排序</p>
        </div>
        <div className={`card ${activeButton === 4 ? 'activeBtn' : 'lightblue'}`} onClick={()=>handleClick(4)}>
            <p className="tip">未完成的事项</p>
        </div>
        <div className={`card ${activeButton === 5 ? 'activeBtn' : 'lightblue'}`} onClick={()=>handleClick(5)}>
            <p className="tip">已完成的事项</p>
        </div>
        {[2, 3].includes(selectedButton) && (
        <div className={`card lightblue`} onClick={()=>setRevres(!revrese)}>
            <p className="tip">倒序显示</p>
        </div>
        )}
        </div>
      </div>

      {showModal && (
          <Modal />
      )}

      {selectedButton === 3 && (
        <div className="infoPContainer infoHeight">
          <div className="palette">
            <div className="color"><span>不着急😎</span></div>
            <div className="color"><span>一般般😀</span></div>
            <div className="color"><span>要留意😐</span></div>
            <div className="color"><span>有点急😠</span></div>
            <div className="color"><span>很着急😡</span></div>
          </div>
          <div id="stats">
            <p className='infoGspan'>通过调色板了解优先级</p>
          </div>
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

      {/* <div className='line'></div> */}
      <div className='buttomBar'>
        <div className="containerContact">
          <span className="hover-me">联系我📧: ChenStyle2022@outlook.com</span>
          <div className="tooltip">
            <p>Heyy👋</p>
          </div>
        </div>
        <button className="buttonGithub" onClick={() => window.open('https://github.com/CHEN-Style/TodoList', '_blank', 'noopener,noreferrer')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0.296997C5.37 0.296997 0 5.67 0 12.297C0 17.6 3.438 22.097 8.205 23.682C8.805 23.795 9.025 23.424 9.025 23.105C9.025 22.82 9.015 22.065 9.01 21.065C5.672 21.789 4.968 19.455 4.968 19.455C4.422 18.07 3.633 17.7 3.633 17.7C2.546 16.956 3.717 16.971 3.717 16.971C4.922 17.055 5.555 18.207 5.555 18.207C6.625 20.042 8.364 19.512 9.05 19.205C9.158 18.429 9.467 17.9 9.81 17.6C7.145 17.3 4.344 16.268 4.344 11.67C4.344 10.36 4.809 9.29 5.579 8.45C5.444 8.147 5.039 6.927 5.684 5.274C5.684 5.274 6.689 4.952 8.984 6.504C9.944 6.237 10.964 6.105 11.984 6.099C13.004 6.105 14.024 6.237 14.984 6.504C17.264 4.952 18.269 5.274 18.269 5.274C18.914 6.927 18.509 8.147 18.389 8.45C19.154 9.29 19.619 10.36 19.619 11.67C19.619 16.28 16.814 17.295 14.144 17.59C14.564 17.95 14.954 18.686 14.954 19.81C14.954 21.416 14.939 22.706 14.939 23.096C14.939 23.411 15.149 23.786 15.764 23.666C20.565 22.092 24 17.592 24 12.297C24 5.67 18.627 0.296997 12 0.296997Z" fill="white"></path>
          </svg>
          <p className="textGithub">在 Github 上查看此项目代码</p>
        </button>
      </div>

    </>
  )
}

export default App
