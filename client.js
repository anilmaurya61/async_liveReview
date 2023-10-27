const fetch = require("node-fetch");

async function fetchTodos(allUsers) {
  let pr1 = new Promise(async (resolve, reject) => {
    let allUserTodos = [];
    for (let i = 0; i < 5; i++) {
      let id = allUsers.users[i].id;
      let userName = allUsers.users[i].name;
      let usertodosdata = await fetch(`http://localhost:3000/todos?user_id=${id}`);
      const usertodos = await usertodosdata.json();
      allUserTodos.push({ 'id': id, 'name': userName, 'todos': usertodos.todos })
    }
    resolve(allUserTodos);
  });

  let pr2 = new Promise((resolve, reject) => {
    setTimeout(async () => {
      let allUserTodos = [];
      for (let i = 5; i < 10; i++) {
        let id = allUsers.users[i].id;
        let userName = allUsers.users[i].name;
        let usertodosdata = await fetch(`http://localhost:3000/todos?user_id=${id}`);
        const usertodos = await usertodosdata.json();
        allUserTodos.push({ 'id': id, 'name': userName, 'todos': usertodos.todos })
      }
      resolve(allUserTodos);
    }, 5);
  });

  let pr3 = new Promise((resolve, reject) => {
    setTimeout(async () => {
      let allUserTodos = [];
      for (let i = 10; i < 15; i++) {
        let id = allUsers.users[i].id;
        let userName = allUsers.users[i].name;
        let usertodosdata = await fetch(`http://localhost:3000/todos?user_id=${id}`);
        const usertodos = await usertodosdata.json();
        allUserTodos.push({ 'id': id, 'name': userName, 'todos': usertodos.todos })
      }
      resolve(allUserTodos);
    }, 2);
  });

  return Promise.all([pr1, pr2, pr3]);
}

async function main() {
  const response = await fetch("http://localhost:3000/users");
  const users = await response.json();

  const [p1, p2, p3] = await fetchTodos(users);
  let allTodos = [];
  allTodos.push(p1, p2, p3);
  allTodos = allTodos.flat();
  const results = [];
  allTodos.forEach((todo, index) => {
    const numTodosCompleted = todo.todos.filter(todo => todo.isCompleted).length;

    results.push({
      id: todo.id,
      name: todo.name,
      numTodosCompleted: numTodosCompleted,
    });
  });
  console.log(results);
}

main();