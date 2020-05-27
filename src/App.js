import * as mutations from './graphql/mutations';
import * as queries from './graphql/queries';

import { API, graphqlOperation } from 'aws-amplify';
import { makeStyles } from '@material-ui/core/styles';
import { withAuthenticator } from 'aws-amplify-react';

import React from 'react';

import AddBoxIcon from '@material-ui/icons/AddBox';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(() => ({
  card: {
    marginTop: 20,
    height: 220,
    width: 300,
  }
}));

const NewTodo = ({ handleCreate }) => {
  const initialState = { name: '', description: '', completed: false };
  const classes = useStyles();
  const [todo, setTodo] = React.useState(initialState);
  
  const handleInputChange = ({target}) => {
    const value = target.value;
    const name = target.name;
    
    setTodo({
      ...todo,
      [name]: value
    });
  }

  const handleClick = () => {
    setTodo(initialState);
    handleCreate(todo);
  }

  return (
    <Grid item xs={4}>
      <Grid container justify="center">
        <Grid item>
          <Card variant="outlined" className={classes.card}>
            <CardContent>
              <Typography variant="h6">
                New Task
              </Typography>
              <form noValidate autoComplete="off">
                <TextField
                  fullWidth
                  label="Task"
                  name="name"
                  onChange={handleInputChange}
                  value={todo.name}
                />
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  onChange={handleInputChange}
                  value={todo.description}
                />
              </form>
            </CardContent>
            <CardActions>
            <IconButton
              aria-label="add todo"
              color="primary"
              component="span"
              onClick={handleClick}
            >
              <AddBoxIcon />
            </IconButton>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Grid> 
  );
}

const Todo = ({ items, handleChange, handleDelete }) => {
  const classes = useStyles();

  return (
    <Grid item xs={8}>
      <Grid container spacing={3}>
        {Array.isArray(items) && items.map(({ id, name, description, completed }, i) => (
          <Grid key={i} item>
            <Card variant="outlined" className={classes.card}>
              <CardContent>
                <Typography variant="h5">
                  Task: {name}
                </Typography>
                <Typography variant="h6">
                  {description}
                </Typography>
                <Typography color="textSecondary">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={completed}
                      color="primary"
                      name={id}
                      onChange={handleChange}
                    />
                  }
                  label="Completed"
                />
                </Typography>
              </CardContent>
              <CardActions>
              <IconButton
                aria-label="delete todo"
                color="primary"
                component="span"
                onClick={handleDelete}
              >
                <DeleteOutlinedIcon data-id={id} />
              </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid> 
  );
}

 const App = () => {
  const [todos, setTodos] = React.useState([]);
  React.useEffect(() => getTodos(), []);
  
  const getTodos = () => {
    API.graphql(graphqlOperation(queries.listTodos))
    .then(data => setTodos(data.data.listTodos.items))
  }
  
  const handleChange = (e) => {
    const todoDetails = {
      id: e.target.name,
      completed: e.target.checked
    };
    
    API.graphql(graphqlOperation(mutations.updateTodo, {input: todoDetails}, 'completed'))
    .then(todo => setTodos(todos => {
       todos[todos.findIndex(({id}) => id === todoDetails.id)].completed = todo.data.updateTodo.completed;
       return [...todos];
    }));
  }
  
  const handleCreate = (todo) => {
    API.graphql(graphqlOperation(mutations.createTodo, {input: todo}, 'name', 'description'))
    .then(({data}) => setTodos(todos => {
      todos.push(data.createTodo)
      return [...todos];
    })); 
  }

  const handleDelete = (e) => {    
    const todoDetails = {
      id: e.target.dataset.id,
    };

    API.graphql(graphqlOperation(mutations.deleteTodo, {input: todoDetails}, 'id'))
    .then(() => setTodos(todos =>
       todos.filter(({id}) => id !== todoDetails.id)
    ));
  }

  return (
    <Grid container spacing={3} justify="center">
        <NewTodo handleCreate={handleCreate}/>
        <Todo items={todos} handleChange={handleChange} handleDelete={handleDelete} />
    </Grid>
  );
}

export default withAuthenticator(App, true);
