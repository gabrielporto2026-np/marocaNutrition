// export.js - Sistema de Exportação Maroca Nutrition

class MarocaExporter {
    constructor(db, app) {
        this.db = db;
        this.app = app;
    }

    // ===== EXPORTAÇÃO DE CARDÁPIOS =====
    exportMenusToCSV() {
        const menus = this.db.getAll('menus');
        const clients = this.db.getAll('clients');
        
        if (menus.length === 0) {
            this.app.showMessage('Nenhum cardápio para exportar.', 'info', 'menus');
            return;
        }
        
        const headers = [
            'ID', 'Nome do Cardápio', 'Cliente', 'Email do Cliente', 'Objetivo',
            'Descrição', 'Duração (dias)', 'Calorias Diárias', 'Proteínas (g/dia)',
            'Carboidratos (g/dia)', 'Gorduras (g/dia)', 'Data de Criação', 'Refeições'
        ];
        
        const csvData = menus.map(menu => {
            const client = clients.find(c => c.id === menu.client_id);
            const mealsString = Object.entries(menu.meals)
                .map(([time, meal]) => `${time}: ${meal}`)
                .join(' | ');
            
            return [
                menu.id,
                `"${menu.name}"`,
                `"${client ? client.name : 'Não encontrado'}"`,
                `"${client ? client.email : ''}"`,
                `"${this.app.getObjectiveText(menu.objective)}"`,
                `"${menu.description}"`,
                menu.days,
                menu.total_calories,
                menu.total_protein,
                menu.total_carbs,
                menu.total_fat,
                menu.created_at,
                `"${mealsString}"`
            ];
        });
        
        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');
        
        this.downloadCSV(csvContent, `maroca-cardapios-${new Date().toISOString().split('T')[0]}.csv`);
        this.app.showMessage(`${menus.length} cardápio(s) exportado(s) com sucesso!`, 'success', 'menus');
    }

    exportMenusToJSON() {
        const menus = this.db.getAll('menus');
        const clients = this.db.getAll('clients');
        
        if (menus.length === 0) {
            this.app.showMessage('Nenhum cardápio para exportar.', 'info', 'menus');
            return;
        }
        
        const exportData = menus.map(menu => {
            const client = clients.find(c => c.id === menu.client_id);
            
            return {
                id: menu.id,
                nome: menu.name,
                cliente: {
                    nome: client ? client.name : 'Não encontrado',
                    email: client ? client.email : '',
                    telefone: client ? client.phone : ''
                },
                objetivo: menu.objective,
                objetivo_texto: this.app.getObjectiveText(menu.objective),
                descricao: menu.description,
                duracao_dias: menu.days,
                informacoes_nutricionais: {
                    calorias_diarias: menu.total_calories,
                    proteinas_g_dia: menu.total_protein,
                    carboidratos_g_dia: menu.total_carbs,
                    gorduras_g_dia: menu.total_fat
                },
                refeicoes: Object.entries(menu.meals).map(([horario, descricao]) => ({
                    horario,
                    descricao
                })),
                data_criacao: menu.created_at
            };
        });
        
        this.downloadJSON(exportData, `maroca-cardapios-${new Date().toISOString().split('T')[0]}.json`);
        this.app.showMessage(`${menus.length} cardápio(s) exportado(s) como JSON!`, 'success', 'menus');
    }

    // ===== EXPORTAÇÃO DE CLIENTES =====
    exportClientsToCSV() {
        const clients = this.db.getAll('clients');
        
        if (clients.length === 0) {
            this.app.showMessage('Nenhum cliente para exportar.', 'info', 'clients');
            return;
        }
        
        const headers = [
            'ID', 'Nome Completo', 'Email', 'Telefone', 'Idade', 'Gênero',
            'Peso (kg)', 'Altura (cm)', 'IMC', 'Status IMC', 'Objetivo',
            'Nível de Atividade', 'Status', 'Data de Cadastro'
        ];
        
        const csvData = clients.map(client => {
            const imcStatus = client.imc < 18.5 ? "Abaixo do peso" :
                            client.imc < 25 ? "Peso normal" :
                            client.imc < 30 ? "Sobrepeso" : "Obesidade";
            
            return [
                client.id,
                `"${client.name}"`,
                `"${client.email}"`,
                `"${client.phone}"`,
                client.age,
                client.gender === 'M' ? 'Masculino' : client.gender === 'F' ? 'Feminino' : 'Outro',
                client.weight,
                client.height,
                client.imc,
                `"${imcStatus}"`,
                `"${this.app.getObjectiveText(client.objective)}"`,
                `"${client.activity_level}"`,
                `"${client.status === 'ativo' ? 'Ativo' : 'Inativo'}"`,
                client.created_at || 'Não informado'
            ];
        });
        
        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');
        
        this.downloadCSV(csvContent, `maroca-clientes-${new Date().toISOString().split('T')[0]}.csv`);
        this.app.showMessage(`${clients.length} cliente(s) exportado(s) com sucesso!`, 'success', 'clients');
    }

