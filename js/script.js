// Main JavaScript for index.html

// Global variables
let currentUser = null;
let selectedImageFile = null;
let recipesToShow = 6; // Number of recipes to show initially
let allRecipes = [];

// DOM Elements
const authButton = document.getElementById('authButton');
const registerButton = document.getElementById('registerButton');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadRecipes();
    loadSavedRecipes();
    setupEventListeners();
    checkLoginStatus();
    setupImageUpload();
    updateCategoryCounts();
});

// Update category counts
function updateCategoryCounts() {
    const categories = ['taomlar', 'salatlar', 'ichimliklar', 'smuzilar'];
    categories.forEach(category => {
        const countElement = document.getElementById(`${category}-count`);
        if (countElement) {
            const count = Database.getRecipeCountByCategory(category);
            countElement.textContent = `${count} ta`;
        }
    });
}

// Load recipes
function loadRecipes() {
    const container = document.getElementById('recipe-container');
    container.innerHTML = '';
    
    allRecipes = Database.recipes;
    const recipesToDisplay = allRecipes.slice(0, recipesToShow);
    
    recipesToDisplay.forEach(recipe => {
        const isSaved = currentUser ? Database.isRecipeSaved(currentUser.id, recipe.id) : false;
        
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';
        card.innerHTML = `
            <div class="card h-100 recipe-card">
                <img src="${recipe.image}" class="card-img-top" alt="${recipe.name}" style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title mb-0">${recipe.name}</h5>
                        <button class="btn btn-sm ${isSaved ? 'btn-warning' : 'btn-outline-secondary'} save-recipe-btn" 
                                data-id="${recipe.id}" ${!currentUser ? 'disabled' : ''}>
                            <i class="fas ${isSaved ? 'fa-bookmark' : 'fa-bookmark'}"></i>
                        </button>
                    </div>
                    <div class="mb-2">
                        <span class="badge bg-secondary">${recipe.category}</span>
                    </div>
                    <p class="card-text text-muted small mb-3">${recipe.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="badge badge-calories">${recipe.calories} kcal</span>
                        <span class="badge badge-time">${recipe.time} min</span>
                        <span class="badge badge-difficulty">${recipe.difficulty}</span>
                    </div>
                    <button class="btn btn-outline-success btn-sm mt-3 w-100 view-recipe-btn" data-id="${recipe.id}">
                        <i class="fas fa-eye me-1"></i> Batafsil
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.save-recipe-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const recipeId = parseInt(this.dataset.id);
            toggleSaveRecipe(recipeId, this);
        });
    });
    
    document.querySelectorAll('.view-recipe-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const recipeId = parseInt(this.dataset.id);
            viewRecipeDetails(recipeId);
        });
    });
    
    // Update load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        if (recipesToShow >= allRecipes.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
            loadMoreBtn.innerHTML = `<i class="fas fa-plus me-2"></i>Yana ${Math.min(6, allRecipes.length - recipesToShow)} ta ko'rsatish`;
        }
    }
}

// Load more recipes
document.getElementById('loadMoreBtn')?.addEventListener('click', function() {
    recipesToShow += 6;
    loadRecipes();
});

