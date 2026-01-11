// Функция расчета характеристик питомца
function calculatePetStats(pet) {
    const goldPerHour = pet.baseGoldPerHour + (pet.level - 1) * pet.goldPerLevel;
    const power = pet.basePower + (pet.level - 1) * pet.powerPerLevel;
    
    // XP для следующего уровня
    const xpForNextLevel = XP_TABLE[pet.level] || Infinity;
    const xpNeeded = xpForNextLevel - pet.xp;
    
    // Стоимость улучшения в золоте (через свитки)
    const scrollsNeeded = calculateOptimalScrolls(xpNeeded);
    const upgradeCost = scrollsNeeded.cost;
    
    // Доход на следующем уровне
    const nextLevelGold = pet.baseGoldPerHour + pet.level * pet.goldPerLevel;
    const goldIncrease = nextLevelGold - goldPerHour;
    
    // Эффективность улучшения
    const costEffectiveness = goldIncrease / upgradeCost;
    
    return {
        goldPerHour,
        power,
        xpNeeded,
        upgradeCost,
        goldIncrease,
        costEffectiveness,
        nextLevelGold,
        scrollsNeeded
    };
}

// Расчет оптимального количества свитков
function calculateOptimalScrolls(xpNeeded) {
    if (xpNeeded <= 0) {
        return { scroll1: 0, scroll2: 0, cost: 0, totalXP: 0 };
    }
    
    let bestCost = Infinity;
    let bestScroll1 = 0;
    let bestScroll2 = 0;
    
    // Перебираем возможное количество свитков 2
    const maxScroll2 = Math.ceil(xpNeeded / SCROLLS.SCROLL_2.xp);
    
    for (let scroll2 = 0; scroll2 <= maxScroll2; scroll2++) {
        const xpFromScroll2 = scroll2 * SCROLLS.SCROLL_2.xp;
        const remainingXP = Math.max(0, xpNeeded - xpFromScroll2);
        const scroll1 = Math.ceil(remainingXP / SCROLLS.SCROLL_1.xp);
        
        const totalCost = scroll2 * SCROLLS.SCROLL_2.cost + scroll1 * SCROLLS.SCROLL_1.cost;
        const totalXP = scroll2 * SCROLLS.SCROLL_2.xp + scroll1 * SCROLLS.SCROLL_1.xp;
        
        // Если стоимость меньше или такая же но меньше свитков
        if (totalCost < bestCost || (totalCost === bestCost && (scroll1 + scroll2) < (bestScroll1 + bestScroll2))) {
            bestCost = totalCost;
            bestScroll1 = scroll1;
            bestScroll2 = scroll2;
        }
    }
    
    return {
        scroll1: bestScroll1,
        scroll2: bestScroll2,
        cost: bestCost,
        totalXP: bestScroll1 * SCROLLS.SCROLL_1.xp + bestScroll2 * SCROLLS.SCROLL_2.xp
    };
}

// Расчет свитков для конкретного уровня
function calculateScrollsForLevel(currentLevel, targetLevel, currentXP = 0) {
    if (targetLevel <= currentLevel) {
        return { scroll1: 0, scroll2: 0, cost: 0, totalXP: 0 };
    }
    
    let totalXPNeeded = 0;
    
    // Суммируем XP для всех уровней до целевого
    for (let level = currentLevel; level < targetLevel; level++) {
        totalXPNeeded += XP_TABLE[level];
    }
    
    // Вычитаем уже имеющийся XP на текущем уровне
    totalXPNeeded -= currentXP;
    
    return calculateOptimalScrolls(totalXPNeeded);
}

