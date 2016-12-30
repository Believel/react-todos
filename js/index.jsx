//引入包
import React from 'react'
import ReactDOM from 'react-dom'
//引入组件
import TodoItem from './todoitem.jsx'
import Footer from './footer.jsx'
//定义组件TodoMVC
class TodoMVC extends React.Component{
  constructor() {
    super();
    this.state = {
      todos:[
      {id:1,name:'吃饭',completed:true},
      {id:2,name:'睡觉',completed:true},
      {id:3,name:'打豆豆',completed:true},
      {id:4,name:'学习',completed:false}
      ],
      newTodo:'',   // 添加任务名变量
      stateAll:false, //全选反选状态
      stateType:'all',//状态的数据类型 默认all 还有active complete 
      showClear:false //是否显示清除未完成的任务
    }
  }
  //在组件加载完成之后读取数据，只调用一次
  componentDidMount(){
    //根据hash值得变化，选择不同状态的数据类型 all  active completed
    window.addEventListener('hashchange',()=>{
      let tmp = location.hash.split('/')[1];
      this.setState({
        stateType:tmp
      })
    })
    let str = localStorage.getItem('todos') || '[]'
    this.setState({
      todos:JSON.parse(str)
    })
  }
  componentDidUpdate(){
     //每次调用了this.setState({})，之后就自动保存数据
    this.save()
  }
  render(){
    let nowTodos = this.state.todos.filter(item=>{
      switch (this.state.stateType) {
        case 'all':
          return true
        break;
        case 'active':
          return !item.completed
        break;
        case 'completed':
          return item.completed
        break;
        default:
           location.hash = '/all'
           return true
        break;
      }
    })
  
    //一进来就应该判断是否有全选的状态，若有有处理一下代码
    this.state.stateAll = !this.state.todos.some(item=>{
      if(!item.completed){
        return true//遇到了就返回true
      }
    })
    //显示未完成的任务数
    var count = this.state.todos.reduce((a,item)=>{
      if(!item.completed){
        return a+1;
      }else{
        return a;
      }
    },0)
     // 计算是否有已完成任务，用于判断是否显示删除按钮clear completed
     this.state.showClear = this.state.todos.some(item=>{
        return item.completed
     })
    return (
      <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <form onSubmit={this.handleSubmit.bind(this)}>
            <input 
            className="new-todo" 
            value={this.state.newTodo}
            onChange={this.handleAdd.bind(this)} 
            placeholder="What needs to be done?" />
        </form>
      </header>
      <section className="main">
        <input 
           className="toggle-all" 
           type="checkbox" 
           onClick={this.handleStateAll.bind(this)}
           checked={this.state.stateAll}/>
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul className="todo-list">
        {
          nowTodos.map(todo=>{
            return (<TodoItem 
              key={todo.id} 
              todo={todo}
              toggleState={this.toggleState.bind(this,todo)}
              edit = {this.edit.bind(this,todo)}
              delete={this.delete.bind(this,todo)}
              />)
          })
          
        }
        </ul>
      </section>
      <Footer
      count={count}
      clearCompleted = {this.clearCompleted.bind(this)}
      stateType={this.state.stateType}
      showClear={this.state.showClear} />
    </section>
      )
  }
// 添加数据
handleSubmit(event){
  event.preventDefault()
 if(this.state.newTodo){
   this.state.todos.unshift({
    id:Math.random(),
    name:this.state.newTodo,
    completed:false
  })
 }
  this.setState({})
  this.state.newTodo = ''
}
// 添加数据  实现双向
handleAdd(event){
  this.setState({
    newTodo:event.target.value
  })
}
//切换状态
toggleState(todo){
  todo.completed = !todo.completed
  this.setState({})
}
//编辑数据
edit(todo){
   // 只需要通知组件重新渲染,父组件更新，子组件跟着更新
  this.setState({})
}
//删除数据
delete(todo){
  var newTodos = this.state.todos.filter(item=>{
    if(todo.id==item.id){
      return false
    }else{
      return true
    }
  })
  this.setState({
    todos:newTodos
  })
}
//全选反选状态
handleStateAll(){
  var newTodos = this.state.todos.map(item=>{
      item.completed = !this.state.stateAll
      return item
  })
  this.state.stateAll = !this.state.stateAll
  this.setState({
    todos:newTodos
  })
}
//清除已经完成的任务
clearCompleted(){
  var newTodos = this.state.todos.filter(item=>{
      if(!item.completed){
        return true;
      }else{
        return false
      }
  })
  this.setState({
    todos:newTodos
  })
}
//数据保存在本地
save(){
  let str = JSON.stringify(this.state.todos)
  localStorage.setItem('todos',str)
}
}
// 渲染组件在DOM上
ReactDOM.render(
    <TodoMVC/>,
    document.getElementById('box')
)