// Filter recipes by category
function filterRecipes(category) {
    const container = document.getElementById('recipe-container');
    container.innerHTML = '';
    
    let filteredRecipes;
    if (category === 'all') {
        filteredRecipes = Database.recipes;
    } else {
        filteredRecipes = Database.recipes.filter(recipe => recipe.category === category);
    }
    
    filteredRecipes.forEach(recipe => {
        const isSaved = currentUser ? Database.isRecipeSaved(currentUser.id, recipe.id) : false;
        
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';
        card.innerHTML = `
            <div class="card h-100 recipe-card">
                <img src="${recipe.image}" class="card-img-top" alt="${recipe.name}" style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <h5 class="card-title">${recipe.name}</h5>
                        <button class="btn btn-sm ${isSaved ? 'btn-warning' : 'btn-outline-secondary'} save-recipe-btn" 
                                data-id="${recipe.id}" ${!currentUser ? 'disabled' : ''}>
                            <i class="fas ${isSaved ? 'fa-bookmark' : 'fa-bookmark'}"></i>
                        </button>
                    </div>
                    <p class="card-text">${recipe.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="badge bg-success">${recipe.calories} kcal</span>
                        <span class="badge bg-info">${recipe.time} min</span>
                        <span class="badge bg-warning">${recipe.difficulty}</span>
                    </div>
                    <button class="btn btn-outline-success btn-sm mt-3 view-recipe-btn" data-id="${recipe.id}">
                        <i class="fas fa-eye"></i> Batafsil
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
    
    // Re-add event listeners
    document.querySelectorAll('.save-recipe-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const recipeId = parseInt(this.dataset.id);
            toggleSaveRecipe(recipeId, this);
        });
    });
    
    document.querySelectorAll('.view-recipe-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const recipeId = parseInt(this.dataset.id);
            viewRecipeDetails(recipeId);
        });
    });
}

// Sort recipes
function sortRecipes(criteria) {
    let sortedRecipes = [...allRecipes];
    
    switch(criteria) {
        case 'calories':
            sortedRecipes.sort((a, b) => a.calories - b.calories);
            break;
        case 'time':
            sortedRecipes.sort((a, b) => a.time - b.time);
            break;
        case 'name':
            sortedRecipes.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }
    
    // Display sorted recipes
    const container = document.getElementById('recipe-container');
    container.innerHTML = '';
    
    sortedRecipes.forEach(recipe => {
        const isSaved = currentUser ? Database.isRecipeSaved(currentUser.id, recipe.id) : false;
        
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';
        card.innerHTML = `
            <div class="card h-100 recipe-card">
                <img src="${recipe.image}" class="card-img-top" alt="${recipe.name}" style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <h5 class="card-title">${recipe.name}</h5>
                        <button class="btn btn-sm ${isSaved ? 'btn-warning' : 'btn-outline-secondary'} save-recipe-btn" 
                                data-id="${recipe.id}" ${!currentUser ? 'disabled' : ''}>
                            <i class="fas ${isSaved ? 'fa-bookmark' : 'fa-bookmark'}"></i>
                        </button>
                    </div>
                    <p class="card-text">${recipe.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="badge bg-success">${recipe.calories} kcal</span>
                        <span class="badge bg-info">${recipe.time} min</span>
                        <span class="badge bg-warning">${recipe.difficulty}</span>
                    </div>
                    <button class="btn btn-outline-success btn-sm mt-3 view-recipe-btn" data-id="${recipe.id}">
                        <i class="fas fa-eye"></i> Batafsil
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
    
    // Re-add event listeners
    document.querySelectorAll('.save-recipe-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const recipeId = parseInt(this.dataset.id);
            toggleSaveRecipe(recipeId, this);
        });
    });
    
    document.querySelectorAll('.view-recipe-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const recipeId = parseInt(this.dataset.id);
            viewRecipeDetails(recipeId);
        });
    });
}

