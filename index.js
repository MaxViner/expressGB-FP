const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

// Получение списка всех пользователей
app.get('/users', (req, res) => {
  fs.readFile('users.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server Error');
    } else {
      const users = JSON.parse(data);
      res.json(users);
    }
  });
});

app.post('/users', (req, res) => {
  const formData = req.body;
  console.log('formData');

  console.log(formData);
  console.log(req.body);
  let newUser = {
      id: Date.now(), 
      name: formData.name,
      email: formData.email,
      age: formData.age
  };

  fs.readFile('users.json', 'utf8', (err, data) => {
      if (err) {
          console.error(err);
          res.status(500).send('Server Error');
      } else {
          const users = JSON.parse(data);
          users.push(newUser);

          fs.writeFile('users.json', JSON.stringify(users), (err) => {
              if (err) {
                  console.error(err);
                  res.status(500).send('Server Error');
              } else {
                  res.status(201).send('User created');
              }
          });
      }
  });
});
  app.get('/', (req, res) => {
    res.send(`
      <h1>Create User</h1>
      <form id="userForm" method="POST" action="/users">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required><br><br>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required><br><br>
        <label for="age">Age:</label>
        <input type="number" id="age" name="age" required><br><br>
        <button type="submit">Save User</button>
      </form>
      <h1>Users List</h1>
      <ul id="usersContainer"></ul>
   
      <script>
        document.addEventListener('DOMContentLoaded', async function() {
          const response = await fetch('/users');
          if (response.ok) {
            const users = await response.json();
            const usersContainer = document.getElementById('usersContainer');
            console.log(users);
            users && users.map(user => {
              let ListItem = document.createElement('li')
              ListItem.className = 'user-card'
              let userPara = document.createElement('h3');
              userPara.className = 'user-name';
              userPara.textContent = user.name;
              let userEmai = document.createElement('p');
              userEmai.className = 'user-email';
              userEmai.textContent = user.email;
              ListItem.appendChild(userPara);
              ListItem.appendChild(userEmai);
              usersContainer.appendChild(ListItem);

            });
          } else {
            console.error('Failed to fetch users data');
          }
        });
      </script>
   

      <style>
        .user-card {
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 10px;
            margin: 10px;
            background-color: #f9f9f9;
        }
        .user-name{
          font-size:24px
        }
        .user-email {
            color: #333;
        }
        .user-age {
            color: #666;
        }
      </style>
     

      <script>
      const form = document.getElementById("userForm");
      form.addEventListener("submit", async (event) => {
        event.preventDefault(); 
      
        const formData = new FormData(form);
        const formDataObject = {};
        formData.forEach((value, key) => {
          formDataObject[key] = value;
        });
      
        const requestData = JSON.stringify(formDataObject);
      
        const response = await fetch(form.action, {
          method: form.method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: requestData
        });
      
        if (response.ok) {
          alert("Пользователь успешно сохранен");
          form.reset(); 
          const userListResponse = await fetch('/users');
          const userList = await userListResponse.json();
          
          } else {
          alert("Ошибка сохранения пользователя");
        }
      });
      </script>
     

    `);
  });
// Получение данных о конкретном пользователе
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  fs.readFile('users.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server Error');
    } else {
      const users = JSON.parse(data);
      const user = users.find((u) => u.id === userId);
      if (user) {
        res.json(user);
      } else {
        res.status(404).send('User not found');
      }
    }
  });
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});