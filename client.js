const fetch = require('node-fetch');

async function fetchUsers() {
  const response = await fetch("http://localhost:3000/users");
  const users = await response.json();
  return users.users;
}

async function fetchTodos(users) {
  const response = await fetch(`http://localhost:3000/todos?user_id=${users.id}`)
  const todos = await response.json();
  return {'id': users.id, 'name':users.name,'todos':todos.todos};
}

async function fetchTodosForUsers(users) {
  const userChunks = chunkArray(users, 5);

  let allTodos = [];

  for (const chunk of userChunks) {
    const todoPromises = chunk.map((user) => fetchTodos(user));
    const chunkTodos = await Promise.all(todoPromises);

    allTodos = allTodos.concat(chunkTodos);

    if (chunk !== userChunks[userChunks.length - 1]) {
      await sleep(1000);
    }
  }

  return allTodos;
}

function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const users = await fetchUsers();

  const allTodos = await fetchTodosForUsers(users);
  console.log(allTodos);
 const results = allTodos.map((todo) => ({
    id: todo.id,
    name: todo.name,
    numTodosCompleted: todo.todos.filter((todo) => todo.isCompleted).length,
  }));

  console.log(results);
}

main();
