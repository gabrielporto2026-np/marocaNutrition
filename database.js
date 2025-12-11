// ============================================
// MAROCA NUTRITION - BANCO DE DADOS
// ============================================
// Este arquivo simula um banco de dados SQL
// Em produção, substituir por conexão com MySQL/PostgreSQL
// ============================================

class MarocaDatabase {
    constructor() {
        this.initDatabase();
    }

    // ===== INICIALIZAÇÃO DO BANCO =====
    initDatabase() {
        // Verificar se já foi inicializado
        if (!localStorage.getItem('maroca_db_initialized')) {
            console.log('Inicializando banco de dados Maroca Nutrition...');
            
            // Dados de exemplo para nutrição
            this.initializeSampleData();
            
            localStorage.setItem('maroca_db_initialized', 'true');
            console.log('Banco de dados inicializado com sucesso!');
        }
    }

    // ===== DADOS DE EXEMPLO =====
    initializeSampleData() {
        // Alimentos com informações nutricionais completas
        const foods = [
            {
                id: 1,
                name: "Arroz integral cozido",
                category: "Cereais e derivados",
                calories: 124,
                protein: 2.6,
                carbs: 25.8,
                fat: 1.0,
                fiber: 1.8,
                measure: "colher de sopa",
                measure_qty: 1,
                created_at: "2023-10-01"
            },
            {
                id: 2,
                name: "Frango grelhado (peito)",
                category: "Carnes e ovos",
                calories: 165,
                protein: 31.0,
                carbs: 0,
                fat: 3.6,
                fiber: 0,
                measure: "g",
                measure_qty: 100,
                created_at: "2023-10-01"
            },
            {
                id: 3,
                name: "Banana prata",
                category: "Frutas",
                calories: 89,
                protein: 1.1,
                carbs: 22.8,
                fat: 0.3,
                fiber: 2.6,
                measure: "unidade",
                measure_qty: 1,
                created_at: "2023-10-01"
            },
            {
                id: 4,
                name: "Brócolis cozido",
                category: "Verduras e legumes",
                calories: 34,
                protein: 2.8,
                carbs: 6.6,
                fat: 0.4,
                fiber: 3.5,
                measure: "xícara",
                measure_qty: 1,
                created_at: "2023-10-01"
            },
            {
                id: 5,
                name: "Ovo cozido",
                category: "Carnes e ovos",
                calories: 155,
                protein: 13.0,
                carbs: 1.1,
                fat: 11.0,
                fiber: 0,
                measure: "unidade",
                measure_qty: 1,
                created_at: "2023-10-01"
            },
            {
                id: 6,
                name: "Queijo minas frescal",
                category: "Leite e derivados",
                calories: 320,
                protein: 21.0,
                carbs: 3.0,
                fat: 25.0,
                fiber: 0,
                measure: "fatia",
                measure_qty: 1,
                created_at: "2023-10-01"
            },
            {
                id: 7,
                name: "Aveia em flocos",
                category: "Cereais e derivados",
                calories: 394,
                protein: 13.9,
                carbs: 66.2,
                fat: 8.2,
                fiber: 10.6,
                measure: "colher de sopa",
                measure_qty: 1,
                created_at: "2023-10-01"
            },
            {
                id: 8,
                name: "Batata doce cozida",
                category: "Leguminosas",
                calories: 86,
                protein: 1.6,
                carbs: 20.1,
                fat: 0.1,
                fiber: 3.0,
                measure: "fatia média",
                measure_qty: 1,
                created_at: "2023-10-01"
            },
            {
                id: 9,
                name: "Salmão grelhado",
                category: "Carnes e ovos",
                calories: 206,
                protein: 22.0,
                carbs: 0,
                fat: 13.0,
                fiber: 0,
                measure: "g",
                measure_qty: 100,
                created_at: "2023-10-01"
            },
            {
                id: 10,
                name: "Abacate",
                category: "Frutas",
                calories: 160,
                protein: 2.0,
                carbs: 8.5,
                fat: 14.7,
                fiber: 6.7,
                measure: "fatia",
                measure_qty: 1,
                created_at: "2023-10-01"
            }
        ];

        // Clientes
        const clients = [
            {
                id: 1,
                name: "Ana Silva Costa",
                email: "ana.silva@email.com",
                phone: "(11) 98765-4321",
                age: 32,
                gender: "F",
                weight: 68.5,
                height: 165,
                objective: "emagrecimento",
                activity_level: "moderado",
                imc: 25.2,
                status: "ativo",
                created_at: "2023-09-15"
            },
            {
                id: 2,
                name: "Carlos Santos Almeida",
                email: "carlos.s@email.com",
                phone: "(11) 91234-5678",
                age: 28,
                gender: "M",
                weight: 75.0,
                height: 178,
                objective: "hipertrofia",
                activity_level: "intenso",
                imc: 23.7,
                status: "ativo",
                created_at: "2023-09-20"
            },
            {
                id: 3,
                name: "Mariana Costa Lima",
                email: "mariana.c@email.com",
                phone: "(11) 99876-5432",
                age: 45,
                gender: "F",
                weight: 62.0,
                height: 160,
                objective: "saude",
                activity_level: "leve",
                imc: 24.2,
                status: "ativo",
                created_at: "2023-09-25"
            }
        ];

        // Cardápios
        const menus = [
            {
                id: 1,
                name: "Cardápio Emagrecimento 1500kcal",
                client_id: 1,
                nutritionist_id: 1,
                description: "Cardápio para perda de peso com déficit calórico moderado",
                days: 7,
                total_calories: 1500,
                total_protein: 90,
                total_carbs: 150,
                total_fat: 50,
                objective: "emagrecimento",
                status: "ativo",
                created_at: "2023-10-15",
                meals: {
                    "Café da manhã (8h)": "1 xícara de café com adoçante, 2 fatias de pão integral, 1 fatia de queijo minas, 1 fatia de peito de peru",
                    "Lanche da manhã (10h)": "1 banana, 1 colher de sopa de aveia",
                    "Almoço (13h)": "1 filé de frango grelhado (130g), 4 colheres de sopa de arroz integral, 1 concha de feijão, Salada de brócolis à vontade",
                    "Lanche da tarde (16h)": "1 iogurte natural desnatado, 1 colher de sopa de granola",
                    "Jantar (20h)": "1 filé de peixe assado (150g), Salada verde à vontade, 3 colheres de sopa de purê de batata doce"
                }
            },
            {
                id: 2,
                name: "Cardápio Hipertrofia 2800kcal",
                client_id: 2,
                nutritionist_id: 1,
                description: "Cardápio para ganho de massa muscular com superávit calórico",
                days: 5,
                total_calories: 2800,
                total_protein: 160,
                total_carbs: 320,
                total_fat: 80,
                objective: "hipertrofia",
                status: "ativo",
                created_at: "2023-10-18",
                meals: {
                    "Café da manhã (7h)": "3 ovos mexidos, 2 fatias de pão integral, 1 banana, 1 copo de leite desnatado",
                    "Lanche da manhã (10h)": "1 porção de whey protein, 1 maçã",
                    "Almoço (13h)": "200g de carne vermelha magra, 6 colheres de sopa de arroz integral, 1 concha de feijão, Legumes cozidos à vontade",
                    "Pré-treino (16h)": "1 xícara de café, 1 fatia de pão com geleia",
                    "Pós-treino (19h)": "1 porção de whey protein, 1 banana",
                    "Jantar (21h)": "150g de frango grelhado, Batata doce média, Salada verde à vontade",
                    "Ceia (23h)": "1 iogurte grego, 1 colher de sopa de pasta de amendoim"
                }
            }
        ];

        // Modelos de cardápio
        const templates = [
            {
                id: 1,
                name: "Modelo Emagrecimento 1500kcal",
                description: "Modelo básico para perda de peso",
                objective: "emagrecimento",
                calories: 1500,
                is_public: true,
                created_at: "2023-10-01"
            },
            {
                id: 2,
                name: "Modelo Hipertrofia 2800kcal",
                description: "Modelo para ganho de massa muscular",
                objective: "hipertrofia",
                calories: 2800,
                is_public: true,
                created_at: "2023-10-01"
            }
        ];

        // Salvar dados no localStorage
        localStorage.setItem('maroca_foods', JSON.stringify(foods));
        localStorage.setItem('maroca_clients', JSON.stringify(clients));
        localStorage.setItem('maroca_menus', JSON.stringify(menus));
        localStorage.setItem('maroca_templates', JSON.stringify(templates));
        localStorage.setItem('maroca_nutritionists', JSON.stringify([{
            id: 1,
            name: "Maria Oliveira",
            email: "maria@marocanutrition.com",
            crn: "CRN-5 12345",
            specialization: "Nutrição Esportiva"
        }]));
    }

