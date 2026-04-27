// Profile Page JavaScript

let currentUser = null;

document.addEventListener('DOMContentLoaded', function() {
    checkLogin();
    loadProfileData();
    setupEventListeners();
});

function checkLogin() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        alert('Profilni ko\'rish uchun iltimos, tizimga kiring!');
        window.location.href = 'index.html';
        return;
    }
    
    currentUser = JSON.parse(loggedInUser);
    updateProfileDisplay();
}

function updateProfileDisplay() {
    if (!currentUser) return;
    
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileEmail').textContent = currentUser.email;
    
    if (document.getElementById('editName')) {
        document.getElementById('editName').value = currentUser.name;
        document.getElementById('editEmail').value = currentUser.email;
        document.getElementById('editGender').value = currentUser.gender || 'male';
        document.getElementById('editHeight').value = currentUser.height || '';
        document.getElementById('editWeight').value = currentUser.weight || '';
    }
    
    updateDailyStats();
    loadSavedRecipes();
    loadFoodLog();
    loadMealHistory();
}

function setupEventListeners() {
    // Edit profile button
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            const modal = new bootstrap.Modal(document.getElementById('editProfileModal'));
            modal.show();
        });
    }
    
    // Edit profile form
    const editProfileForm = document.getElementById('editProfileForm');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProfileChanges();
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Add food form
    const addFoodForm = document.getElementById('addFoodForm');
    if (addFoodForm) {
        addFoodForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addFoodItem();
        });
    }
}

function saveProfileChanges() {
    if (!currentUser) return;
    
    const updates = {
        name: document.getElementById('editName').value,
        email: document.getElementById('editEmail').value,
        gender: document.getElementById('editGender').value,
        height: parseInt(document.getElementById('editHeight').value) || currentUser.height,
        weight: parseInt(document.getElementById('editWeight').value) || currentUser.weight
    };
    
    const newPassword = document.getElementById('editPassword').value;
    if (newPassword) {
        updates.password = newPassword;
    }
    
    if (Database.updateUser(currentUser.id, updates)) {
        currentUser = { ...currentUser, ...updates };
        localStorage.setItem('loggedInUser', JSON.stringify(currentUser));
        
        alert('Profil muvaffaqiyatli yangilandi!');
        const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
        modal.hide();
        updateProfileDisplay();
    }
}

function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
}

function updateDailyStats() {
    if (!currentUser) return;
    
    const todayFoods = Database.getUserFoodLog(currentUser.id);
    const consumedCalories = todayFoods.reduce((sum, food) => sum + food.calories, 0);
    const remainingCalories = currentUser.dailyCalorieGoal - consumedCalories;
    const percentage = (consumedCalories / currentUser.dailyCalorieGoal) * 100;
    
    document.getElementById('dailyCalories').textContent = remainingCalories;
    document.getElementById('totalCalories').textContent = currentUser.dailyCalorieGoal;
    document.getElementById('consumedCalories').textContent = consumedCalories;
    document.getElementById('goalCalories').textContent = currentUser.dailyCalorieGoal;
    
    const progressBar = document.getElementById('calorieProgress');
    progressBar.style.width = `${Math.min(percentage, 100)}%`;
    progressBar.textContent = `${Math.round(percentage)}%`;
    
    if (percentage > 100) {
        progressBar.classList.remove('bg-success');
        progressBar.classList.add('bg-danger');
    } else if (percentage > 80) {
        progressBar.classList.remove('bg-success');
        progressBar.classList.add('bg-warning');
    } else {
        progressBar.classList.remove('bg-warning', 'bg-danger');
        progressBar.classList.add('bg-success');
    }
}

function loadSavedRecipes() {
    const container = document.getElementById('profileSavedRecipes');
    if (!container) return;
    
    container.innerHTML = '';
    
    const savedRecipes = Database.getUserSavedRecipes(currentUser.id);
    
    if (savedRecipes.length === 0) {
        container.innerHTML = '<div class="col-12 text-center"><p>Hozircha saqlangan retseptlar yo\'q</p></div>';
        return;
    }
    
    savedRecipes.forEach(recipe => {
        const col = document.createElement('div');
        col.className = 'col-md-6 mb-3';
        col.innerHTML = `
            <div class="card">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${recipe.image}" class="img-fluid rounded-start" alt="${recipe.name}" style="height: 100%; object-fit: cover;">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h6 class="card-title">${recipe.name}</h6>
                            <p class="card-text"><small>${recipe.calories} kcal</small></p>
                            <button class="btn btn-danger btn-sm remove-saved-btn" data-id="${recipe.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-saved-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const recipeId = parseInt(this.dataset.id);
            removeSavedRecipe(recipeId);
        });
    });
}

function removeSavedRecipe(recipeId) {
    if (!currentUser) return;
    
    if (Database.removeSavedRecipe(currentUser.id, recipeId)) {
        alert('Retsept saqlanganlardan o\'chirildi');
        loadSavedRecipes();
        updateDailyStats();
    }
}

function loadFoodLog() {
    const tbody = document.getElementById('foodLog');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const todayFoods = Database.getUserFoodLog(currentUser.id);
    
    todayFoods.forEach(food => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${food.name}</td>
            <td>${food.calories} kcal</td>
            <td>${food.time}</td>
            <td>
                <button class="btn btn-danger btn-sm remove-food-btn" data-id="${food.id}">
                    <i class="fas fa-times"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-food-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const foodId = parseInt(this.dataset.id);
            removeFoodItem(foodId);
        });
    });
}

function addFoodItem() {
    if (!currentUser) return;
    
    const name = document.getElementById('foodName').value;
    const calories = parseInt(document.getElementById('foodCalories').value);
    
    if (!name || !calories) {
        alert('Iltimos, barcha maydonlarni to\'ldiring!');
        return;
    }
    
    Database.addFoodToLog(currentUser.id, { name, calories });
    document.getElementById('addFoodForm').reset();
    
    updateDailyStats();
    loadFoodLog();
    loadMealHistory();
}

function removeFoodItem(foodId) {
    if (!currentUser) return;
    
    if (Database.removeFoodFromLog(foodId)) {
        updateDailyStats();
        loadFoodLog();
        loadMealHistory();
    }
}

function loadMealHistory() {
    const tbody = document.getElementById('mealHistory');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // Get last 7 days of food log
    const last7Days = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        last7Days.push(dateStr);
    }
    
    last7Days.forEach(date => {
        const dayFoods = Database.foodLog.filter(f => 
            f.userId === currentUser.id && f.date.startsWith(date)
        );
        
        if (dayFoods.length > 0) {
            const totalCalories = dayFoods.reduce((sum, food) => sum + food.calories, 0);
            const status = totalCalories <= currentUser.dailyCalorieGoal ? 
                '<span class="badge bg-success">Yaxshi</span>' : 
                '<span class="badge bg-danger">Ko\'p</span>';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${date}</td>
                <td>${dayFoods.length}</td>
                <td>${totalCalories} kcal</td>
                <td>${status}</td>
            `;
            tbody.appendChild(row);
        }
    });
}

function loadProfileData() {
    // This function loads all profile data
    updateProfileDisplay();
}