    exportClientsToJSON() {
        const clients = this.db.getAll('clients');
        
        if (clients.length === 0) {
            this.app.showMessage('Nenhum cliente para exportar.', 'info', 'clients');
            return;
        }
        
        const exportData = clients.map(client => {
            const imcStatus = client.imc < 18.5 ? "Abaixo do peso" :
                            client.imc < 25 ? "Peso normal" :
                            client.imc < 30 ? "Sobrepeso" : "Obesidade";
            
            const menus = this.db.getMenusByClient(client.id);
            
            return {
                id: client.id,
                informacoes_pessoais: {
                    nome: client.name,
                    email: client.email,
                    telefone: client.phone,
                    idade: client.age,
                    genero: client.gender === 'M' ? 'Masculino' : client.gender === 'F' ? 'Feminino' : 'Outro'
                },
                avaliacao_nutricional: {
                    peso_kg: client.weight,
                    altura_cm: client.height,
                    imc: client.imc,
                    status_imc: imcStatus
                },
                objetivos: {
                    principal: client.objective,
                    principal_texto: this.app.getObjectiveText(client.objective),
                    nivel_atividade: client.activity_level
                },
                cardapios_ativos: menus.length,
                lista_cardapios: menus.map(menu => ({
                    id: menu.id,
                    nome: menu.name,
                    duracao_dias: menu.days,
                    calorias_diarias: menu.total_calories
                })),
                status: client.status === 'ativo' ? 'Ativo' : 'Inativo',
                data_cadastro: client.created_at || new Date().toISOString().split('T')[0]
            };
        });
        
        this.downloadJSON(exportData, `maroca-clientes-${new Date().toISOString().split('T')[0]}.json`);
        this.app.showMessage(`${clients.length} cliente(s) exportado(s) como JSON!`, 'success', 'clients');
    }

    // ===== EXPORTAÇÃO DE ALIMENTOS =====
    exportFoodsToCSV() {
        const foods = this.db.getAll('foods');
        
        if (foods.length === 0) {
            this.app.showMessage('Nenhum alimento para exportar.', 'info', 'foods');
            return;
        }
        
        const headers = [
            'ID', 'Nome do Alimento', 'Categoria', 'Calorias (100g)',
            'Proteínas (g/100g)', 'Carboidratos (g/100g)', 'Gorduras (g/100g)',
            'Medida', 'Quantidade por Medida', 'Data de Cadastro', 'Recomendações de Uso'
        ];
        
        const csvData = foods.map(food => {
            let recomendacoes = this.getFoodRecommendations(food.category);
            
            return [
                food.id,
                `"${food.name}"`,
                `"${food.category}"`,
                food.calories,
                food.protein,
                food.carbs,
                food.fat,
                food.measure || '100g',
                food.measure_qty || 100,
                food.created_at || 'Não informado',
                `"${recomendacoes}"`
            ];
        });
        
        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');
        
        this.downloadCSV(csvContent, `maroca-alimentos-${new Date().toISOString().split('T')[0]}.csv`);
        this.app.showMessage(`${foods.length} alimento(s) exportado(s) com sucesso!`, 'success', 'foods');
    }

    exportFoodsToJSON() {
        const foods = this.db.getAll('foods');
        
        if (foods.length === 0) {
            this.app.showMessage('Nenhum alimento para exportar.', 'info', 'foods');
            return;
        }
        
        const exportData = foods.map(food => {
            const { recomendacoes, exemplos_uso } = this.getFoodUsageDetails(food.category);
            
            return {
                id: food.id,
                nome: food.name,
                categoria: food.category,
                informacao_nutricional: {
                    calorias_por_100g: food.calories,
                    proteinas_g_por_100g: food.protein,
                    carboidratos_g_por_100g: food.carbs,
                    gorduras_g_por_100g: food.fat,
                    medida_padrao: food.measure || '100g',
                    quantidade_medida: food.measure_qty || 100
                },
                recomendacoes: {
                    descricao: recomendacoes,
                    exemplos_uso: exemplos_uso,
                    melhor_consumo: this.getBestConsumptionTime(food.category)
                },
                data_cadastro: food.created_at || new Date().toISOString().split('T')[0]
            };
        });
        
        this.downloadJSON(exportData, `maroca-alimentos-${new Date().toISOString().split('T')[0]}.json`);
        this.app.showMessage(`${foods.length} alimento(s) exportado(s) como JSON!`, 'success', 'foods');
    }

