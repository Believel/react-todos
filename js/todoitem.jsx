import React from 'react'
import classNames from 'classnames'
class TodoItem extends React.Component{
  constructor(){
    super()
    this.state = {
      editing:false,  // 编辑状态
      tmpData:''//临时任务名
    }
  }
  componentDidMount(){
    this.state.tmpData = this.props.todo.name;//给临时任务名赋值
  }
  componentDidUpdate(){
    // 这在里调用 ，是为了保证，当前dom元素已经显示出来
      this.refs.myEdit.focus()
  }
  render(){
    return(
    <li className={classNames({
      completed:this.props.todo.completed,
      editing:this.state.editing})}>
      <div className="view">
        <input 
              className="toggle"
              type="checkbox" 
              checked={this.props.todo.completed}
              onChange={this.props.toggleState}
              />
        <label onDoubleClick={this.handleEdit.bind(this)}>{this.props.todo.name}</label>
        <button className="destroy" onClick={this.props.delete}></button>
      </div>
      <input 
      className="edit" 
      value={this.state.tmpData}
      onChange={this.handleChange.bind(this)} 
      ref="myEdit"
      onKeyDown={this.handleKeyDown.bind(this)}
      onBlur={this.handleBlur.bind(this)}/>
    </li>
      )
  }
  //修改任务名
  handleEdit(){
    this.setState({
      editing:true,
      //每次双击时重新给任务名赋值
      tmpData:this.props.todo.name
    })
  }
  handleChange(event){
    // 由于我们要做，取消操作，就不直接把数据保存起来了
    // 我们临时存储数据，当按下回车时再保存数据
      this.state.tmpData = event.target.value
      this.setState({})
  }
  handleKeyDown(event){
    switch(event.keyCode){
      case 13://enter
      //隐藏文本框
      this.setState({editing:false})
      //更新数据
      this.props.todo.name = this.state.tmpData
      this.props.edit();
      break;
      case 27://esc
      //隐藏文本框
      this.setState({editing:false})
      break;

    }
  }
  //失去焦点
  handleBlur(){
    //隐藏文本框
      this.setState({
        editing:false
      })
    //保存数据
    this.props.todo.name = this.state.tmpData
    this.props.edit()
  }
}
// 导出组件
export default TodoItem