// Функция крафта
function simulateCraft(pets) {
    if (pets.length !== 3) {
        throw new Error('Для крафта нужно ровно 3 питомца');
    }
    
    const firstRarity = pets[0].rarity;
    
    // Проверяем, что все питомцы одной редкости
    if (!pets.every(pet => pet.rarity === firstRarity)) {
        throw new Error('Все питомцы должны быть одинаковой редкости');
    }
    
    const nextRarity = CRAFTING_MAP[firstRarity];
    if (!nextRarity) {
        throw new Error('Невозможно крафтить питомцев максимальной редкости');
    }
    
    // Выбираем случайного питомца следующей редкости
    const availablePets = PETS_DATABASE[nextRarity.toUpperCase()];
    const randomPet = availablePets[Math.floor(Math.random() * availablePets.length)];
    
    // Создаем нового питомца 1 уровня
    const craftedPet = {
        ...randomPet,
        level: 1,
        xp: 0,
        totalXP: 0,
        uniqueId: `${randomPet.id}_${Date.now()}`
    };
    
    // Рассчитываем потери и выгоду
    const lostGoldPerHour = pets.reduce((sum, pet) => {
        const stats = calculatePetStats(pet);
        return sum + stats.goldPerHour;
    }, 0);
    
    const craftedStats = calculatePetStats(craftedPet);
    const goldChange = craftedStats.goldPerHour - lostGoldPerHour;
    
    return {
        pet: craftedPet,
        goldChange,
        lostGoldPerHour,
        gainedGoldPerHour: craftedStats.goldPerHour,
        efficiency: craftedStats.goldPerHour / lostGoldPerHour
    };
}

// Анализ выгодности крафта
function analyzeCrafting(petsList) {
    const analysis = {};
    
    // Группируем по редкости
    const byRarity = {};
    petsList.forEach(pet => {
        if (!byRarity[pet.rarity]) byRarity[pet.rarity] = [];
        byRarity[pet.rarity].push(pet);
    });
    
    // Анализируем каждую редкость
    Object.keys(byRarity).forEach(rarity => {
        const pets = byRarity[rarity];
        if (pets.length >= 3 && CRAFTING_MAP[rarity]) {
            // Берем 3 самых слабых питомца для анализа
            const weakestPets = [...pets]
                .sort((a, b) => calculatePetStats(a).goldPerHour - calculatePetStats(b).goldPerHour)
                .slice(0, 3);
            
            try {
                const craftResult = simulateCraft(weakestPets);
                analysis[rarity] = {
                    recommended: craftResult.goldChange > 0,
                    goldChange: craftResult.goldChange,
                    efficiency: craftResult.efficiency,
                    lostGold: craftResult.lostGoldPerHour,
                    gainedGold: craftResult.gainedGoldPerHour,
                    nextRarity: CRAFTING_MAP[rarity]
                };
            } catch (e) {
                analysis[rarity] = { error: e.message };
            }
        }
    });
    
    return analysis;
}

// Поиск оптимальных улучшений
function findOptimalUpgrades(petsList, availableGold, availableScrolls1, availableScrolls2) {
    const candidates = petsList.map(pet => {
        const stats = calculatePetStats(pet);
        
        // Проверяем, хватает ли ресурсов
        const canAfford = stats.scrollsNeeded.scroll1 <= availableScrolls1 && 
                         stats.scrollsNeeded.scroll2 <= availableScrolls2;
        
        return {
            petId: pet.uniqueId || pet.id,
            name: pet.name,
            rarity: pet.rarity,
            costEffectiveness: stats.costEffectiveness,
            upgradeCost: stats.upgradeCost,
            goldIncrease: stats.goldIncrease,
            xpNeeded: stats.xpNeeded,
            scrollsNeeded: stats.scrollsNeeded,
            canAfford,
            roi: (stats.goldIncrease * 24) / stats.upgradeCost // ROI за день
        };
    });
    
    // Фильтруем по доступности и сортируем по ROI
    return candidates
        .filter(c => c.canAfford)
        .sort((a, b) => b.roi - a.roi);
}

// Расчет общей статистики
function calculateTotalStats(petsList) {
    const totalGoldPerHour = petsList.reduce((sum, pet) => {
        return sum + calculatePetStats(pet).goldPerHour;
    }, 0);
    
    const totalPower = petsList.reduce((sum, pet) => {
        return sum + calculatePetStats(pet).power;
    }, 0);
    
    const goldPerDay = totalGoldPerHour * 24;
    
    return {
        totalGoldPerHour,
        goldPerDay,
        totalPower,
        totalPets: petsList.length
    };
}

// Форматирование чисел
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return Math.round(num);
}

// Русское название редкости
function getRarityName(rarity) {
    return RARITY_NAMES_RU[rarity] || rarity;
}