// Константы редкости
const PET_RARITY = {
    COMMON: 'common',
    RARE: 'rare',
    EPIC: 'epic',
    LEGENDARY: 'legendary',
    IMMORTAL: 'immortal'
};

// Таблица опыта для уровней (для перехода на следующий уровень)
const XP_TABLE = {
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
    6: 600,
    7: 700,
    8: 800,
    9: 1000,
    10: 1200,
    11: 1400,
    12: 1600,
    13: 1800,
    14: 2000,
    15: 2200,
    16: 2400,
    17: 2600,
    18: 2800,
    19: 3000,
    20: 3500,
    21: 4000,
    22: 4500,
    23: 5000,
    24: 5500,
    25: 6000,
    26: 6500,
    27: 7000,
    28: 7500,
    29: 10000,
    30: 15000,
    31: 20000,
    32: 25000,
    33: 30000,
    34: 35000,
    // Максимальный уровень 34
};

// Свитки улучшения
const SCROLLS = {
    SCROLL_1: { xp: 500, cost: 10000, name: "Свиток 1", costPerXP: 20 },
    SCROLL_2: { xp: 1000, cost: 19000, name: "Свиток 2", costPerXP: 19 }
};

// База данных питомцев с путями к изображениям
const PETS_DATABASE = {
    // Обычные
    COMMON: [
        {
            id: 'gaderion',
            name: "Гадерион",
            rarity: PET_RARITY.COMMON,
            baseGoldPerHour: 7,
            goldPerLevel: 5,
            basePower: 15,
            powerPerLevel: 15,
            icon: '🛡️',
            imageUrl: 'images/pets/gaderion.png',
            craftingCost: { gold: 1000 }
        }
    ],
    
    // Редкие
    RARE: [
        {
            id: 'ignis',
            name: "Игнис",
            rarity: PET_RARITY.RARE,
            baseGoldPerHour: 9,
            goldPerLevel: 8,
            basePower: 20,
            powerPerLevel: 80,
            icon: '🔥',
            imageUrl: 'images/pets/ignis.png',
            craftingCost: { gold: 5000 }
        },
        {
            id: 'runiel',
            name: "Руниэль",
            rarity: PET_RARITY.RARE,
            baseGoldPerHour: 44,
            goldPerLevel: 34,
            basePower: 71,
            powerPerLevel: 142,
            icon: '📖',
            imageUrl: 'images/pets/runiel.png',
            craftingCost: { gold: 5000 }
        },
        {
            id: 'chronos',
            name: "Хронос",
            rarity: PET_RARITY.RARE,
            baseGoldPerHour: 36,
            goldPerLevel: 38,
            basePower: 60,
            powerPerLevel: 120,
            icon: '⏳',
            imageUrl: 'images/pets/chronos.png',
            craftingCost: { gold: 5000 }
        },
        {
            id: 'gemmari',
            name: "Геммари",
            rarity: PET_RARITY.RARE,
            baseGoldPerHour: 40,
            goldPerLevel: 46,
            basePower: 70,
            powerPerLevel: 140,
            icon: '💎',
            imageUrl: 'images/pets/gemmari.png',
            craftingCost: { gold: 5000 }
        },
        {
            id: 'vipi',
            name: "Випи",
            rarity: PET_RARITY.RARE,
            baseGoldPerHour: 28,
            goldPerLevel: 22,
            basePower: 50,
            powerPerLevel: 100,
            icon: '🦊',
            imageUrl: 'images/pets/vipi.png',
            craftingCost: { gold: 5000 }
        },
        {
            id: 'neressis',
            name: "Нерессис",
            rarity: PET_RARITY.RARE,
            baseGoldPerHour: 24,
            goldPerLevel: 14,
            basePower: 40,
            powerPerLevel: 80,
            icon: '🐍',
            imageUrl: 'images/pets/nereissis.png',
            craftingCost: { gold: 5000 }
        },
        {
            id: 'tempranis',
            name: "Темпранис",
            rarity: PET_RARITY.RARE,
            baseGoldPerHour: 34,
            goldPerLevel: 34,
            basePower: 60,
            powerPerLevel: 120,
            icon: '❄️',
            imageUrl: 'images/pets/tempranis.png',
            craftingCost: { gold: 5000 }
        },
        {
            id: 'ignivar',
            name: "Игнивар",
            rarity: PET_RARITY.RARE,
            baseGoldPerHour: 13,
            goldPerLevel: 24,
            basePower: 25,
            powerPerLevel: 100,
            icon: '⚔️',
            imageUrl: 'images/pets/ignivar.png',
            craftingCost: { gold: 5000 }
        }
    ],
    
    // Эпические
    EPIC: [
        {
            id: 'chippy',
            name: "Чипи",
            rarity: PET_RARITY.EPIC,
            baseGoldPerHour: 41,
            goldPerLevel: 42,
            basePower: 70,
            powerPerLevel: 210,
            icon: '🐿️',
            imageUrl: 'images/pets/chippy.png',
            craftingCost: { gold: 15000 }
        },
        {
            id: 'zephyros',
            name: "Зефирос",
            rarity: PET_RARITY.EPIC,
            baseGoldPerHour: 37,
            goldPerLevel: 60,
            basePower: 65,
            powerPerLevel: 195,
            icon: '💨',
            imageUrl: 'images/pets/zephyros.png',
            craftingCost: { gold: 15000 }
        },
        {
            id: 'arcanis',
            name: "Арканис",
            rarity: PET_RARITY.EPIC,
            baseGoldPerHour: 45,
            goldPerLevel: 54,
            basePower: 72,
            powerPerLevel: 216,
            icon: '🔮',
            imageUrl: 'images/pets/arcanis.png',
            craftingCost: { gold: 15000 }
        },
        {
            id: 'melentes',
            name: "Мелентес",
            rarity: PET_RARITY.EPIC,
            baseGoldPerHour: 29,
            goldPerLevel: 36,
            basePower: 50,
            powerPerLevel: 150,
            icon: '🌙',
            imageUrl: 'images/pets/melentes.png',
            craftingCost: { gold: 15000 }
        },
        {
            id: 'artemion',
            name: "Артемион",
            rarity: PET_RARITY.EPIC,
            baseGoldPerHour: 25,
            goldPerLevel: 24,
            basePower: 45,
            powerPerLevel: 135,
            icon: '🏹',
            imageUrl: 'images/pets/artemion.png',
            craftingCost: { gold: 15000 }
        },
        {
            id: 'lumino',
            name: "Люмино",
            rarity: PET_RARITY.EPIC,
            baseGoldPerHour: 17,
            goldPerLevel: 15,
            basePower: 30,
            powerPerLevel: 90,
            icon: '💡',
            imageUrl: 'images/pets/lumino.png',
            craftingCost: { gold: 15000 }
        }
    ],
    
    // Легендарные
    LEGENDARY: [
        {
            id: 'butch',
            name: "Бутч",
            rarity: PET_RARITY.LEGENDARY,
            baseGoldPerHour: 46,
            goldPerLevel: 76,
            basePower: 73,
            powerPerLevel: 293,
            icon: '🐕',
            imageUrl: 'images/pets/butch.png',
            craftingCost: { gold: 30000 }
        },
        {
            id: 'gansta',
            name: "Ганста",
            rarity: PET_RARITY.LEGENDARY,
            baseGoldPerHour: 42,
            goldPerLevel: 80,
            basePower: 70,
            powerPerLevel: 280,
            icon: '🕶️',
            imageUrl: 'images/pets/gansta.png',
            craftingCost: { gold: 30000 }
        },
        {
            id: 'borelias',
            name: "Борелиас",
            rarity: PET_RARITY.LEGENDARY,
            baseGoldPerHour: 38,
            goldPerLevel: 84,
            basePower: 65,
            powerPerLevel: 260,
            icon: '🌪️',
            imageUrl: 'images/pets/borelias.png',
            craftingCost: { gold: 30000 }
        },
        {
            id: 'astralis',
            name: "Астралис",
            rarity: PET_RARITY.LEGENDARY,
            baseGoldPerHour: 22,
            goldPerLevel: 20,
            basePower: 40,
            powerPerLevel: 640,
            icon: '⭐',
            imageUrl: 'images/pets/astralis.png',
            craftingCost: { gold: 30000 }
        },
        {
            id: 'kriolan',
            name: "Криолан",
            rarity: PET_RARITY.LEGENDARY,
            baseGoldPerHour: 26,
            goldPerLevel: 36,
            basePower: 45,
            powerPerLevel: 180,
            icon: '❄️',
            imageUrl: 'images/pets/kriolan.png',
            craftingCost: { gold: 30000 }
        }
    ],
    
    // Бессмертные
    IMMORTAL: [
        {
            id: 'arghentis',
            name: "Аргентис",
            rarity: PET_RARITY.IMMORTAL,
            baseGoldPerHour: 32,
            goldPerLevel: 75,
            basePower: 55,
            powerPerLevel: 275,
            icon: '🛡️',
            imageUrl: 'images/pets/arghentis.png',
            craftingCost: { gold: 50000 }
        },
        {
            id: 'ruby',
            name: "Руби",
            rarity: PET_RARITY.IMMORTAL,
            baseGoldPerHour: 30,
            goldPerLevel: 65,
            basePower: 50,
            powerPerLevel: 250,
            icon: '💎',
            imageUrl: 'images/pets/ruby.png',
            craftingCost: { gold: 50000 }
        },
        {
            id: 'derdar',
            name: "Дердар",
            rarity: PET_RARITY.IMMORTAL,
            baseGoldPerHour: 47,
            goldPerLevel: 100,
            basePower: 74,
            powerPerLevel: 370,
            icon: '👑',
            imageUrl: 'images/pets/derdar.png',
            craftingCost: { gold: 50000 }
        }
    ]
};