// Load saved recipes
function loadSavedRecipes() {
    const container = document.getElementById('saved-recipes-container');
    const savedCount = document.getElementById('saved-count');
    
    if (!currentUser) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <div class="card border-dashed">
                    <div class="card-body py-5">
                        <i class="fas fa-bookmark fa-3x text-muted mb-3"></i>
                        <h5 class="text-muted">Hozircha saqlangan retseptlar yo'q</h5>
                        <p class="text-muted">Retseptlarni saqlash uchun kirish qiling</p>
                        <button class="btn btn-outline-success mt-2" data-bs-toggle="modal" data-bs-target="#loginModal">
                            <i class="fas fa-sign-in-alt me-2"></i>Kirish
                        </button>
                    </div>
                </div>
            </div>
        `;
        if (savedCount) savedCount.textContent = '0 ta';
        return;
    }
    
    const savedRecipes = Database.getUserSavedRecipes(currentUser.id);
    
    if (savedRecipes.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <div class="card">
                    <div class="card-body py-5">
                        <i class="fas fa-bookmark fa-3x text-success mb-3"></i>
                        <h5 class="text-success">Saqlangan retseptlar yo'q</h5>
                        <p class="text-muted">Retseptlarni saqlash uchun "Saqlash" tugmasini bosing</p>
                    </div>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = '';
        savedRecipes.forEach(recipe => {
            const col = document.createElement('div');
            col.className = 'col-md-4 mb-4';
            col.innerHTML = `
                <div class="card h-100">
                    <img src="${recipe.image}" class="card-img-top" alt="${recipe.name}" style="height: 180px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${recipe.name}</h5>
                        <p class="card-text small text-muted">${recipe.description.substring(0, 60)}...</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="badge bg-success">${recipe.calories} kcal</span>
                            <button class="btn btn-danger btn-sm remove-saved-btn" data-id="${recipe.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        <button class="btn btn-outline-success btn-sm mt-2 w-100 view-recipe-btn" data-id="${recipe.id}">
                            <i class="fas fa-eye me-1"></i> Ko'rish
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(col);
        });
    }
    
    if (savedCount) {
        savedCount.textContent = `${savedRecipes.length} ta`;
    }
    
    // Add event listeners
    document.querySelectorAll('.remove-saved-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const recipeId = parseInt(this.dataset.id);
            removeSavedRecipe(recipeId);
        });
    });
    
    document.querySelectorAll('.view-recipe-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const recipeId = parseInt(this.dataset.id);
            viewRecipeDetails(recipeId);
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    // Calorie needs form
    const calorieForm = document.getElementById('calorie-needs-form');
    if (calorieForm) {
        calorieForm.addEventListener('submit', calculateCalorieNeeds);
    }
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Update UI based on login status
    if (authButton && registerButton) {
        updateAuthButtons();
    }
}

// Setup image upload
function setupImageUpload() {
    const imageUpload = document.getElementById('imageUpload');
    const uploadPreview = document.getElementById('uploadPreview');
    const analyzeImageBtn = document.getElementById('analyzeImageBtn');
    
    if (imageUpload) {
        imageUpload.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                selectedImageFile = e.target.files[0];
                
                // Show preview
                const reader = new FileReader();
                reader.onload = function(event) {
                    uploadPreview.innerHTML = `
                        <img src="${event.target.result}" class="img-fluid rounded" style="max-height: 200px;">
                        <p class="mt-2 mb-0">Yuklangan rasm: ${selectedImageFile.name}</p>
                        <small class="text-muted">${Math.round(selectedImageFile.size / 1024)} KB</small>
                    `;
                    analyzeImageBtn.disabled = false;
                };
                reader.readAsDataURL(selectedImageFile);
            }
        });
    }
    
    if (analyzeImageBtn) {
        analyzeImageBtn.addEventListener('click', analyzeFoodImage);
    }
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const user = Database.getUser(email, password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        
        // Hide modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        modal.hide();
        
        // Update UI
        updateAuthButtons();
        loadRecipes();
        loadSavedRecipes();
        updateCalorieDisplay();
        
        // Show success message
        showToast('Muvaffaqiyatli kirildi!', 'success');
    } else {
        showToast('Email yoki parol noto\'g\'ri!', 'danger');
    }
}

