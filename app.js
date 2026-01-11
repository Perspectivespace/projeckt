class PetCraftingCalculator {
    constructor() {
        this.gold = 100000;
        this.scrolls1 = 5;
        this.scrolls2 = 3;
        this.pets = [...INITIAL_PETS];
        this.selectedPets = []; // Для крафта
        this.selectedPetsInModal = []; // Для множественного выбора в модальном окне
        this.currentFilter = 'all';
        this.petSelectionFilter = 'all';
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.renderAll();
        this.updateStats();
    }
    
    bindEvents() {
        // Кнопка сброса
        document.getElementById('reset-btn').addEventListener('click', () => this.reset());
        
        // Кнопка оптимизации
        document.getElementById('optimize-btn').addEventListener('click', () => this.optimize());
        
        // Ползунки
        document.getElementById('gold-slider').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('gold-input').value = value;
            document.getElementById('gold-value').textContent = formatNumber(value);
            this.gold = value;
            this.updateStats();
        });
        
        document.getElementById('gold-input').addEventListener('input', (e) => {
            const value = parseInt(e.target.value) || 0;
            document.getElementById('gold-slider').value = value;
            document.getElementById('gold-value').textContent = formatNumber(value);
            this.gold = value;
            this.updateStats();
        });
        
        document.getElementById('scroll1-slider').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('scroll1').value = value;
            document.getElementById('scroll1-value').textContent = value;
            this.scrolls1 = value;
        });
        
        document.getElementById('scroll1').addEventListener('input', (e) => {
            const value = parseInt(e.target.value) || 0;
            document.getElementById('scroll1-slider').value = value;
            document.getElementById('scroll1-value').textContent = value;
            this.scrolls1 = value;
        });
        
        document.getElementById('scroll2-slider').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('scroll2').value = value;
            document.getElementById('scroll2-value').textContent = value;
            this.scrolls2 = value;
        });
        
        document.getElementById('scroll2').addEventListener('input', (e) => {
            const value = parseInt(e.target.value) || 0;
            document.getElementById('scroll2-slider').value = value;
            document.getElementById('scroll2-value').textContent = value;
            this.scrolls2 = value;
        });
        
        // Фильтры редкости в основной сетке
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.rarity;
                this.renderPets();
            });
        });
        
        // Добавление питомцев
        document.getElementById('add-pet-btn').addEventListener('click', () => this.showPetSelection());
        
        // Автовыбор для крафта
        document.getElementById('auto-select').addEventListener('click', () => this.autoSelectForCraft());
        
        // Покупка Гадериона
        document.getElementById('buy-gaderion').addEventListener('click', () => this.buyGaderion());
        
        // Кнопка крафта
        document.getElementById('craft-btn').addEventListener('click', () => this.craftSelectedPets());
        
        // Калькулятор свитков
        document.getElementById('calculate-scrolls').addEventListener('click', () => this.calculateScrollsForLevel());
        
        // Фильтры в модальном окне
        document.querySelectorAll('.pet-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.pet-filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.petSelectionFilter = e.target.dataset.filter;
                this.renderPetSelection();
            });
        });
        
        // Кнопки управления в модальном окне
        document.getElementById('select-all-btn').addEventListener('click', () => this.selectAllPets());
        document.getElementById('deselect-all-btn').addEventListener('click', () => this.deselectAllPets());
        
        // Кнопки модального окна
        document.getElementById('cancel-pet-selection').addEventListener('click', () => {
            this.hidePetSelection();
        });
        
        document.getElementById('confirm-pet-selection').addEventListener('click', () => {
            this.confirmPetSelection();
        });
        
        // Закрытие модального окна по клику вне
        document.getElementById('pet-selection-modal').addEventListener('click', (e) => {
            if (e.target.id === 'pet-selection-modal') {
                this.hidePetSelection();
            }
        });
    }
    
    showPetSelection() {
        document.getElementById('pet-selection-modal').style.display = 'flex';
        this.selectedPetsInModal = []; // Сбрасываем выбор при открытии
        this.updateSelectionCounter();
        this.renderPetSelection();
    }
    
    hidePetSelection() {
        document.getElementById('pet-selection-modal').style.display = 'none';
        this.selectedPetsInModal = [];
    }
    
    selectAllPets() {
        const allPets = this.getAllPetsByFilter();
        this.selectedPetsInModal = [...allPets];
        this.renderPetSelection();
        this.updateSelectionCounter();
    }
    
    deselectAllPets() {
        this.selectedPetsInModal = [];
        this.renderPetSelection();
        this.updateSelectionCounter();
    }
    
    getAllPetsByFilter() {
        // Собираем всех питомцев
        const allPets = [
            ...PETS_DATABASE.COMMON,
            ...PETS_DATABASE.RARE,
            ...PETS_DATABASE.EPIC,
            ...PETS_DATABASE.LEGENDARY,
            ...PETS_DATABASE.IMMORTAL
        ];
        
        // Фильтруем по выбранному фильтру
        return this.petSelectionFilter === 'all' 
            ? allPets 
            : allPets.filter(pet => pet.rarity === this.petSelectionFilter);
    }
    
    togglePetInModal(pet) {
        const index = this.selectedPetsInModal.findIndex(p => p.id === pet.id);
        
        if (index === -1) {
            // Добавляем питомца
            this.selectedPetsInModal.push(pet);
        } else {
            // Удаляем питомца
            this.selectedPetsInModal.splice(index, 1);
        }
        
        this.updateSelectionCounter();
        
        // Обновляем визуальное состояние элемента
        const petElement = document.querySelector(`.pet-selection-item[data-id="${pet.id}"]`);
        if (petElement) {
            petElement.classList.toggle('selected', index === -1);
        }
    }
    
    updateSelectionCounter() {
        const count = this.selectedPetsInModal.length;
        document.getElementById('selected-count').textContent = count;
        document.getElementById('confirm-count').textContent = count;
        
        // Делаем кнопку подтверждения активной только если есть выбранные питомцы
        const confirmBtn = document.getElementById('confirm-pet-selection');
        confirmBtn.disabled = count === 0;
    }
    
    renderPetSelection() {
        const grid = document.getElementById('pet-selection-grid');
        grid.innerHTML = '';
        
        // Получаем питомцев по текущему фильтру
        const filteredPets = this.getAllPetsByFilter();
        
        filteredPets.forEach(pet => {
            const petElement = document.createElement('div');
            petElement.className = 'pet-selection-item';
            petElement.dataset.id = pet.id;
            
            // Проверяем, выбран ли питомец
            const isSelected = this.selectedPetsInModal.some(p => p.id === pet.id);
            if (isSelected) {
                petElement.classList.add('selected');
            }
            
            // Проверяем наличие изображения
            const hasImage = pet.imageUrl && pet.imageUrl.startsWith('images/');
            
            petElement.innerHTML = `
                <div class="pet-selection-item-image ${pet.rarity}">
                    ${hasImage 
                        ? `<img src="${pet.imageUrl}" alt="${pet.name}" onerror="this.parentElement.innerHTML = '<div class=\"pet-selection-item-fallback\">${pet.icon}</div>'">`
                        : `<div class="pet-selection-item-fallback">${pet.icon}</div>`
                    }
                </div>
                <div class="pet-selection-item-name">${pet.name}</div>
                <div class="pet-selection-item-rarity ${pet.rarity}">${getRarityName(pet.rarity)}</div>
            `;
            
            petElement.addEventListener('click', (e) => {
                e.stopPropagation();
                this.togglePetInModal(pet);
            });
            
            grid.appendChild(petElement);
        });
    }
    
    confirmPetSelection() {
        if (this.selectedPetsInModal.length === 0) {
            toastr.warning('Выберите хотя бы одного питомца');
            return;
        }
        
        const level = parseInt(document.getElementById('pet-level').value) || 1;
        const xp = parseInt(document.getElementById('pet-xp').value) || 0;
        
        // Добавляем всех выбранных питомцев
        let addedCount = 0;
        this.selectedPetsInModal.forEach(petData => {
            if (this.addPetWithData(petData, level, xp)) {
                addedCount++;
            }
        });
        
        // Обновляем интерфейс
        this.renderPets();
        this.updateStats();
        
        // Закрываем модальное окно
        this.hidePetSelection();
        
        // Сбрасываем форму
        document.getElementById('pet-level').value = 1;
        document.getElementById('pet-xp').value = 0;
        
        toastr.success(`Добавлено ${addedCount} питомцев`);
    }
    
    addPetWithData(petData, level, xp) {
        try {
            // Проверяем максимальный уровень
            if (level > 34) {
                toastr.warning(`Максимальный уровень - 34 (питомец: ${petData.name})`);
                return false;
            }
            
            // Проверяем XP для уровня
            let totalXPNeeded = 0;
            for (let i = 1; i < level; i++) {
                totalXPNeeded += XP_TABLE[i];
            }
            
            if (xp > (XP_TABLE[level] || 0)) {
                toastr.warning(`XP превышает максимальное для этого уровня (питомец: ${petData.name})`);
                return false;
            }
            
            // Создаем нового питомца
            const newPet = {
                ...petData,
                level: level,
                xp: xp,
                totalXP: totalXPNeeded + xp,
                uniqueId: `${petData.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            };
            
            this.pets.push(newPet);
            return true;
            
        } catch (error) {
            console.error('Ошибка при добавлении питомца:', error);
            toastr.error(`Ошибка при добавлении ${petData.name}`);
            return false;
        }
    }
    
    renderAll() {
        this.renderPets();
        this.renderCraftingPanel();
        this.renderUpgradeCalculator();
        this.renderXPTable();
    }
    
    renderPets() {
        const container = document.getElementById('pets-container');
        container.innerHTML = '';
        
        const filteredPets = this.currentFilter === 'all' 
            ? this.pets 
            : this.pets.filter(pet => pet.rarity === this.currentFilter);
        
        filteredPets.forEach(pet => {
            const stats = calculatePetStats(pet);
            const isSelected = this.selectedPets.includes(pet.uniqueId || pet.id);
            const petElement = this.createPetElement(pet, stats, isSelected);
            container.appendChild(petElement);
        });
    }
    
    createPetElement(pet, stats, isSelected) {
        const element = document.createElement('div');
        element.className = `pet-card ${pet.rarity} ${isSelected ? 'selected' : ''}`;
        element.dataset.id = pet.uniqueId || pet.id;
        
        // Прогресс XP
        const xpForNextLevel = XP_TABLE[pet.level] || 0;
        const xpPercentage = xpForNextLevel > 0 ? (pet.xp / xpForNextLevel) * 100 : 0;
        
        // Проверяем наличие изображения
        const hasImage = pet.imageUrl && pet.imageUrl.startsWith('images/');
        
        element.innerHTML = `
            <div class="pet-card-header">
                <div class="pet-card-image ${pet.rarity}">
                    ${hasImage 
                        ? `<img src="${pet.imageUrl}" alt="${pet.name}" onerror="this.parentElement.innerHTML = '<div class=\"pet-card-image-fallback\">${pet.icon}</div>`
                        : `<div class="pet-card-image-fallback">${pet.icon}</div>`
                    }
                </div>
                <div class="pet-card-info">
                    <div class="pet-card-name">${pet.name}</div>
                    <div class="pet-card-meta">
                        <span class="pet-rarity ${pet.rarity}">${getRarityName(pet.rarity)}</span>
                        <span class="pet-level">Уровень: ${pet.level}</span>
                    </div>
                </div>
                <button class="delete-pet-btn" onclick="app.deletePet('${pet.uniqueId || pet.id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="pet-stats-grid">
                <div class="stat-card">
                    <div class="label">💰 Золото/час</div>
                    <div class="value">${stats.goldPerHour.toFixed(1)}</div>
                </div>
                <div class="stat-card">
                    <div class="label">⚡ Сила</div>
                    <div class="value">${stats.power.toFixed(0)}</div>
                </div>
                <div class="stat-card">
                    <div class="label">📈 След. ур.</div>
                    <div class="value">+${stats.goldIncrease.toFixed(1)}</div>
                </div>
                <div class="stat-card">
                    <div class="label">📊 Эффективность</div>
                    <div class="value">${stats.costEffectiveness.toFixed(3)}</div>
                </div>
            </div>
            
            <div class="xp-progress">
                <div class="xp-bar">
                    <div class="xp-fill" style="width: ${xpPercentage}%"></div>
                </div>
                <div class="xp-text">
                    XP: ${pet.xp}/${xpForNextLevel} (${xpPercentage.toFixed(1)}%)
                </div>
            </div>
            
            <div class="upgrade-controls">
                <button class="upgrade-btn" onclick="app.upgradePet('${pet.uniqueId || pet.id}')" 
                        ${stats.scrollsNeeded.scroll1 > this.scrolls1 || 
                          stats.scrollsNeeded.scroll2 > this.scrolls2 || 
                          stats.upgradeCost > this.gold ? 'disabled' : ''}>
                    Улучшить (${formatNumber(stats.upgradeCost)} золота)
                </button>
                <button class="select-btn" onclick="app.togglePetSelection('${pet.uniqueId || pet.id}')">
                    ${isSelected ? '❌ Отменить выбор' : '✅ Выбрать для крафта'}
                </button>
            </div>
        `;
        
        return element;
    }
    
    togglePetSelection(petId) {
        const index = this.selectedPets.indexOf(petId);
        if (index === -1) {
            if (this.selectedPets.length < 3) {
                this.selectedPets.push(petId);
            } else {
                toastr.warning('Можно выбрать максимум 3 питомца для крафта');
                return;
            }
        } else {
            this.selectedPets.splice(index, 1);
        }
        
        this.renderPets();
        this.renderCraftingPanel();
    }
    
    upgradePet(petId) {
        const petIndex = this.pets.findIndex(p => (p.uniqueId || p.id) === petId);
        if (petIndex === -1) return;
        
        const pet = this.pets[petIndex];
        const stats = calculatePetStats(pet);
        
        // Проверяем ресурсы
        if (stats.scrollsNeeded.scroll1 > this.scrolls1 || 
            stats.scrollsNeeded.scroll2 > this.scrolls2) {
            toastr.error('Недостаточно свитков для улучшения');
            return;
        }
        
        if (stats.upgradeCost > this.gold) {
            toastr.error('Недостаточно золота');
            return;
        }
        
        // Списание ресурсов
        this.scrolls1 -= stats.scrollsNeeded.scroll1;
        this.scrolls2 -= stats.scrollsNeeded.scroll2;
        this.gold -= stats.upgradeCost;
        
        // Добавление XP
        pet.xp += stats.scrollsNeeded.totalXP;
        
        // Повышение уровней
        while (pet.level <= 34 && pet.xp >= (XP_TABLE[pet.level] || Infinity)) {
            pet.xp -= XP_TABLE[pet.level];
            pet.level++;
        }
        
        pet.totalXP += stats.scrollsNeeded.totalXP;
        
        // Обновление интерфейса
        document.getElementById('scroll1').value = this.scrolls1;
        document.getElementById('scroll1-slider').value = this.scrolls1;
        document.getElementById('scroll1-value').textContent = this.scrolls1;
        
        document.getElementById('scroll2').value = this.scrolls2;
        document.getElementById('scroll2-slider').value = this.scrolls2;
        document.getElementById('scroll2-value').textContent = this.scrolls2;
        
        document.getElementById('gold-input').value = this.gold;
        document.getElementById('gold-slider').value = this.gold;
        document.getElementById('gold-value').textContent = formatNumber(this.gold);
        
        this.renderAll();
        this.updateStats();
        
        toastr.success(`${pet.name} улучшен до ${pet.level} уровня!`);
    }
    
    deletePet(petId) {
        if (confirm('Удалить этого питомца?')) {
            this.pets = this.pets.filter(pet => (pet.uniqueId || pet.id) !== petId);
            this.selectedPets = this.selectedPets.filter(id => id !== petId);
            this.renderAll();
            this.updateStats();
            toastr.info('Питомец удален');
        }
    }
    
    buyGaderion() {
        const cost = 3000;
        
        if (this.gold < cost) {
            toastr.error(`Недостаточно золота. Нужно ${cost}, а у вас ${this.gold}`);
            return;
        }
        
        this.gold -= cost;
        
        // Создаем Гадериона
        const gaderion = {
            ...PETS_DATABASE.COMMON[0],
            level: 1,
            xp: 0,
            totalXP: 0,
            uniqueId: `gaderion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
        
        this.pets.push(gaderion);
        
        // Обновляем интерфейс
        document.getElementById('gold-input').value = this.gold;
        document.getElementById('gold-slider').value = this.gold;
        document.getElementById('gold-value').textContent = formatNumber(this.gold);
        
        this.renderPets();
        this.updateStats();
        document.getElementById('pets-count').textContent = this.pets.length;
        
        toastr.success(`Куплен Гадерион за ${cost} золота!`);
    }
    
    autoSelectForCraft() {
        // Сбрасываем текущий выбор
        this.selectedPets = [];
        
        // Группируем питомцев по редкости
        const byRarity = {};
        this.pets.forEach(pet => {
            if (!byRarity[pet.rarity]) byRarity[pet.rarity] = [];
            byRarity[pet.rarity].push(pet);
        });
        
        // Ищем редкость с 3+ питомцами
        let selectedRarity = null;
        for (const [rarity, pets] of Object.entries(byRarity)) {
            if (pets.length >= 3 && CRAFTING_MAP[rarity]) {
                selectedRarity = rarity;
                break;
            }
        }
        
        if (!selectedRarity) {
            toastr.warning('Нет подходящих питомцев для крафта');
            return;
        }
        
        // Выбираем 3 самых слабых питомца этой редкости
        const weakestPets = [...byRarity[selectedRarity]]
            .sort((a, b) => {
                const statsA = calculatePetStats(a);
                const statsB = calculatePetStats(b);
                return statsA.goldPerHour - statsB.goldPerHour;
            })
            .slice(0, 3)
            .map(pet => pet.uniqueId || pet.id);
        
        this.selectedPets = weakestPets;
        this.renderPets();
        this.renderCraftingPanel();
        
        toastr.info(`Автоматически выбрано 3 ${getRarityName(selectedRarity)} питомца для крафта`);
    }
    
    craftSelectedPets() {
        if (this.selectedPets.length !== 3) {
            toastr.error('Выберите ровно 3 питомца для крафта');
            return;
        }
        
        const selectedPets = this.selectedPets.map(id => 
            this.pets.find(p => (p.uniqueId || p.id) === id)
        );
        
        // Проверяем редкость
        const firstRarity = selectedPets[0].rarity;
        if (!selectedPets.every(pet => pet.rarity === firstRarity)) {
            toastr.error('Все питомцы должны быть одинаковой редкости');
            return;
        }
        
        if (!CRAFTING_MAP[firstRarity]) {
            toastr.error('Невозможно крафтить питомцев этой редкости');
            return;
        }
        
        try {
            const result = simulateCraft(selectedPets);
            
            // Удаляем старых питомцев
            this.pets = this.pets.filter(pet => !this.selectedPets.includes(pet.uniqueId || pet.id));
            
            // Добавляем нового
            this.pets.push(result.pet);
            
            // Очищаем выбор
            this.selectedPets = [];
            
            this.renderAll();
            this.updateStats();
            
            toastr.success(`Скрафтили ${result.pet.name} (${getRarityName(result.pet.rarity)})!`);
            
        } catch (error) {
            toastr.error(error.message);
        }
    }
    
    renderCraftingPanel() {
        const container = document.getElementById('selected-pets');
        const resultContainer = document.getElementById('crafting-result');
        const craftBtn = document.getElementById('craft-btn');
        
        if (this.selectedPets.length === 0) {
            container.innerHTML = `
                <div class="crafting-selected-pets">
                    <p>Выберите 3 питомца одинаковой редкости</p>
                </div>
            `;
            resultContainer.innerHTML = '';
            craftBtn.disabled = true;
            return;
        }
        
        const selectedPets = this.selectedPets.map(id => 
            this.pets.find(p => (p.uniqueId || p.id) === id)
        );
        
        // Отображаем выбранных питомцев с изображениями
        let selectedPetsHTML = '<div class="crafting-selected-pets">';
        selectedPets.forEach(pet => {
            if (!pet) return;
            
            // Проверяем наличие изображения
            const hasImage = pet.imageUrl && pet.imageUrl.startsWith('images/');
            
            selectedPetsHTML += `
                <div class="crafting-selected-pet">
                    <div class="crafting-selected-pet-image ${pet.rarity}">
                        ${hasImage 
                            ? `<img src="${pet.imageUrl}" alt="${pet.name}" onerror="this.parentElement.innerHTML = '<div class=\"crafting-selected-pet-fallback\">${pet.icon}</div>`
                            : `<div class="crafting-selected-pet-fallback">${pet.icon}</div>`
                        }
                    </div>
                    <div class="crafting-selected-pet-name">${pet.name}</div>
                </div>
            `;
        });
        selectedPetsHTML += '</div>';
        
        container.innerHTML = selectedPetsHTML;
        
        // Проверяем возможность крафта
        const firstRarity = selectedPets[0].rarity;
        const canCraft = selectedPets.length === 3 && 
                        selectedPets.every(pet => pet.rarity === firstRarity) &&
                        CRAFTING_MAP[firstRarity];
        
        if (canCraft) {
            try {
                const result = simulateCraft(selectedPets);
                
                // Проверяем наличие изображения для нового питомца
                const hasCraftedImage = result.pet.imageUrl && result.pet.imageUrl.startsWith('images/');
                
                resultContainer.innerHTML = `
                    <h4>Результат крафта:</h4>
                    <div style="display: flex; align-items: center; gap: 15px; margin: 15px 0;">
                        <div class="pet-card-image ${result.pet.rarity}" style="width: 60px; height: 60px;">
                            ${hasCraftedImage 
                                ? `<img src="${result.pet.imageUrl}" alt="${result.pet.name}" onerror="this.parentElement.innerHTML = '<div class=\"pet-card-image-fallback\">${result.pet.icon}</div>`
                                : `<div class="pet-card-image-fallback">${result.pet.icon}</div>`
                            }
                        </div>
                        <div>
                            <p style="font-weight: bold; margin-bottom: 5px;">${result.pet.icon} ${result.pet.name} (${getRarityName(result.pet.rarity)})</p>
                            <p>Уровень: 1</p>
                        </div>
                    </div>
                    <p>Золота/час: ${result.gainedGoldPerHour.toFixed(1)}</p>
                    <p>Изменение дохода: <span class="${result.goldChange > 0 ? 'positive' : 'negative'}">
                        ${result.goldChange > 0 ? '+' : ''}${result.goldChange.toFixed(1)} золота/час
                    </span></p>
                    <p>Эффективность: ${result.efficiency.toFixed(2)}x</p>
                `;
                
                craftBtn.disabled = false;
                
                // Анализ выгодности
                this.renderCraftingAnalysis();
                
            } catch (error) {
                resultContainer.innerHTML = `<p class="error">${error.message}</p>`;
                craftBtn.disabled = true;
            }
        } else {
            resultContainer.innerHTML = '<p class="warning">Выберите 3 питомца одинаковой редкости</p>';
            craftBtn.disabled = true;
        }
    }
    
    renderCraftingAnalysis() {
        const analysis = analyzeCrafting(this.pets);
        const container = document.getElementById('crafting-analysis');
        
        let html = '<div class="analysis-grid">';
        
        Object.keys(analysis).forEach(rarity => {
            const data = analysis[rarity];
            if (data.error) return;
            
            html += `
                <div class="analysis-item ${data.recommended ? 'recommended' : 'not-recommended'}">
                    <h5>${getRarityName(rarity)} → ${getRarityName(data.nextRarity)}</h5>
                    <p>Изменение дохода: <strong>${data.goldChange > 0 ? '+' : ''}${data.goldChange.toFixed(1)}</strong> золота/час</p>
                    <p>Эффективность: <strong>${data.efficiency.toFixed(2)}x</strong></p>
                    <p>${data.recommended ? '✅ Рекомендуется' : '❌ Не рекомендуется'}</p>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }
    
    renderUpgradeCalculator() {
        const optimalUpgrades = findOptimalUpgrades(
            this.pets, 
            this.gold, 
            this.scrolls1, 
            this.scrolls2
        );
        
        const container = document.getElementById('upgrade-recommendations');
        
        if (optimalUpgrades.length === 0) {
            container.innerHTML = '<p>Нет доступных улучшений или недостаточно ресурсов</p>';
            return;
        }
        
        let html = '<div class="recommendations-list">';
        
        optimalUpgrades.slice(0, 5).forEach(upgrade => {
            html += `
                <div class="recommendation-item">
                    <h5>${upgrade.name} (${getRarityName(upgrade.rarity)})</h5>
                    <p>Прирост: +${upgrade.goldIncrease.toFixed(1)} золота/час</p>
                    <p>Стоимость: ${formatNumber(upgrade.upgradeCost)} золота</p>
                    <p>ROI за день: ${(upgrade.roi * 100).toFixed(1)}%</p>
                    <p>Свитки: ${upgrade.scrollsNeeded.scroll1}×1 + ${upgrade.scrollsNeeded.scroll2}×2</p>
                    <button class="btn small" onclick="app.upgradePet('${upgrade.petId}')">Улучшить</button>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }
    
    renderXPTable() {
        const container = document.getElementById('xp-table-body');
        let html = '';
        
        let cumulativeXP = 0;
        
        for (let level = 1; level <= 34; level++) {
            const xpNeeded = XP_TABLE[level] || 0;
            cumulativeXP += xpNeeded;
            
            html += `
                <div class="xp-row">
                    <div class="xp-cell">${level}</div>
                    <div class="xp-cell">${formatNumber(xpNeeded)}</div>
                    <div class="xp-cell">${formatNumber(cumulativeXP)}</div>
                </div>
            `;
        }
        
        container.innerHTML = html;
    }
    
    calculateScrollsForLevel() {
        const targetLevel = parseInt(document.getElementById('target-level').value) || 10;
        const container = document.getElementById('scrolls-result');
        
        let html = '<h5>Результаты расчета:</h5>';
        
        this.pets.forEach(pet => {
            const result = calculateScrollsForLevel(pet.level, targetLevel, pet.xp);
            if (result.cost > 0) {
                html += `
                    <div class="scroll-calculation">
                        <p><strong>${pet.name}</strong> (с ${pet.level} до ${targetLevel})</p>
                        <p>Свитки 1: ${result.scroll1} × 10,000 = ${formatNumber(result.scroll1 * 10000)} золота</p>
                        <p>Свитки 2: ${result.scroll2} × 19,000 = ${formatNumber(result.scroll2 * 19000)} золота</p>
                        <p>Всего: ${formatNumber(result.cost)} золота</p>
                        <p>Общий XP: ${formatNumber(result.totalXP)}</p>
                        <hr>
                    </div>
                `;
            }
        });
        
        container.innerHTML = html;
    }
    
    updateStats() {
        const stats = calculateTotalStats(this.pets);
        
        document.getElementById('total-gold').textContent = formatNumber(this.gold);
        document.getElementById('gold-per-hour').textContent = stats.totalGoldPerHour.toFixed(1);
        document.getElementById('gold-per-day').textContent = formatNumber(stats.goldPerDay);
        document.getElementById('total-power').textContent = formatNumber(stats.totalPower);
        document.getElementById('total-pets').textContent = this.pets.length;
        document.getElementById('pets-count').textContent = this.pets.length;
    }
    
    optimize() {
        // Простая оптимизация: улучшаем самого эффективного питомца
        const optimalUpgrades = findOptimalUpgrades(
            this.pets, 
            this.gold, 
            this.scrolls1, 
            this.scrolls2
        );
        
        if (optimalUpgrades.length > 0) {
            this.upgradePet(optimalUpgrades[0].petId);
            toastr.info(`Оптимизация: улучшен ${optimalUpgrades[0].name}`);
        } else {
            toastr.info('Нет доступных улучшений для оптимизации');
        }
    }
    
    reset() {
        this.gold = 100000;
        this.scrolls1 = 5;
        this.scrolls2 = 3;
        this.pets = [...INITIAL_PETS];
        this.selectedPets = [];
        this.selectedPetsInModal = [];
        this.currentFilter = 'all';
        this.petSelectionFilter = 'all';
        
        document.getElementById('gold-input').value = this.gold;
        document.getElementById('gold-slider').value = this.gold;
        document.getElementById('gold-value').textContent = formatNumber(this.gold);
        
        document.getElementById('scroll1').value = this.scrolls1;
        document.getElementById('scroll1-slider').value = this.scrolls1;
        document.getElementById('scroll1-value').textContent = this.scrolls1;
        
        document.getElementById('scroll2').value = this.scrolls2;
        document.getElementById('scroll2-slider').value = this.scrolls2;
        document.getElementById('scroll2-value').textContent = this.scrolls2;
        
        document.getElementById('pet-level').value = 1;
        document.getElementById('pet-xp').value = 0;
        
        // Сбрасываем фильтры
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.rarity === 'all') btn.classList.add('active');
        });
        
        document.querySelectorAll('.pet-filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === 'all') btn.classList.add('active');
        });
        
        this.renderAll();
        this.updateStats();
        
        toastr.success('Калькулятор сброшен до начальных значений');
    }
}

// Инициализация приложения
let app;
document.addEventListener('DOMContentLoaded', () => {
    toastr.options = {
        positionClass: 'toast-top-right',
        progressBar: true,
        timeOut: 3000
    };
    
    app = new PetCraftingCalculator();
});