// Карта редкостей для крафта
const CRAFTING_MAP = {
    [PET_RARITY.COMMON]: PET_RARITY.RARE,
    [PET_RARITY.RARE]: PET_RARITY.EPIC,
    [PET_RARITY.EPIC]: PET_RARITY.LEGENDARY,
    [PET_RARITY.LEGENDARY]: PET_RARITY.IMMORTAL,
    [PET_RARITY.IMMORTAL]: null // Нельзя крафтить дальше
};

// Цвета для редкости
const RARITY_COLORS = {
    [PET_RARITY.COMMON]: '#6b7280',
    [PET_RARITY.RARE]: '#3b82f6',
    [PET_RARITY.EPIC]: '#8b5cf6',
    [PET_RARITY.LEGENDARY]: '#f59e0b',
    [PET_RARITY.IMMORTAL]: '#ef4444'
};

// Русские названия редкостей
const RARITY_NAMES_RU = {
    [PET_RARITY.COMMON]: 'Обычный',
    [PET_RARITY.RARE]: 'Редкий',
    [PET_RARITY.EPIC]: 'Эпический',
    [PET_RARITY.LEGENDARY]: 'Легендарный',
    [PET_RARITY.IMMORTAL]: 'Бессмертный'
};

// Начальные питомцы (примерный стартовый набор)
const INITIAL_PETS = [
    {
        ...PETS_DATABASE.COMMON[0],
        level: 1,
        xp: 0,
        totalXP: 0,
        uniqueId: 'gaderion_1'
    },
    {
        ...PETS_DATABASE.RARE[0],
        level: 1,
        xp: 0,
        totalXP: 0,
        uniqueId: 'ignis_1'
    },
    {
        ...PETS_DATABASE.RARE[1],
        level: 1,
        xp: 0,
        totalXP: 0,
        uniqueId: 'runiel_1'
    },
    {
        ...PETS_DATABASE.RARE[2],
        level: 1,
        xp: 0,
        totalXP: 0,
        uniqueId: 'chronos_1'
    },
    {
        ...PETS_DATABASE.EPIC[0],
        level: 1,
        xp: 0,
        totalXP: 0,
        uniqueId: 'chippy_1'
    }
];