    // ===== MÉTODOS CRUD GENÉRICOS =====
    getAll(table) {
        const data = localStorage.getItem(`maroca_${table}`);
        return data ? JSON.parse(data) : [];
    }

    getById(table, id) {
        const items = this.getAll(table);
        return items.find(item => item.id === parseInt(id));
    }

    create(table, data) {
        const items = this.getAll(table);
        const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
        
        const newItem = {
            id: newId,
            created_at: new Date().toISOString().split('T')[0],
            updated_at: new Date().toISOString().split('T')[0],
            ...data
        };
        
        items.push(newItem);
        localStorage.setItem(`maroca_${table}`, JSON.stringify(items));
        
        return newItem;
    }

    update(table, id, data) {
        const items = this.getAll(table);
        const index = items.findIndex(item => item.id === parseInt(id));
        
        if (index === -1) return null;
        
        items[index] = {
            ...items[index],
            ...data,
            updated_at: new Date().toISOString().split('T')[0]
        };
        
        localStorage.setItem(`maroca_${table}`, JSON.stringify(items));
        return items[index];
    }

    delete(table, id) {
        const items = this.getAll(table);
        const filteredItems = items.filter(item => item.id !== parseInt(id));
        
        localStorage.setItem(`maroca_${table}`, JSON.stringify(filteredItems));
        return true;
    }