// Handle register
function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showToast('Barcha maydonlarni to\'ldiring!', 'warning');
        return;
    }
    
    if (password !== confirmPassword) {
        showToast('Parollar mos kelmadi!', 'danger');
        return;
    }
    
    if (password.length < 6) {
        showToast('Parol kamida 6 belgidan iborat bo\'lishi kerak!', 'warning');
        return;
    }
    
    // Check if user exists
    const existingUser = Database.getUserByEmail(email);
    if (existingUser) {
        showToast('Bu email allaqachon ro\'yxatdan o\'tgan!', 'warning');
        return;
    }
    
    // Create new user
    const newUser = {
        name: name,
        email: email,
        password: password,
        gender: 'male',
        height: 170,
        weight: 65,
        age: 25,
        dailyCalorieGoal: 2000
    };
    
    Database.addUser(newUser);
    
    // Auto login
    currentUser = Database.getUser(email, password);
    localStorage.setItem('loggedInUser', JSON.stringify(currentUser));
    
    // Hide modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    modal.hide();
    
    // Update UI
    updateAuthButtons();
    loadRecipes();
    loadSavedRecipes();
    updateCalorieDisplay();
    
    // Show success message
    showToast('Muvaffaqiyatli ro\'yxatdan o\'tdingiz!', 'success');
}

// Update auth buttons
function updateAuthButtons() {
    if (authButton && registerButton) {
        if (currentUser) {
            authButton.innerHTML = `<i class="fas fa-user me-1"></i>${currentUser.name}`;
            authButton.classList.remove('btn-outline-light');
            authButton.classList.add('btn-light');
            authButton.removeAttribute('data-bs-toggle');
            authButton.removeAttribute('data-bs-target');
            authButton.onclick = () => {
                window.location.href = 'profile.html';
            };
            
            registerButton.innerHTML = `<i class="fas fa-sign-out-alt me-1"></i>Chiqish`;
            registerButton.classList.remove('btn-light');
            registerButton.classList.add('btn-outline-light');
            registerButton.removeAttribute('data-bs-toggle');
            registerButton.removeAttribute('data-bs-target');
            registerButton.onclick = logoutUser;
        } else {
            authButton.innerHTML = `<i class="fas fa-sign-in-alt me-1"></i>Kirish`;
            authButton.classList.remove('btn-light');
            authButton.classList.add('btn-outline-light');
            authButton.setAttribute('data-bs-toggle', 'modal');
            authButton.setAttribute('data-bs-target', '#loginModal');
            authButton.onclick = null;
            
            registerButton.innerHTML = `<i class="fas fa-user-plus me-1"></i>Ro'yxatdan o'tish`;
            registerButton.classList.remove('btn-outline-light');
            registerButton.classList.add('btn-light');
            registerButton.setAttribute('data-bs-toggle', 'modal');
            registerButton.setAttribute('data-bs-target', '#loginModal');
            registerButton.onclick = () => {
                // Switch to register tab
                const registerTab = document.getElementById('register-tab');
                if (registerTab) registerTab.click();
            };
        }
    }
}

// Logout user
function logoutUser() {
    currentUser = null;
    localStorage.removeItem('loggedInUser');
    
    updateAuthButtons();
    loadRecipes();
    loadSavedRecipes();
    
    showToast('Muvaffaqiyatli chiqildi!', 'info');
}

// Check login status
function checkLoginStatus() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        try {
            currentUser = JSON.parse(loggedInUser);
            updateAuthButtons();
            updateCalorieDisplay();
        } catch (e) {
            console.error('Error parsing user data:', e);
            localStorage.removeItem('loggedInUser');
        }
    }
}

