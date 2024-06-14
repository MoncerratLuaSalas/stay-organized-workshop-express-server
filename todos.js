document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:8083/api/users')
      .then(response => response.json())
      .then(users => {
          const userList = document.getElementById('userList');
          users.forEach(user => {
              const listItem = document.createElement('li');
              listItem.classList.add('dropdown-item');
              listItem.textContent = user.name;
              listItem.dataset.userId = user.id;  // Store user ID in data attribute
              listItem.addEventListener('click', () => fetchTodos(user.id));
              userList.appendChild(listItem);
          });
      })
      .catch(error => {
          console.error('Error fetching users:', error);
      });
});

function fetchTodos(userId) {
  fetch('http://localhost:8083/api/todos')
      .then(response => response.json())
      .then(todos => {
          const todoContainer = document.getElementById('todoContainer');
          todoContainer.innerHTML = ''; // Clear previous todos

          // Filter todos for the selected user
          const userTodos = todos.filter(todo => todo.userid === userId);

          userTodos.forEach(todo => {
              const card = document.createElement('div');
              card.classList.add('card', 'mb-3');

              const cardBody = document.createElement('div');
              cardBody.classList.add('card-body');

              const cardTitle = document.createElement('h5');
              cardTitle.classList.add('card-title');
              cardTitle.textContent = todo.category;

              const cardText = document.createElement('p');
              cardText.classList.add('card-text');
              cardText.textContent = todo.description;

              const cardDeadline = document.createElement('p');
              cardDeadline.classList.add('card-text');
              cardDeadline.innerHTML = `<small class="text-muted">Deadline: ${formatDate(todo.deadline)}</small>`;

              const cardPriority = document.createElement('p');
              cardPriority.classList.add('card-text');
              cardPriority.innerHTML = `<small class="text-muted">Priority: ${todo.priority}</small>`;

              cardBody.appendChild(cardTitle);
              cardBody.appendChild(cardText);
              cardBody.appendChild(cardDeadline);
              cardBody.appendChild(cardPriority);

              card.appendChild(cardBody);
              todoContainer.appendChild(card);
          });
      })
      .catch(error => {
          console.error('Error fetching todos:', error);
      });
}

// Function to format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
