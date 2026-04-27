// LocalStorage orqali ma'lumotlar bazasi
const Database = {
    // Admin ma'lumotlari
    adminCredentials: {
        username: "malohat",
        password: "M1935"
    },

    // Foydalanuvchilar
    users: JSON.parse(localStorage.getItem('users')) || [
        {
            id: 1,
            name: "Test User",
            email: "test@example.com",
            password: "123456",
            gender: "male",
            height: 175,
            weight: 70,
            age: 25,
            dailyCalorieGoal: 2000,
            joinedDate: "2024-01-01"
        }
    ],

    // Retseptlar - 10 ta retsept
    recipes: JSON.parse(localStorage.getItem('recipes')) || [
        // TAOMLAR (4 ta)
        {
            id: 1,
            name: "Quinoa va Sabzavotlar",
            category: "taomlar",
            description: "Protein va vitaminlarga boy quinoa bilan tayyorlangan sog'lom taom",
            calories: 280,
            time: 30,
            difficulty: "oson",
            ingredients: [
                "1 stakan quinoa",
                "2 stakan suv",
                "1 o'rta hajmli sabzi",
                "1 dona qalampir",
                "1 piyoz",
                "2 osh qoshiq zaytun yog'i",
                "Duz va murch",
                "Yashil rayhon"
            ],
            instructions: "1. Quinoadan suvda yuvib, 2 stakan suvda 15-20 daqiqa pishiring. 2. Sabzi va qalampirlarni mayda to'g'rang. 3. Piyozni yog'da sote qiling. 4. Sabzavotlarni qo'shib, 5 daqiqa qovuring. 5. Pishgan quinoadan qo'shib, aralashtiring. 6. Duz, murch va rayhon sepib, dasturxonga torting.",
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            saved: false
        },
        {
            id: 2,
            name: "Grill Tovuq Ko'kragi",
            category: "taomlar",
            description: "Yog'siz va proteinli grill tovuq",
            calories: 165,
            time: 25,
            difficulty: "oson",
            ingredients: [
                "2 dona tovuq ko'kragi",
                "2 osh qoshiq zaytun yog'i",
                "Limon sharbati",
                "Sarimsoq",
                "Rozmarin",
                "Duz va murch"
            ],
            instructions: "1. Tovuq ko'kragini yaxshilab yuvib, quriting. 2. Zaytun yog'i, limon sharbati, maydalangan sarimsoq va rozmarin bilan marinad tayyorlang. 3. Tovuqni marinadga solib, 30 daqiqa muzlatgichda saqlang. 4. Grill panada har tomondan 8-10 daqiqa pishiring.",
            image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            saved: false
        },
        {
            id: 3,
            name: "Turkcha Loviya",
            category: "taomlar",
            description: "Protein va tolaga boy",
            calories: 320,
            time: 40,
            difficulty: "oson",
            ingredients: [
                "2 stakan loviya",
                "1 piyoz",
                "2 pomidor",
                "2 osh qoshiq zaytun yog'i",
                "Duz va murch",
                "Quruq nanza"
            ],
            instructions: "1. Loviyani kechasi namlang. 2. Yog'da piyozni sote qiling. 3. Pomidorlarni mayda to'g'rib qo'shing. 4. Loviyani suv bilan qo'shib, 30-35 daqiqa pishiring. 5. Duz, murch va nanza sepib, dasturxonga torting.",
            image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            saved: false
        },
        {
            id: 4,
            name: "Kabobchalar",
            category: "taomlar",
            description: "Yog'siz mol go'shti kaboblari",
            calories: 280,
            time: 30,
            difficulty: "o'rtacha",
            ingredients: [
                "500g mol go'shti",
                "1 piyoz",
                "Sarimsoq",
                "Kashnich",
                "Duz va murch",
                "Zira"
            ],
            instructions: "1. Go'shtni mayda to'g'rang. 2. Piyoz va sarimsoqni maydalab aralashtiring. 3. Duz, murch, zira va kashnich sepib, yaxshilab aralashtiring. 4. Kabob shaklini berib, grillda pishiring.",
            image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            saved: false
        },

        // SALATLAR (3 ta)
        {
            id: 5,
            name: "Quinoa Salatasi",
            category: "salatlar",
            description: "Vitaminli va to'yg'aruvchi salat",
            calories: 150,
            time: 20,
            difficulty: "oson",
            ingredients: [
                "1 stakan quinoa",
                "1 avakado",
                "1 pomidor",
                "Yarim bodring",
                "1 limon sharbati",
                "Zaytun moyi",
                "Duz va murch"
            ],
            instructions: "1. Quinoadan pishiring. 2. Sabzavotlarni mayda to'g'rang. 3. Hammasini aralashtiring. 4. Zaytun moyi va limon sharbati sepiling.",
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            saved: false
        },
        {
            id: 6,
            name: "Grecheskiy Salat",
            category: "salatlar",
            description: "Yunoncha klassik salat",
            calories: 180,
            time: 15,
            difficulty: "oson",
            ingredients: [
                "1 bodring",
                "2 pomidor",
                "1 piyoz",
                "Feta pishlog'i",
                "Zaytun",
                "Zaytun yog'i",
                "Duz va murch"
            ],
            instructions: "1. Sabzavotlarni kubiklarga to'g'rang. 2. Feta pishlog'ini maydalang. 3. Zaytun qo'shing. 4. Zaytun yog'i sepib aralashtiring.",
            image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            saved: false
        },
        {
            id: 7,
            name: "Avakado Salatasi",
            category: "salatlar",
            description: "Avakado va sabzavotlar salatasi",
            calories: 200,
            time: 15,
            difficulty: "oson",
            ingredients: [
                "2 dona avakado",
                "Pomidor",
                "Qizil piyoz",
                "Limon sharbati",
                "Zaytun yog'i",
                "Duz va murch"
            ],
            instructions: "1. Avakadoni kubiklarga to'g'rang. 2. Pomidor va piyozni maydalang. 3. Limon sharbati va zaytun yog'i sepib aralashtiring.",
            image: "images/avakado.png",
            saved: false
        },

        // ICHIMLIKLAR (2 ta)
        {
            id: 8,
            name: "Zanjabil Choyi",
            category: "ichimliklar",
            description: "Immunitetni mustahkamlovchi choy",
            calories: 10,
            time: 10,
            difficulty: "oson",
            ingredients: [
                "1 osh qoshiq mayda zanjabil",
                "1 stakan suv",
                "Limon",
                "Asal",
                "Darchin"
            ],
            instructions: "1. Zanjabilni suvda 5 daqiqa qaynatib oling. 2. Darchin qo'shing. 3. Limon va asal qo'shib iching.",
            image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            saved: false
        },
        {
            id: 9,
            name: "Sabzi Sharbati",
            category: "ichimliklar",
            description: "Vitamin A ga boy sharbat",
            calories: 85,
            time: 10,
            difficulty: "oson",
            ingredients: [
                "4 dona sabzi",
                "1 dona olma",
                "Yarim limon sharbati",
                "Zanjabil"
            ],
            instructions: "1. Sabzi va olmani yuvib tozolang. 2. Sharbat qilish mashinasidan o'tkazing. 3. Zanjabil va limon sharbati qo'shib iching.",
            image: "images/sabzisharbat.png",
            saved: false
        },

        // SMOOTHIE (1 ta)
        {
            id: 10,
            name: "Yashil Smoothie",
            category: "smuzilar",
            description: "Vitaminlarga boy yashil smoothie",
            calories: 180,
            time: 5,
            difficulty: "oson",
            ingredients: [
                "1 dona kivi",
                "1 kichkina shpinat",
                "1 stakan sut",
                "1 osh qoshiq asal",
                "Muz"
            ],
            instructions: "1. Barcha ingredientlarni blenderda aralashtiring. 2. Muz qo'shing. 3. Stakanga quying va darhol iching.",
            image: "images/ysmoth.png",
            saved: false
        }
    ],

    // Kategoriyalar
    categories: JSON.parse(localStorage.getItem('categories')) || [
        { id: 1, name: "taomlar", description: "Asosiy taomlar" },
        { id: 2, name: "salatlar", description: "Vitaminli salatlar" },
        { id: 3, name: "ichimliklar", description: "Sog'lom ichimliklar" },
        { id: 4, name: "smuzilar", description: "Tabiiy kokteyllar" }
    ],

    // Saqlangan retseptlar
    savedRecipes: JSON.parse(localStorage.getItem('savedRecipes')) || [],

    // Ovqat tarixi
    foodLog: JSON.parse(localStorage.getItem('foodLog')) || [],

    // Initialize database
    init: function() {
        this.saveAll();
    },

    // Save all data to localStorage
    saveAll: function() {
        localStorage.setItem('users', JSON.stringify(this.users));
        localStorage.setItem('recipes', JSON.stringify(this.recipes));
        localStorage.setItem('categories', JSON.stringify(this.categories));
        localStorage.setItem('savedRecipes', JSON.stringify(this.savedRecipes));
        localStorage.setItem('foodLog', JSON.stringify(this.foodLog));
    },

    // User operations
    addUser: function(user) {
        user.id = this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
        user.joinedDate = new Date().toISOString().split('T')[0];
        user.dailyCalorieGoal = 2000;
        this.users.push(user);
        this.saveAll();
        return user;
    },

    getUser: function(email, password) {
        return this.users.find(u => u.email === email && u.password === password);
    },

    getUserByEmail: function(email) {
        return this.users.find(u => u.email === email);
    },

    updateUser: function(userId, updates) {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            this.users[userIndex] = { ...this.users[userIndex], ...updates };
            this.saveAll();
            return true;
        }
        return false;
    },

    // Recipe operations
    addRecipe: function(recipe) {
        recipe.id = this.recipes.length > 0 ? Math.max(...this.recipes.map(r => r.id)) + 1 : 1;
        recipe.saved = false;
        this.recipes.push(recipe);
        this.saveAll();
        return recipe;
    },

    updateRecipe: function(recipeId, updates) {
        const recipeIndex = this.recipes.findIndex(r => r.id === recipeId);
        if (recipeIndex !== -1) {
            this.recipes[recipeIndex] = { ...this.recipes[recipeIndex], ...updates };
            this.saveAll();
            return true;
        }
        return false;
    },

    deleteRecipe: function(recipeId) {
        const recipeIndex = this.recipes.findIndex(r => r.id === recipeId);
        if (recipeIndex !== -1) {
            this.recipes.splice(recipeIndex, 1);
            this.saveAll();
            return true;
        }
        return false;
    },

    getRecipesByCategory: function(category) {
        return this.recipes.filter(r => r.category === category);
    },

    getRecipeCountByCategory: function(category) {
        return this.recipes.filter(r => r.category === category).length;
    },

    // Saved recipes operations
    saveRecipeForUser: function(userId, recipeId) {
        const saved = this.savedRecipes.find(sr => sr.userId === userId && sr.recipeId === recipeId);
        if (!saved) {
            this.savedRecipes.push({ 
                id: this.savedRecipes.length > 0 ? Math.max(...this.savedRecipes.map(sr => sr.id)) + 1 : 1,
                userId, 
                recipeId, 
                savedDate: new Date().toISOString() 
            });
            this.saveAll();
            return true;
        }
        return false;
    },

    removeSavedRecipe: function(userId, recipeId) {
        const index = this.savedRecipes.findIndex(sr => sr.userId === userId && sr.recipeId === recipeId);
        if (index !== -1) {
            this.savedRecipes.splice(index, 1);
            this.saveAll();
            return true;
        }
        return false;
    },

    getUserSavedRecipes: function(userId) {
        const savedIds = this.savedRecipes
            .filter(sr => sr.userId === userId)
            .map(sr => sr.recipeId);
        return this.recipes.filter(r => savedIds.includes(r.id));
    },

    isRecipeSaved: function(userId, recipeId) {
        return this.savedRecipes.some(sr => sr.userId === userId && sr.recipeId === recipeId);
    },

    // Food log operations
    addFoodToLog: function(userId, food) {
        const foodEntry = {
            id: this.foodLog.length > 0 ? Math.max(...this.foodLog.map(f => f.id)) + 1 : 1,
            userId,
            name: food.name,
            calories: parseInt(food.calories),
            date: new Date().toISOString(),
            time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
        };
        this.foodLog.push(foodEntry);
        this.saveAll();
        return foodEntry;
    },

    removeFoodFromLog: function(foodId) {
        const index = this.foodLog.findIndex(f => f.id === foodId);
        if (index !== -1) {
            this.foodLog.splice(index, 1);
            this.saveAll();
            return true;
        }
        return false;
    },

    getUserFoodLog: function(userId) {
        const today = new Date().toISOString().split('T')[0];
        return this.foodLog.filter(f => 
            f.userId === userId && 
            f.date.startsWith(today)
        );
    },

    getUserDailyCalories: function(userId) {
        const todayFoods = this.getUserFoodLog(userId);
        return todayFoods.reduce((sum, food) => sum + food.calories, 0);
    },

    // Calculate daily calorie needs
    calculateDailyCalories: function(gender, age, height, weight, activity) {
        let bmr;
        if (gender === 'male') {
            bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
            bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        }
        return Math.round(bmr * activity);
    },

    // Fake food recognition (in real app, use ML API)
    recognizeFoodFromImage: function() {
        const foods = [
            { name: "Olma", calories: 52, category: "meva" },
            { name: "Banan", calories: 89, category: "meva" },
            { name: "Non", calories: 265, category: "non mahsulotlari" },
            { name: "Tuxum", calories: 155, category: "protein" },
            { name: "Tovuq ko'kragi", calories: 165, category: "go'sht" },
            { name: "Baliq", calories: 206, category: "baliq" },
            { name: "Sabzi", calories: 41, category: "sabzavot" },
            { name: "Salat barglari", calories: 15, category: "sabzavot" },
            { name: "Pomidor", calories: 18, category: "sabzavot" },
            { name: "Bodring", calories: 15, category: "sabzavot" }
        ];
        return foods[Math.floor(Math.random() * foods.length)];
    },

    // Get user statistics
    getUserStats: function(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return null;
        
        const todayFoods = this.getUserFoodLog(userId);
        const consumedCalories = todayFoods.reduce((sum, food) => sum + food.calories, 0);
        const remainingCalories = user.dailyCalorieGoal - consumedCalories;
        const savedRecipesCount = this.savedRecipes.filter(sr => sr.userId === userId).length;
        
        return {
            user,
            consumedCalories,
            remainingCalories,
            savedRecipesCount,
            todayFoods
        };
    }
};

// Initialize database
Database.init();