// Calculate calorie needs
function calculateCalorieNeeds(e) {
    e.preventDefault();
    
    const gender = document.getElementById('gender').value;
    const age = parseInt(document.getElementById('age').value);
    const height = parseInt(document.getElementById('height').value);
    const weight = parseInt(document.getElementById('weight').value);
    const activity = parseFloat(document.getElementById('activity').value);
    
    if (!gender || !age || !height || !weight || !activity) {
        showToast('Barcha maydonlarni to\'ldiring!', 'warning');
        return;
    }
    
    const dailyCalories = Database.calculateDailyCalories(gender, age, height, weight, activity);
    
    // Get consumed calories for today
    let consumedCalories = 0;
    if (currentUser) {
        const todayFoods = Database.getUserFoodLog(currentUser.id);
        consumedCalories = todayFoods.reduce((sum, food) => sum + food.calories, 0);
        
        // Update user's daily goal
        Database.updateUser(currentUser.id, { 
            dailyCalorieGoal: dailyCalories,
            height: height,
            weight: weight,
            age: age,
            gender: gender
        });
        currentUser = { ...currentUser, dailyCalorieGoal: dailyCalories, height, weight, age, gender };
        localStorage.setItem('loggedInUser', JSON.stringify(currentUser));
    }
    
    const remainingCalories = Math.max(0, dailyCalories - consumedCalories);
    const percentage = Math.min(100, (consumedCalories / dailyCalories) * 100);
    
    document.getElementById('daily-calories').textContent = dailyCalories.toLocaleString();
    document.getElementById('remaining-calories').textContent = remainingCalories.toLocaleString();
    
    const progressBar = document.getElementById('calorieProgress');
    progressBar.style.width = `${percentage}%`;
    progressBar.textContent = `${Math.round(percentage)}%`;
    
    document.getElementById('calorie-result').style.display = 'block';
    
    if (!currentUser) {
        showToast('Natijalarni saqlash uchun ro\'yxatdan o\'ting!', 'info');
    }
}

