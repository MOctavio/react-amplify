import './App.css';

import React, { Component } from 'react';
import logo from './logo.svg';

import { withAuthenticator } from 'aws-amplify-react';
import { API, graphqlOperation } from 'aws-amplify';

const ListTodos = `
  query list {
    listTodos {
      items {
        id name description completed
      }
    }
  }`;

class App extends Component {
  state = { todos: [] };
  async componentDidMount() {
    const todoData = await API.graphql(graphqlOperation(ListTodos));
    this.setState({ todos: todoData.data.listTodos.items});
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2>Yet another ToDo app</h2>
          <img src={logo} className="App-logo" alt="logo" />
          {
            this.state.todos.map(({ name, description }) => (
              <div>
                <h3>{name}</h3>
                <h4>{description}</h4>
              </div>
            ))
          }
        </header>
      </div>
    );
  }
}

export default withAuthenticator(App, { includeGreetings: true });