    // ===== FUNÇÕES AUXILIARES =====
    getFoodRecommendations(category) {
        const recommendations = {
            'Cereais e derivados': 'Base para refeições principais, acompanhamentos',
            'Frutas': 'Lanches, sobremesas, vitaminas',
            'Verduras e legumes': 'Saladas, acompanhamentos, sopas',
            'Carnes e ovos': 'Refeições principais, fontes de proteína',
            'Leite e derivados': 'Café da manhã, lanches, preparações',
            'Óleos e gorduras': 'Moderação em todas as refeições',
            'Leguminosas': 'Fontes de proteína vegetal e fibras'
        };
        
        return recommendations[category] || 'Uso geral em preparações';
    }

    getFoodUsageDetails(category) {
        switch(category) {
            case 'Cereais e derivados':
                return {
                    recomendacoes: 'Base energética para refeições',
                    exemplos_uso: ['Arroz integral no almoço', 'Aveia no café da manhã', 'Pão integral nos lanches']
                };
            case 'Frutas':
                return {
                    recomendacoes: 'Fonte de vitaminas e fibras',
                    exemplos_uso: ['Lanches entre refeições', 'Sobremesas naturais', 'Vitaminas e sucos']
                };
            case 'Verduras e legumes':
                return {
                    recomendacoes: 'Fonte de fibras e micronutrientes',
                    exemplos_uso: ['Saladas cruas', 'Legumes cozidos', 'Sopas e cremes']
                };
            case 'Carnes e ovos':
                return {
                    recomendacoes: 'Fonte principal de proteínas',
                    exemplos_uso: ['Refeições principais', 'Sanduíches', 'Omeletes']
                };
            case 'Leite e derivados':
                return {
                    recomendacoes: 'Fonte de cálcio e proteínas',
                    exemplos_uso: ['Café da manhã', 'Lanches', 'Ingrediente em receitas']
                };
            default:
                return {
                    recomendacoes: 'Uso geral na alimentação',
                    exemplos_uso: ['Preparações variadas']
                };
        }
    }

    getBestConsumptionTime(category) {
        const times = {
            'Cereais e derivados': 'Café da manhã, almoço e jantar',
            'Frutas': 'Lanches entre refeições',
            'Verduras e legumes': 'Almoço e jantar',
            'Carnes e ovos': 'Almoço e jantar',
            'Leite e derivados': 'Café da manhã e lanches',
            'Óleos e gorduras': 'Moderação em todas as refeições',
            'Leguminosas': 'Almoço e jantar'
        };
        
        return times[category] || 'Ao longo do dia';
    }

    // ===== FUNÇÕES DE DOWNLOAD =====
    downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }

    downloadJSON(data, filename) {
        const content = JSON.stringify(data, null, 2);
        const blob = new Blob([content], { type: 'application/json;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }

    // ===== EXPORTAÇÃO DE RELATÓRIO COMPLETO =====
    exportCompleteReport() {
        const stats = this.db.getDashboardStats();
        const clients = this.db.getAll('clients');
        const foods = this.db.getAll('foods');
        const menus = this.db.getAll('menus');
        
        const report = {
            cabecalho: {
                titulo: "Relatório Completo - Maroca Nutrition",
                data_geracao: new Date().toISOString(),
                nutricionista: "Sistema Maroca Nutrition"
            },
            resumo_estatisticas: {
                total_clientes: stats.total_clients,
                clientes_ativos: stats.active_clients,
                total_cardapios: stats.total_menus,
                total_alimentos: stats.total_foods
            },
            analise_clientes: clients.map(client => ({
                nome: client.name,
                objetivo: client.objective,
                imc: client.imc,
                idade: client.age
            })),
            inventario_alimentos: {
                total_categorias: [...new Set(foods.map(f => f.category))].length,
                alimentos_por_categoria: this.countFoodsByCategory(foods)
            },
            desempenho_cardapios: {
                total: menus.length,
                media_duracao: this.calculateAverageDays(menus),
                distribuicao_objetivos: this.countMenusByObjective(menus)
            }
        };
        
        this.downloadJSON(report, `relatorio-maroca-${new Date().toISOString().split('T')[0]}.json`);
        this.app.showMessage('Relatório completo exportado com sucesso!', 'success');
    }

    countFoodsByCategory(foods) {
        const count = {};
        foods.forEach(food => {
            count[food.category] = (count[food.category] || 0) + 1;
        });
        return count;
    }

    calculateAverageDays(menus) {
        if (menus.length === 0) return 0;
        const totalDays = menus.reduce((sum, menu) => sum + menu.days, 0);
        return (totalDays / menus.length).toFixed(1);
    }

    countMenusByObjective(menus) {
        const count = {};
        menus.forEach(menu => {
            count[menu.objective] = (count[menu.objective] || 0) + 1;
        });
        return count;
    }
}

// Exportar a classe para uso global
if (typeof window !== 'undefined') {
    window.MarocaExporter = MarocaExporter;
}