    // ===== MÉTODOS ESPECÍFICOS =====
    searchFoods(query) {
        const foods = this.getAll('foods');
        if (!query) return foods;
        
        return foods.filter(food => 
            food.name.toLowerCase().includes(query.toLowerCase()) ||
            food.category.toLowerCase().includes(query.toLowerCase())
        );
    }

    getMenusByClient(clientId) {
        const menus = this.getAll('menus');
        return menus.filter(menu => menu.client_id === parseInt(clientId));
    }

    getClientsByObjective(objective) {
        const clients = this.getAll('clients');
        if (!objective) return clients;
        
        return clients.filter(client => client.objective === objective);
    }

    // ===== MÉTODOS DE RELATÓRIO =====
    getDashboardStats() {
        const menus = this.getAll('menus');
        const clients = this.getAll('clients');
        const foods = this.getAll('foods');
        
        return {
            total_menus: menus.length,
            total_clients: clients.length,
            total_foods: foods.length,
            active_clients: clients.filter(c => c.status === 'ativo').length,
            recent_menus: menus.slice(-3).reverse()
        };
    }

    // ===== MÉTODOS DE NUTRIÇÃO =====
    calculateIMC(weight, height) {
        const heightM = height / 100;
        return (weight / (heightM * heightM)).toFixed(1);
    }

    calculateCalorieNeeds(client) {
        // Fórmula simplificada de Harris-Benedict
        let bmr;
        
        if (client.gender === 'M') {
            bmr = 88.36 + (13.4 * client.weight) + (4.8 * client.height) - (5.7 * client.age);
        } else {
            bmr = 447.6 + (9.2 * client.weight) + (3.1 * client.height) - (4.3 * client.age);
        }
        
        // Multiplicador de atividade
        const activityMultipliers = {
            'sedentario': 1.2,
            'leve': 1.375,
            'moderado': 1.55,
            'intenso': 1.725,
            'muito_intenso': 1.9
        };
        
        const tdee = bmr * (activityMultipliers[client.activity_level] || 1.2);
        
        // Ajuste por objetivo
        const objectiveAdjustments = {
            'emagrecimento': 0.85,  // -15%
            'manutencao': 1.0,      // Manutenção
            'hipertrofia': 1.15,    // +15%
            'saude': 1.0
        };
        
        return Math.round(tdee * (objectiveAdjustments[client.objective] || 1.0));
    }
}

// ===== INSTÂNCIA GLOBAL =====
const marocaDB = new MarocaDatabase();

