// Admin Panel JavaScript

let adminLoggedIn = false;

document.addEventListener('DOMContentLoaded', function() {
    checkAdminLogin();
    setupAdminEventListeners();
});

function checkAdminLogin() {
    const loggedIn = localStorage.getItem('adminLoggedIn');
    if (loggedIn === 'true') {
        adminLoggedIn = true;
        showAdminDashboard();
        loadAdminData();
    } else {
        showLoginModal();
    }
}

function showLoginModal() {
    const modal = new bootstrap.Modal(document.getElementById('adminLoginModal'));
    modal.show();
}

function showAdminDashboard() {
    document.getElementById('adminLoginModal').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
}

function setupAdminEventListeners() {
    // Admin login form
    const loginForm = document.getElementById('adminLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('adminUsername').value;
            const password = document.getElementById('adminPassword').value;
            
            if (username === Database.adminCredentials.username && 
                password === Database.adminCredentials.password) {
                adminLoggedIn = true;
                localStorage.setItem('adminLoggedIn', 'true');
                showAdminDashboard();
                loadAdminData();
                const modal = bootstrap.Modal.getInstance(document.getElementById('adminLoginModal'));
                modal.hide();
            } else {
                alert('Login yoki parol noto\'g\'ri!');
            }
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutAdmin');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            adminLoggedIn = false;
            localStorage.removeItem('adminLoggedIn');
            location.reload();
        });
    }
    
    // Add recipe form
    const addRecipeForm = document.getElementById('addRecipeForm');
    if (addRecipeForm) {
        addRecipeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addNewRecipe();
        });
    }
    
    // Add category form
    const addCategoryForm = document.getElementById('addCategoryForm');
    if (addCategoryForm) {
        addCategoryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addNewCategory();
        });
    }
    
    // Edit recipe form
    const editRecipeForm = document.getElementById('editRecipeForm');
    if (editRecipeForm) {
        editRecipeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateRecipe();
        });
    }
    
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const sectionId = this.getAttribute('href').substring(1);
                showSection(sectionId);
            }
        });
    });
}

function loadAdminData() {
    loadRecipesList();
    loadUsersList();
    loadCategoriesList();
}

function loadRecipesList() {
    const tbody = document.getElementById('adminRecipesList');
    tbody.innerHTML = '';
    
    Database.recipes.forEach((recipe, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${recipe.name}</td>
            <td>${recipe.category}</td>
            <td>${recipe.calories} kcal</td>
            <td>
                <button class="btn btn-sm btn-warning me-2 edit-recipe-btn" data-id="${recipe.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-recipe-btn" data-id="${recipe.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.edit-recipe-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const recipeId = parseInt(this.dataset.id);
            editRecipe(recipeId);
        });
    });
    
    document.querySelectorAll('.delete-recipe-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const recipeId = parseInt(this.dataset.id);
            deleteRecipe(recipeId);
        });
    });
}

function loadUsersList() {
    const tbody = document.getElementById('usersList');
    tbody.innerHTML = '';
    
    Database.users.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.joinedDate}</td>
            <td>
                <button class="btn btn-sm btn-info">Ko'rish</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function loadCategoriesList() {
    const ul = document.getElementById('categoriesList');
    ul.innerHTML = '';
    
    Database.categories.forEach(category => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            ${category.name}
            <span class="badge bg-primary rounded-pill">${Database.getRecipesByCategory(category.name).length}</span>
        `;
        ul.appendChild(li);
    });
}

function addNewRecipe() {
    const recipe = {
        name: document.getElementById('recipeName').value,
        category: document.getElementById('recipeCategory').value,
        description: document.getElementById('recipeDescription').value,
        calories: parseInt(document.getElementById('recipeCalories').value),
        time: parseInt(document.getElementById('recipeTime').value),
        difficulty: document.getElementById('recipeDifficulty').value,
        ingredients: document.getElementById('recipeIngredients').value.split('\n').map(i => i.trim()),
        instructions: document.getElementById('recipeInstructions').value,
        image: document.getElementById('recipeImage').value
    };
    
    Database.addRecipe(recipe);
    alert('Retsept muvaffaqiyatli qo\'shildi!');
    document.getElementById('addRecipeForm').reset();
    loadRecipesList();
}

function editRecipe(recipeId) {
    const recipe = Database.recipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    // Fill form
    document.getElementById('editRecipeId').value = recipe.id;
    document.getElementById('editRecipeName').value = recipe.name;
    document.getElementById('editRecipeCategory').value = recipe.category;
    document.getElementById('editRecipeDescription').value = recipe.description;
    document.getElementById('editRecipeCalories').value = recipe.calories;
    document.getElementById('editRecipeTime').value = recipe.time;
    document.getElementById('editRecipeDifficulty').value = recipe.difficulty;
    document.getElementById('editRecipeIngredients').value = recipe.ingredients.join('\n');
    document.getElementById('editRecipeInstructions').value = recipe.instructions;
    document.getElementById('editRecipeImage').value = recipe.image;
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('editRecipeModal'));
    modal.show();
}

function updateRecipe() {
    const recipeId = parseInt(document.getElementById('editRecipeId').value);
    
    const updates = {
        name: document.getElementById('editRecipeName').value,
        category: document.getElementById('editRecipeCategory').value,
        description: document.getElementById('editRecipeDescription').value,
        calories: parseInt(document.getElementById('editRecipeCalories').value),
        time: parseInt(document.getElementById('editRecipeTime').value),
        difficulty: document.getElementById('editRecipeDifficulty').value,
        ingredients: document.getElementById('editRecipeIngredients').value.split('\n').map(i => i.trim()),
        instructions: document.getElementById('editRecipeInstructions').value,
        image: document.getElementById('editRecipeImage').value
    };
    
    if (Database.updateRecipe(recipeId, updates)) {
        alert('Retsept muvaffaqiyatli yangilandi!');
        const modal = bootstrap.Modal.getInstance(document.getElementById('editRecipeModal'));
        modal.hide();
        loadRecipesList();
    }
}

function deleteRecipe(recipeId) {
    if (confirm('Bu retseptni o\'chirishni istaysizmi?')) {
        if (Database.deleteRecipe(recipeId)) {
            alert('Retsept o\'chirildi!');
            loadRecipesList();
        }
    }
}

function addNewCategory() {
    const name = document.getElementById('categoryName').value;
    const description = document.getElementById('categoryDescription').value;
    
    const category = {
        id: Database.categories.length + 1,
        name: name.toLowerCase(),
        description: description
    };
    
    Database.categories.push(category);
    Database.saveAll();
    
    alert('Kategoriya muvaffaqiyatli qo\'shildi!');
    document.getElementById('addCategoryForm').reset();
    loadCategoriesList();
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).style.display = 'block';
    
    // Add active class to clicked nav link
    document.querySelector(`a[href="#${sectionId}"]`).classList.add('active');
}