App = React.createClass({
  mixins: [ReactMeteorData],

  getInitialState() {
    return {
      hideCompleted: false
    }
  },

  toggleHideCompleted() {
    this.setState({
      hideCompleted: ! this.state.hideCompleted
    });
  },

  getMeteorData() {
    let query = {};
    if (this.state.hideCompleted) {
      query = {checked: {$ne: true}}
    }

    return {
      tasks: Tasks.find(query, {sort: {createdAt: -1}}).fetch(),
      incompleteCount: Tasks.find({checked: {$ne: true}}).count()
    }
  },

  renderTasks() {
    return this.data.tasks.map((task) => {
      return <Task key={task._id} task={task} />;
    });
  },

  handleSubmit(event) {
    event.preventDefault();
    var textNode = React.findDOMNode(this.refs.textInput),
        text = textNode.value.trim();
    Tasks.insert({
      text: text,
      createdAt: new Date()
    });

    textNode.value = "";
  },

  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List ({this.data.incompleteCount})</h1>

          <label className="hide-hide-completed">
            <input type="checkbox" readOnly={true}
                   checked={this.state.hideCompleted}
                   onClick={this.toggleHideCompleted}/>
          </label>
        </header>

        <form className="new-task" onSubmit={this.handleSubmit}>
          <input type="text" ref="textInput" placeholder="Type to add new tasks" />
        </form>
        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
});