// Analyze food image
function analyzeFoodImage() {
    if (!selectedImageFile) {
        showToast('Iltimos, avval rasm yuklang!', 'warning');
        return;
    }
    
    const resultDiv = document.getElementById('food-recognition-result');
    const foodsList = document.getElementById('recognized-foods');
    
    // Show loading state
    foodsList.innerHTML = `
        <div class="text-center py-4">
            <div class="spinner-border text-info" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Rasm tahlil qilinmoqda...</p>
        </div>
    `;
    
    resultDiv.style.display = 'block';
    
    // Simulate API call delay
    setTimeout(() => {
        const recognizedFood = Database.recognizeFoodFromImage();
        
        foodsList.innerHTML = `
            <div class="card border-success">
                <div class="card-body">
                    <h6 class="card-title text-success">
                        <i class="fas fa-check-circle me-1"></i> Tanishdi!
                    </h6>
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <h5 class="mb-1">${recognizedFood.name}</h5>
                            <small class="text-muted">${recognizedFood.category}</small>
                        </div>
                        <span class="badge bg-info fs-6">${recognizedFood.calories} kcal</span>
                    </div>
                    <div class="d-grid gap-2">
                        ${currentUser ? `
                            <button class="btn btn-success" id="addToLogBtn">
                                <i class="fas fa-plus me-2"></i>Ovqatlar ro'yxatiga qo'shish
                            </button>
                        ` : ''}
                        <button class="btn btn-outline-info" id="searchRecipesBtn">
                            <i class="fas fa-search me-2"></i>Shunga o'xshash retseptlar
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners to buttons
        document.getElementById('addToLogBtn')?.addEventListener('click', function() {
            addRecognizedFoodToLog(recognizedFood);
        });
        
        document.getElementById('searchRecipesBtn').addEventListener('click', function() {
            searchSimilarRecipes(recognizedFood.name);
        });
        
        // Reset file input
        document.getElementById('imageUpload').value = '';
        document.getElementById('uploadPreview').innerHTML = `
            <i class="fas fa-cloud-upload-alt fa-3x text-muted"></i>
            <p class="mt-3">Rasm yuklash uchun bosing</p>
            <small class="text-muted">PNG, JPG yoki JPEG formatida</small>
        `;
        selectedImageFile = null;
        document.getElementById('analyzeImageBtn').disabled = true;
        
    }, 1500);
}

// Add recognized food to log
function addRecognizedFoodToLog(food) {
    if (!currentUser) {
        showToast('Ovqatni qo\'shish uchun kirish qiling!', 'warning');
        return;
    }
    
    Database.addFoodToLog(currentUser.id, {
        name: food.name,
        calories: food.calories
    });
    
    showToast(`${food.name} ovqatlar ro'yxatingizga qo'shildi (${food.calories} kcal)`, 'success');
    updateCalorieDisplay();
}

// Search similar recipes
function searchSimilarRecipes(foodName) {
    const searchTerm = foodName.toLowerCase();
    const similarRecipes = Database.recipes.filter(recipe => 
        recipe.name.toLowerCase().includes(searchTerm) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm)) ||
        recipe.description.toLowerCase().includes(searchTerm)
    );
    
    if (similarRecipes.length === 0) {
        showToast(`"${foodName}" uchun retseplar topilmadi`, 'info');
        return;
    }
    
    // Create modal for similar recipes
    const modalHTML = `
        <div class="modal fade" id="similarRecipesModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title">"${foodName}" uchun retseptlar (${similarRecipes.length} ta)</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row" id="similarRecipesContainer">
                            ${similarRecipes.map(recipe => `
                                <div class="col-md-6 mb-3">
                                    <div class="card h-100">
                                        <img src="${recipe.image}" class="card-img-top" alt="${recipe.name}" style="height: 150px; object-fit: cover;">
                                        <div class="card-body">
                                            <h6 class="card-title">${recipe.name}</h6>
                                            <p class="card-text small">${recipe.description.substring(0, 80)}...</p>
                                            <div class="d-flex justify-content-between align-items-center">
                                                <span class="badge bg-success">${recipe.calories} kcal</span>
                                                <button class="btn btn-sm btn-outline-success view-recipe-btn" data-id="${recipe.id}">
                                                    <i class="fas fa-eye"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('similarRecipesModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add new modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('similarRecipesModal'));
    modal.show();
    
    // Add event listeners to view buttons
    modal._element.addEventListener('shown.bs.modal', function() {
        this.querySelectorAll('.view-recipe-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const recipeId = parseInt(this.dataset.id);
                modal.hide();
                viewRecipeDetails(recipeId);
            });
        });
    });
}

// Toggle save recipe
function toggleSaveRecipe(recipeId, button) {
    if (!currentUser) {
        showToast('Retseptni saqlash uchun kirish qiling!', 'warning');
        return;
    }
    
    const isSaved = Database.isRecipeSaved(currentUser.id, recipeId);
    
    if (isSaved) {
        Database.removeSavedRecipe(currentUser.id, recipeId);
        button.classList.remove('btn-warning');
        button.classList.add('btn-outline-secondary');
        button.innerHTML = '<i class="fas fa-bookmark"></i>';
        showToast('Retsept saqlanganlardan o\'chirildi', 'info');
    } else {
        Database.saveRecipeForUser(currentUser.id, recipeId);
        button.classList.remove('btn-outline-secondary');
        button.classList.add('btn-warning');
        button.innerHTML = '<i class="fas fa-bookmark"></i>';
        showToast('Retsept saqlandi', 'success');
    }
    
    loadSavedRecipes();
}

// Remove saved recipe
function removeSavedRecipe(recipeId) {
    if (!currentUser) return;
    
    Database.removeSavedRecipe(currentUser.id, recipeId);
    showToast('Retsept o\'chirildi', 'info');
    loadSavedRecipes();
    loadRecipes();
}

// View recipe details
function viewRecipeDetails(recipeId) {
    const recipe = Database.recipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    const isSaved = currentUser ? Database.isRecipeSaved(currentUser.id, recipeId) : false;
    
    const modalHTML = `
        <div class="modal fade" id="recipeModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title">${recipe.name}</h5>
                        <div>
                            ${currentUser ? `
                                <button class="btn btn-sm ${isSaved ? 'btn-warning' : 'btn-outline-light'} me-2 save-recipe-btn" data-id="${recipe.id}">
                                    <i class="fas fa-bookmark"></i>
                                </button>
                            ` : ''}
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                    </div>
                    <div class="modal-body">
                        <div class="row mb-4">
                            <div class="col-md-6">
                                <img src="${recipe.image}" class="img-fluid rounded" alt="${recipe.name}" style="max-height: 300px; width: 100%; object-fit: cover;">
                            </div>
                            <div class="col-md-6">
                                <p><strong><i class="fas fa-fire text-success"></i> Kaloriya:</strong> ${recipe.calories} kcal / 100g</p>
                                <p><strong><i class="fas fa-clock text-success"></i> Tayyorlash vaqti:</strong> ${recipe.time} minut</p>
                                <p><strong><i class="fas fa-signal text-success"></i> Murakkablik:</strong> ${recipe.difficulty}</p>
                                <p><strong><i class="fas fa-tag text-success"></i> Kategoriya:</strong> ${recipe.category}</p>
                                <p><strong><i class="fas fa-info-circle text-success"></i> Tavsif:</strong> ${recipe.description}</p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <h6><i class="fas fa-list-ul text-success"></i> Ingredientlar:</h6>
                                <ul class="list-group list-group-flush">
                                    ${recipe.ingredients.map(ing => `
                                        <li class="list-group-item">
                                            <i class="fas fa-check text-success me-2"></i>${ing}
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                            <div class="col-md-6">
                                <h6><i class="fas fa-clipboard-list text-success"></i> Tayyorlash Usuli:</h6>
                                <div class="bg-light p-3 rounded">
                                    ${recipe.instructions.split('\n').map((step, index) => `
                                        <p class="mb-2"><strong>${index + 1}.</strong> ${step}</p>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        ${currentUser ? `
                            <button class="btn btn-success" id="addToMealPlanBtn" data-id="${recipe.id}">
                                <i class="fas fa-plus me-1"></i> Bugungi ovqatga qo'shish
                            </button>
                        ` : ''}
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Yopish</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('recipeModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add new modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('recipeModal'));
    modal.show();
    
    // Add event listeners
    modal._element.addEventListener('shown.bs.modal', function() {
        // Save recipe button
        const saveBtn = this.querySelector('.save-recipe-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', function() {
                const recipeId = parseInt(this.dataset.id);
                toggleSaveRecipe(recipeId, this);
            });
        }
        
        // Add to meal plan button
        const addBtn = this.querySelector('#addToMealPlanBtn');
        if (addBtn) {
            addBtn.addEventListener('click', function() {
                const recipeId = parseInt(this.dataset.id);
                addRecipeToFoodLog(recipeId);
                modal.hide();
            });
        }
    });
}

// Add recipe to food log
function addRecipeToFoodLog(recipeId) {
    if (!currentUser) return;
    
    const recipe = Database.recipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    Database.addFoodToLog(currentUser.id, {
        name: recipe.name,
        calories: recipe.calories
    });
    
    showToast(`${recipe.name} bugungi ovqat ro'yxatingizga qo'shildi (${recipe.calories} kcal)`, 'success');
    updateCalorieDisplay();
}

// Update calorie display
function updateCalorieDisplay() {
    if (!currentUser) return;
    
    const stats = Database.getUserStats(currentUser.id);
    if (!stats) return;
    
    const remainingElement = document.getElementById('remaining-calories');
    if (remainingElement) {
        remainingElement.textContent = stats.remainingCalories.toLocaleString();
    }
    
    const dailyCaloriesElement = document.getElementById('daily-calories');
    if (dailyCaloriesElement && stats.user.dailyCalorieGoal) {
        dailyCaloriesElement.textContent = stats.user.dailyCalorieGoal.toLocaleString();
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer') || createToastContainer();
    
    const toastId = 'toast-' + Date.now();
    const toastHTML = `
        <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    const toastEl = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastEl, {
        autohide: true,
        delay: 3000
    });
    
    toast.show();
    
    // Remove toast after hiding
    toastEl.addEventListener('hidden.bs.toast', function() {
        this.remove();
    });
}

// Create toast container if not exists
function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    container.style.zIndex = '1055';
    document.body.appendChild(container);
    return container;
}