// ===== ESQUEMA SQL PARA IMPLANTAÇÃO FUTURA =====
const SQL_SCHEMA = `
-- Tabela de nutricionistas
CREATE TABLE nutritionists (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    crn VARCHAR(50) UNIQUE NOT NULL,
    phone VARCHAR(20),
    specialization VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de clientes
CREATE TABLE clients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nutritionist_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    birth_date DATE,
    gender ENUM('M', 'F', 'O'),
    height DECIMAL(5,2),
    weight DECIMAL(5,2),
    activity_level ENUM('sedentario', 'leve', 'moderado', 'intenso', 'muito_intenso'),
    objective ENUM('emagrecimento', 'hipertrofia', 'manutencao', 'saude', 'performance'),
    restrictions TEXT,
    notes TEXT,
    status ENUM('ativo', 'inativo', 'pendente') DEFAULT 'ativo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (nutritionist_id) REFERENCES nutritionists(id) ON DELETE CASCADE,
    INDEX idx_nutritionist (nutritionist_id),
    INDEX idx_status (status)
);

-- Tabela de alimentos
CREATE TABLE foods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    calories_per_100g DECIMAL(7,2),
    protein_g DECIMAL(7,2),
    carbs_g DECIMAL(7,2),
    fat_g DECIMAL(7,2),
    fiber_g DECIMAL(7,2),
    sodium_mg DECIMAL(7,2),
    measure_unit VARCHAR(20),
    measure_quantity DECIMAL(7,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_name (name)
);

-- Tabela de cardápios
CREATE TABLE menus (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nutritionist_id INT NOT NULL,
    client_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    objective VARCHAR(50),
    days INT,
    total_calories INT,
    total_protein DECIMAL(7,2),
    total_carbs DECIMAL(7,2),
    total_fat DECIMAL(7,2),
    status ENUM('rascunho', 'ativo', 'inativo') DEFAULT 'rascunho',
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (nutritionist_id) REFERENCES nutritionists(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    INDEX idx_client (client_id),
    INDEX idx_status (status)
);

-- Tabela de refeições do cardápio
CREATE TABLE menu_meals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    menu_id INT NOT NULL,
    day_number INT,
    meal_type ENUM('cafe_manha', 'lanche_manha', 'almoco', 'lanche_tarde', 'jantar', 'ceia'),
    meal_time TIME,
    description TEXT,
    calories INT,
    protein DECIMAL(7,2),
    carbs DECIMAL(7,2),
    fat DECIMAL(7,2),
    notes TEXT,
    FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE,
    INDEX idx_menu (menu_id),
    INDEX idx_day (day_number)
);

-- Tabela de itens da refeição
CREATE TABLE meal_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    meal_id INT NOT NULL,
    food_id INT,
    food_name VARCHAR(100),
    quantity DECIMAL(7,2),
    unit VARCHAR(20),
    calories INT,
    protein DECIMAL(7,2),
    carbs DECIMAL(7,2),
    fat DECIMAL(7,2),
    notes TEXT,
    FOREIGN KEY (meal_id) REFERENCES menu_meals(id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE SET NULL,
    INDEX idx_meal (meal_id)
);

-- Tabela de modelos de cardápio
CREATE TABLE menu_templates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nutritionist_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    objective VARCHAR(50),
    calories INT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (nutritionist_id) REFERENCES nutritionists(id) ON DELETE CASCADE,
    INDEX idx_nutritionist (nutritionist_id)
);

-- Tabela de acompanhamento do cliente
CREATE TABLE client_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL,
    measurement_date DATE NOT NULL,
    weight DECIMAL(5,2),
    body_fat_percentage DECIMAL(4,2),
    measurements JSON,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    INDEX idx_client (client_id),
    INDEX idx_date (measurement_date)
);

-- Tabela de consultas
CREATE TABLE consultations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nutritionist_id INT NOT NULL,
    client_id INT NOT NULL,
    consultation_date DATETIME NOT NULL,
    duration_minutes INT,
    type ENUM('presencial', 'online', 'telefone'),
    notes TEXT,
    status ENUM('agendada', 'realizada', 'cancelada', 'remarcada') DEFAULT 'agendada',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (nutritionist_id) REFERENCES nutritionists(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    INDEX idx_client (client_id),
    INDEX idx_date (consultation_date),
    INDEX idx_status (status)
);
`;