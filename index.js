import express from 'express';

const app = express();

const DB = {
  users: [...new Array(10000)].map((item, index) => ({
    id: `${index + 1}`,
    isMale: Math.random() > 0.44,
    firstName: `Name #${index + 1}`,
    lastName: `Surname #${index + 1}`,
    email: `test${index + 1}@gmail.com`,
    age: Math.ceil(Math.random() * 100),
  })),
};

// auto deserialize JSON-body
app.use(express.json());

// create one
app.post('/users', (req, res) => {
  const { body } = req;
  const newUser = {
    ...body,
    id: `${DB.users.length + 1}`,
  };
  DB.users.push(newUser);

  res.status(201).send(newUser);
});
// get many
app.get('/users', (req, res) => {
  const {
    query: {
      page,
      pageSize,
    },
  } = req;
  /**
   * 1. Filter
   * 2. Sort
   * 3. Pagination
   */
  const pageNumber = Number(page) || 1;
  const pageSizeNumber = Number(pageSize) || 30;
  const startIndex = pageSizeNumber * (pageNumber - 1);
  const endIndex = pageSizeNumber * pageNumber;
  const result = DB.users.slice(startIndex, endIndex);

  res.send({
    total: DB.users.length,
    data: result,
  });
});
// get one
app.get('/users/:userId', (req, res) => {
  const { params: { userId } } = req;
  const user = DB.users.find((user) => user.id === userId);
  if (user) {
    res.send(user);
    return;
  }
  res.status(404).end();
});
// update one
app.patch('/users/:userId', (req, res) => {
  const {
    body, params: {
      userId,
    },
  } = req;
  const userIndex = DB.users.findIndex((user) => user.id === userId);
  if (userIndex !== -1) {
    const user = DB.users[userIndex];
    const updatedUser = {
      ...user,
      ...body,
    };
    DB.users[userIndex] = updatedUser;
    res.send(updatedUser);
    return;
  }
  res.status(404).end();
});
// delete one
app.delete('/users/:userId', (req, res) => {
  const {
    params: {
      userId,
    },
  } = req;
  const userIndex = DB.users.findIndex((user) => user.id === userId);
  if (userIndex !== -1) {
    const [deletedUser] = DB.users.splice(userIndex, 1);
    res.send(deletedUser);
    return;
  }
  res.status(404).end();
});

app.listen(8080, () => console.log(`Server listening "http://localhost:8080".`));
