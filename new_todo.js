document.addEventListener('DOMContentLoaded', () => {
    let selectedUserId;

    // Populate user dropdown
    fetch('http://localhost:8083/api/users')
        .then(response => response.json())
        .then(users => {
            const userList = document.getElementById('userList');
            users.forEach(user => {
                const listItem = document.createElement('li');
                listItem.classList.add('dropdown-item');
                listItem.textContent = user.name;
                listItem.dataset.userId = user.id; 
                listItem.addEventListener('click', () => {
                    selectedUserId = user.id; 
                    document.getElementById('selectedUserName').textContent = user.name;
                    fetchTodos(user.id);
                    populateCategories(); // Populate categories when user changes
                });
                userList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error fetching users:', error);
        });

    // Populate categories dropdown
    function populateCategories() {
        const categorySelect = document.getElementById('categorySelect');
        categorySelect.innerHTML = ''; 
        fetch('http://localhost:8083/api/categories')
            .then(response => response.json())
            .then(categories => {
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.name;
                    option.textContent = category.name;
                    categorySelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }

    // Handle form submission
    document.getElementById('todoForm').addEventListener('submit', (event) => {
        event.preventDefault();

        const userId = selectedUserId; 
        const category = document.getElementById('categorySelect').value;
        const description = document.getElementById('descriptionInput').value;
        const deadline = document.getElementById('deadlineInput').value;
        const priority = document.getElementById('prioritySelect').value;

        
        if (!userId || !category || !description || !deadline || !priority) {
            console.error('One or more todo properties missing');
            return;
        }

        // Prepare todo data
        const todoData = {
            userid: userId,
            category: category,
            description: description,
            deadline: deadline,
            priority: priority
        };

        // Send POST request
        fetch('http://localhost:8083/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todoData)
        })
        .then(response => response.json())
        .then(newTodo => {
            if (newTodo) {
                console.log('ToDo added successfully');
                fetchTodos(userId);
            } else {
                console.error('Failed to add ToDo');
            }
        })
        .catch(error => {
            console.error('Error adding ToDo:', error);
        });
    });

    // Function to fetch and display todos
    function fetchTodos(userId) {
        fetch(`http://localhost:8083/api/todos`)
            .then(response => response.json())
            .then(todos => {
                const todoContainer = document.getElementById('todoContainer');
                todoContainer.innerHTML = ''; // Clear previous todos

                const filteredTodos = todos.filter(todo => todo.userid === userId); // Filter todos by user ID

                filteredTodos.forEach(todo => {
                    appendTodoToDOM(todo);
                });
            })
            .catch(error => {
                console.error('Error fetching todos:', error);
            });
    }

    function appendTodoToDOM(todo) {
        const todoContainer = document.getElementById('todoContainer');

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
        cardDeadline.innerHTML = `<small class="text-muted">Deadline: ${todo.deadline}</small>`;

        const cardPriority = document.createElement('p');
        cardPriority.classList.add('card-text');
        cardPriority.innerHTML = `<small class="text-muted">Priority: ${todo.priority}</small>`;

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(cardDeadline);
        cardBody.appendChild(cardPriority);

        card.appendChild(cardBody);
        todoContainer.appendChild(card);
    }
});
