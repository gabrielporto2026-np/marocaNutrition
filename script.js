// ===== FUNÇÕES DE VISUALIZAÇÃO/EDIÇÃO =====
viewMenu(menuId) {
    const menu = this.db.getById('menus', menuId);
    if (!menu) {
        this.showMessage('Cardápio não encontrado!', 'error', 'menus');
        return;
    }
    
    const client = this.db.getById('clients', menu.client_id);
    
    let content = `
        <p><strong>Cliente:</strong> ${client ? client.name : 'Cliente não encontrado'}</p>
        <p><strong>Objetivo:</strong> ${this.getObjectiveText(menu.objective)}</p>
        <p><strong>Descrição:</strong> ${menu.description}</p>
        <p><strong>Duração:</strong> ${menu.days} dias</p>
        <p><strong>Calorias diárias:</strong> ${menu.total_calories} kcal</p>
        <p><strong>Proteínas:</strong> ${menu.total_protein}g</p>
        <p><strong>Carboidratos:</strong> ${menu.total_carbs}g</p>
        <p><strong>Gorduras:</strong> ${menu.total_fat}g</p>
        <p><strong>Criado em:</strong> ${menu.created_at}</p>
        
        <h4 style="margin-top: 25px; margin-bottom: 15px;">Plano Alimentar Diário:</h4>
    `;
    
    for (const [time, meal] of Object.entries(menu.meals)) {
        content += `
            <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
                <strong style="color: var(--primary-color);">${time}:</strong>
                <p style="margin-top: 5px;">${meal}</p>
            </div>
        `;
    }
    
    document.getElementById('view-menu-title').textContent = menu.name;
    document.getElementById('view-menu-content').innerHTML = content;
    this.openModal('view-menu-modal');
}

editMenu(menuId) {
    const menu = this.db.getById('menus', menuId);
    if (!menu) {
        this.showMessage('Cardápio não encontrado!', 'error', 'menus');
        return;
    }
    
    const clients = this.db.getAll('clients');
    
    let content = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-header">
                <h3>Editar Cardápio: ${menu.name}</h3>
            </div>
            <form id="edit-menu-form">
                <input type="hidden" id="edit-menu-id" value="${menu.id}">
                
                <div class="form-group">
                    <label for="edit-menu-name">Nome do Cardápio *</label>
                    <input type="text" id="edit-menu-name" class="form-control" value="${menu.name}" required>
                </div>
                
                <div class="form-group">
                    <label for="edit-menu-client">Cliente *</label>
                    <select id="edit-menu-client" class="form-control" required>
                        <option value="">Selecione um cliente</option>
                        ${clients.map(client => `
                            <option value="${client.id}" ${client.id === menu.client_id ? 'selected' : ''}>
                                ${client.name}
                            </option>
                        `).join('')}
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="edit-menu-objective">Objetivo</label>
                    <select id="edit-menu-objective" class="form-control">
                        <option value="emagrecimento" ${menu.objective === 'emagrecimento' ? 'selected' : ''}>Emagrecimento</option>
                        <option value="hipertrofia" ${menu.objective === 'hipertrofia' ? 'selected' : ''}>Hipertrofia</option>
                        <option value="saude" ${menu.objective === 'saude' ? 'selected' : ''}>Saúde</option>
                        <option value="manutencao" ${menu.objective === 'manutencao' ? 'selected' : ''}>Manutenção</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="edit-menu-description">Descrição</label>
                    <textarea id="edit-menu-description" class="form-control" rows="3">${menu.description}</textarea>
                </div>
                
                <div class="form-group">
                    <label for="edit-menu-days">Duração (dias)</label>
                    <input type="number" id="edit-menu-days" class="form-control" value="${menu.days}" min="1" max="30">
                </div>
                
                <div class="form-group">
                    <label for="edit-menu-calories">Calorias diárias</label>
                    <input type="number" id="edit-menu-calories" class="form-control" value="${menu.total_calories}" min="800" max="5000">
                </div>
                
                <h4 style="margin-top: 20px; margin-bottom: 10px;">Refeições</h4>
    `;
    
    // Adicionar campos para cada refeição
    let mealIndex = 1;
    for (const [time, meal] of Object.entries(menu.meals)) {
        content += `
            <div class="form-group">
                <label for="edit-menu-meal-${mealIndex}">${time}</label>
                <textarea id="edit-menu-meal-${mealIndex}" class="form-control" rows="2">${meal}</textarea>
                <input type="hidden" id="edit-menu-time-${mealIndex}" value="${time}">
            </div>
        `;
        mealIndex++;
    }
    
    content += `
                <div class="form-group" style="margin-top: 25px;">
                    <button type="submit" class="btn">Salvar Alterações</button>
                    <button type="button" class="btn btn-secondary" id="cancel-edit-menu">Cancelar</button>
                </div>
            </form>
        </div>
    `;
    
    // Criar e mostrar o modal
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal';
    modalContainer.style.display = 'flex';
    modalContainer.innerHTML = content;
    
    document.body.appendChild(modalContainer);
    
    // Configurar evento do formulário
    const form = modalContainer.querySelector('#edit-menu-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveMenuEdit(menuId);
        });
    }
    
    // Configurar botão cancelar
    const cancelBtn = modalContainer.querySelector('#cancel-edit-menu');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(modalContainer);
        });
    }
    
    // Configurar fechamento do modal
    const closeBtn = modalContainer.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modalContainer);
        });
    }
    
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            document.body.removeChild(modalContainer);
        }
    });
}

saveMenuEdit(menuId) {
    try {
        const name = document.getElementById('edit-menu-name').value;
        const clientId = document.getElementById('edit-menu-client').value;
        const description = document.getElementById('edit-menu-description').value;
        const days = document.getElementById('edit-menu-days').value;
        const calories = document.getElementById('edit-menu-calories').value;
        const objective = document.getElementById('edit-menu-objective').value;
        
        if (!name || !clientId) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        // Coletar refeições
        const meals = {};
        let mealIndex = 1;
        
        // Continuar enquanto existirem campos de refeição
        while (true) {
            const timeInput = document.getElementById(`edit-menu-time-${mealIndex}`);
            const mealInput = document.getElementById(`edit-menu-meal-${mealIndex}`);
            
            if (!timeInput || !mealInput) {
                break;
            }
            
            const time = timeInput.value;
            const meal = mealInput.value;
            
            if (time && meal) {
                meals[time] = meal;
            }
            
            mealIndex++;
        }
        
        // Se não encontrou refeições, usar as padrão
        if (Object.keys(meals).length === 0) {
            meals = this.generateSampleMeals(objective);
        }
        
        const updatedMenu = {
            name,
            client_id: parseInt(clientId),
            description,
            days: parseInt(days),
            total_calories: parseInt(calories),
            total_protein: Math.round(parseInt(calories) * 0.3 / 4),
            total_carbs: Math.round(parseInt(calories) * 0.5 / 4),
            total_fat: Math.round(parseInt(calories) * 0.2 / 9),
            objective,
            meals
        };
        
        const result = this.db.update('menus', menuId, updatedMenu);
        
        if (result) {
            // Fechar modal
            const modal = document.querySelector('.modal');
            if (modal && modal.id !== 'create-menu-modal' && modal.id !== 'add-food-modal' && modal.id !== 'add-client-modal') {
                modal.remove();
            }
            
            this.showMessage(`Cardápio "${name}" atualizado com sucesso!`, 'success', 'menus');
            
            // Recarregar conteúdo
            if (this.currentPage === 'menus') {
                this.loadMenusPage();
            } else if (this.currentPage === 'dashboard') {
                this.loadDashboard();
            }
        } else {
            alert('Erro ao atualizar o cardápio. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao salvar edição do cardápio:', error);
        alert('Ocorreu um erro ao salvar as alterações. Tente novamente.');
    }
}

deleteMenu(menuId) {
    if (confirm('Tem certeza que deseja excluir este cardápio? Esta ação não pode ser desfeita.')) {
        const result = this.db.delete('menus', menuId);
        if (result) {
            this.showMessage('Cardápio excluído com sucesso!', 'success', 'menus');
            this.loadMenusPage();
        } else {
            this.showMessage('Erro ao excluir o cardápio.', 'error', 'menus');
        }
    }
}

viewClient(clientId) {
    const client = this.db.getById('clients', clientId);
    if (!client) {
        this.showMessage('Cliente não encontrado!', 'error', 'clients');
        return;
    }
    
    const menus = this.db.getMenusByClient(clientId);
    
    const imcStatus = client.imc < 18.5 ? "Abaixo do peso" :
                    client.imc < 25 ? "Peso normal" :
                    client.imc < 30 ? "Sobrepeso" : "Obesidade";
    
    let content = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-header">
                <h3>${client.name}</h3>
            </div>
            <div style="padding: 20px;">
                <h4 style="margin-bottom: 15px; color: var(--primary-color);">Informações Pessoais</h4>
                <p><strong>Email:</strong> ${client.email}</p>
                <p><strong>Telefone:</strong> ${client.phone}</p>
                <p><strong>Idade:</strong> ${client.age} anos</p>
                <p><strong>Objetivo:</strong> ${this.getObjectiveText(client.objective)}</p>
                <p><strong>Nível de atividade:</strong> ${client.activity_level}</p>
                
                <h4 style="margin-top: 25px; margin-bottom: 15px; color: var(--primary-color);">Avaliação Nutricional</h4>
                <p><strong>Peso:</strong> ${client.weight} kg</p>
                <p><strong>Altura:</strong> ${client.height} cm</p>
                <p><strong>IMC:</strong> ${client.imc} (${imcStatus})</p>
                
                <h4 style="margin-top: 25px; margin-bottom: 15px; color: var(--primary-color);">Cardápios (${menus.length})</h4>
    `;
    
    if (menus.length > 0) {
        content += '<ul style="padding-left: 20px;">';
        menus.forEach(menu => {
            content += `<li style="margin-bottom: 8px;">
                <strong>${menu.name}</strong><br>
                <small>${menu.days} dias • ${menu.total_calories} kcal/dia</small>
            </li>`;
        });
        content += '</ul>';
    } else {
        content += '<p>Nenhum cardápio criado para este cliente.</p>';
    }
    
    content += `
            </div>
            <div style="margin-top: 25px; display: flex; justify-content: flex-end; gap: 10px; padding: 0 20px 20px;">
                <button class="btn" id="create-menu-for-client">
                    <i class="fas fa-plus"></i> Criar Cardápio
                </button>
                <button class="btn btn-secondary close-modal">Fechar</button>
            </div>
        </div>
    `;
    
    // Mostrar modal dinâmico
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal';
    modalContainer.style.display = 'flex';
    modalContainer.innerHTML = content;
    
    document.body.appendChild(modalContainer);
    
    // Configurar botão de criar cardápio
    const createMenuBtn = modalContainer.querySelector('#create-menu-for-client');
    if (createMenuBtn) {
        createMenuBtn.addEventListener('click', () => {
            document.body.removeChild(modalContainer);
            this.createMenuForClient(clientId);
        });
    }
    
    // Configurar fechamento
    const closeBtn = modalContainer.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modalContainer);
        });
    }
    
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            document.body.removeChild(modalContainer);
        }
    });
}

editClient(clientId) {
    const client = this.db.getById('clients', clientId);
    if (!client) {
        this.showMessage('Cliente não encontrado!', 'error', 'clients');
        return;
    }
    
    let content = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-header">
                <h3>Editar Cliente: ${client.name}</h3>
            </div>
            <form id="edit-client-form">
                <input type="hidden" id="edit-client-id" value="${client.id}">
                
                <div class="form-group">
                    <label for="edit-client-name">Nome Completo *</label>
                    <input type="text" id="edit-client-name" class="form-control" value="${client.name}" required>
                </div>
                
                <div class="form-group">
                    <label for="edit-client-email">Email *</label>
                    <input type="email" id="edit-client-email" class="form-control" value="${client.email}" required>
                </div>
                
                <div class="form-group">
                    <label for="edit-client-phone">Telefone</label>
                    <input type="text" id="edit-client-phone" class="form-control" value="${client.phone}">
                </div>
                
                <div class="form-group">
                    <label for="edit-client-age">Idade *</label>
                    <input type="number" id="edit-client-age" class="form-control" value="${client.age}" required min="1" max="120">
                </div>
                
                <div class="form-group">
                    <label for="edit-client-weight">Peso (kg) *</label>
                    <input type="number" id="edit-client-weight" class="form-control" value="${client.weight}" required min="20" max="300" step="0.1">
                </div>
                
                <div class="form-group">
                    <label for="edit-client-height">Altura (cm) *</label>
                    <input type="number" id="edit-client-height" class="form-control" value="${client.height}" required min="50" max="250">
                </div>
                
                <div class="form-group">
                    <label for="edit-client-objective">Objetivo *</label>
                    <select id="edit-client-objective" class="form-control" required>
                        <option value="">Selecione um objetivo</option>
                        <option value="emagrecimento" ${client.objective === 'emagrecimento' ? 'selected' : ''}>Emagrecimento</option>
                        <option value="hipertrofia" ${client.objective === 'hipertrofia' ? 'selected' : ''}>Hipertrofia</option>
                        <option value="saude" ${client.objective === 'saude' ? 'selected' : ''}>Saúde</option>
                        <option value="manutencao" ${client.objective === 'manutencao' ? 'selected' : ''}>Manutenção</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="edit-client-activity">Nível de Atividade *</label>
                    <select id="edit-client-activity" class="form-control" required>
                        <option value="">Selecione um nível</option>
                        <option value="sedentario" ${client.activity_level === 'sedentario' ? 'selected' : ''}>Sedentário</option>
                        <option value="leve" ${client.activity_level === 'leve' ? 'selected' : ''}>Leve (1-2x/semana)</option>
                        <option value="moderado" ${client.activity_level === 'moderado' ? 'selected' : ''}>Moderado (3-5x/semana)</option>
                        <option value="intenso" ${client.activity_level === 'intenso' ? 'selected' : ''}>Intenso (6-7x/semana)</option>
                    </select>
                </div>
                
                <div class="form-group" style="margin-top: 25px;">
                    <button type="submit" class="btn">Salvar Alterações</button>
                    <button type="button" class="btn btn-secondary" id="cancel-edit-client">Cancelar</button>
                </div>
            </form>
        </div>
    `;
    
    // Mostrar modal de edição
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal';
    modalContainer.style.display = 'flex';
    modalContainer.innerHTML = content;
    
    document.body.appendChild(modalContainer);
    
    // Configurar evento do formulário
    const form = modalContainer.querySelector('#edit-client-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveClientEdit(clientId);
        });
    }
    
    // Configurar botão cancelar
    const cancelBtn = modalContainer.querySelector('#cancel-edit-client');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(modalContainer);
        });
    }
    
    // Configurar fechamento
    const closeBtn = modalContainer.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modalContainer);
        });
    }
    
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            document.body.removeChild(modalContainer);
        }
    });
}

saveClientEdit(clientId) {
    try {
        const name = document.getElementById('edit-client-name').value;
        const email = document.getElementById('edit-client-email').value;
        const phone = document.getElementById('edit-client-phone').value;
        const age = document.getElementById('edit-client-age').value;
        const weight = document.getElementById('edit-client-weight').value;
        const height = document.getElementById('edit-client-height').value;
        const objective = document.getElementById('edit-client-objective').value;
        const activity = document.getElementById('edit-client-activity').value;
        
        // Validação básica
        if (!name || !email || !age || !weight || !height || !objective || !activity) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        const imc = this.db.calculateIMC(weight, height);
        
        const updatedClient = {
            name,
            email,
            phone,
            age: parseInt(age),
            weight: parseFloat(weight),
            height: parseInt(height),
            objective,
            activity_level: activity,
            imc: parseFloat(imc)
        };
        
        const result = this.db.update('clients', clientId, updatedClient);
        
        if (result) {
            // Fechar modal
            const modal = document.querySelector('.modal');
            if (modal && modal.id !== 'create-menu-modal' && modal.id !== 'add-food-modal' && modal.id !== 'add-client-modal') {
                modal.remove();
            }
            
            this.showMessage(`Cliente "${name}" atualizado com sucesso!`, 'success', 'clients');
            
            // Recarregar conteúdo
            if (this.currentPage === 'clients') {
                this.loadClientsPage();
            }
        } else {
            alert('Erro ao atualizar o cliente. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao salvar edição do cliente:', error);
        alert('Ocorreu um erro ao salvar as alterações. Tente novamente.');
    }
}

deleteClient(clientId) {
    const client = this.db.getById('clients', clientId);
    if (!client) {
        this.showMessage('Cliente não encontrado!', 'error', 'clients');
        return;
    }
    
    const clientMenus = this.db.getMenusByClient(clientId);
    
    if (clientMenus.length > 0) {
        const menuList = clientMenus.map(m => `• ${m.name}`).join('\n');
        alert(`Este cliente possui ${clientMenus.length} cardápio(s) ativo(s):\n\n${menuList}\n\nDelete os cardápios primeiro ou transfira-os para outro cliente.`);
        return;
    }
    
    if (confirm(`Tem certeza que deseja excluir o cliente "${client.name}"? Esta ação não pode ser desfeita.`)) {
        const result = this.db.delete('clients', clientId);
        if (result) {
            this.showMessage('Cliente excluído com sucesso!', 'success', 'clients');
            this.loadClientsPage();
        } else {
            this.showMessage('Erro ao excluir o cliente.', 'error', 'clients');
        }
    }
}

viewFood(foodId) {
    const food = this.db.getById('foods', foodId);
    if (!food) {
        this.showMessage('Alimento não encontrado!', 'error', 'foods');
        return;
    }
    
    let content = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-header">
                <h3>${food.name}</h3>
            </div>
            <div style="padding: 20px;">
                <p><strong>Categoria:</strong> ${food.category}</p>
                <p><strong>Informação nutricional por 100g:</strong></p>
                <ul style="padding-left: 20px; margin-top: 10px;">
                    <li><strong>Calorias:</strong> ${food.calories} kcal</li>
                    <li><strong>Proteínas:</strong> ${food.protein} g</li>
                    <li><strong>Carboidratos:</strong> ${food.carbs} g</li>
                    <li><strong>Gorduras:</strong> ${food.fat} g</li>
                </ul>
                
                <h4 style="margin-top: 25px; margin-bottom: 15px;">Sugestões de Uso</h4>
                <ul style="padding-left: 20px;">
                    <li>Refeições principais</li>
                    <li>Lanches saudáveis</li>
                    <li>Suplementação alimentar</li>
                    <li>Preparação de receitas</li>
                </ul>
            </div>
            <div style="margin-top: 25px; display: flex; justify-content: flex-end; gap: 10px; padding: 0 20px 20px;">
                <button class="btn btn-secondary close-modal">Fechar</button>
            </div>
        </div>
    `;
    
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal';
    modalContainer.style.display = 'flex';
    modalContainer.innerHTML = content;
    
    document.body.appendChild(modalContainer);
    
    // Configurar fechamento
    const closeBtn = modalContainer.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modalContainer);
        });
    }
    
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            document.body.removeChild(modalContainer);
        }
    });
}

editFood(foodId) {
    const food = this.db.getById('foods', foodId);
    if (!food) {
        this.showMessage('Alimento não encontrado!', 'error', 'foods');
        return;
    }
    
    let content = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-header">
                <h3>Editar Alimento: ${food.name}</h3>
            </div>
            <form id="edit-food-form">
                <input type="hidden" id="edit-food-id" value="${food.id}">
                
                <div class="form-group">
                    <label for="edit-food-name">Nome do Alimento *</label>
                    <input type="text" id="edit-food-name" class="form-control" value="${food.name}" required>
                </div>
                
                <div class="form-group">
                    <label for="edit-food-category">Categoria *</label>
                    <select id="edit-food-category" class="form-control" required>
                        <option value="">Selecione uma categoria</option>
                        <option value="Cereais e derivados" ${food.category === 'Cereais e derivados' ? 'selected' : ''}>Cereais e derivados</option>
                        <option value="Frutas" ${food.category === 'Frutas' ? 'selected' : ''}>Frutas</option>
                        <option value="Verduras e legumes" ${food.category === 'Verduras e legumes' ? 'selected' : ''}>Verduras e legumes</option>
                        <option value="Carnes e ovos" ${food.category === 'Carnes e ovos' ? 'selected' : ''}>Carnes e ovos</option>
                        <option value="Leite e derivados" ${food.category === 'Leite e derivados' ? 'selected' : ''}>Leite e derivados</option>
                        <option value="Óleos e gorduras" ${food.category === 'Óleos e gorduras' ? 'selected' : ''}>Óleos e gorduras</option>
                        <option value="Leguminosas" ${food.category === 'Leguminosas' ? 'selected' : ''}>Leguminosas</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="edit-food-calories">Calorias (por 100g) *</label>
                    <input type="number" id="edit-food-calories" class="form-control" value="${food.calories}" required min="0" step="0.1">
                </div>
                
                <div class="form-group">
                    <label for="edit-food-protein">Proteínas (g por 100g) *</label>
                    <input type="number" id="edit-food-protein" class="form-control" value="${food.protein}" required min="0" step="0.1">
                </div>
                
                <div class="form-group">
                    <label for="edit-food-carbs">Carboidratos (g por 100g) *</label>
                    <input type="number" id="edit-food-carbs" class="form-control" value="${food.carbs}" required min="0" step="0.1">
                </div>
                
                <div class="form-group">
                    <label for="edit-food-fat">Gorduras (g por 100g) *</label>
                    <input type="number" id="edit-food-fat" class="form-control" value="${food.fat}" required min="0" step="0.1">
                </div>
                
                <div class="form-group" style="margin-top: 25px;">
                    <button type="submit" class="btn">Salvar Alterações</button>
                    <button type="button" class="btn btn-secondary" id="cancel-edit-food">Cancelar</button>
                </div>
            </form>
        </div>
    `;
    
    // Mostrar modal de edição
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal';
    modalContainer.style.display = 'flex';
    modalContainer.innerHTML = content;
    
    document.body.appendChild(modalContainer);
    
    // Configurar evento do formulário
    const form = modalContainer.querySelector('#edit-food-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveFoodEdit(foodId);
        });
    }
    
    // Configurar botão cancelar
    const cancelBtn = modalContainer.querySelector('#cancel-edit-food');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(modalContainer);
        });
    }
    
    // Configurar fechamento
    const closeBtn = modalContainer.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modalContainer);
        });
    }
    
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            document.body.removeChild(modalContainer);
        }
    });
}

saveFoodEdit(foodId) {
    try {
        const name = document.getElementById('edit-food-name').value;
        const category = document.getElementById('edit-food-category').value;
        const calories = document.getElementById('edit-food-calories').value;
        const protein = document.getElementById('edit-food-protein').value;
        const carbs = document.getElementById('edit-food-carbs').value;
        const fat = document.getElementById('edit-food-fat').value;
        
        // Validação básica
        if (!name || !category || !calories || !protein || !carbs || !fat) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        
        const updatedFood = {
            name,
            category,
            calories: parseFloat(calories),
            protein: parseFloat(protein),
            carbs: parseFloat(carbs),
            fat: parseFloat(fat)
        };
        
        const result = this.db.update('foods', foodId, updatedFood);
        
        if (result) {
            // Fechar modal
            const modal = document.querySelector('.modal');
            if (modal && modal.id !== 'create-menu-modal' && modal.id !== 'add-food-modal' && modal.id !== 'add-client-modal') {
                modal.remove();
            }
            
            this.showMessage(`Alimento "${name}" atualizado com sucesso!`, 'success', 'foods');
            
            // Recarregar conteúdo
            if (this.currentPage === 'foods') {
                this.loadFoodsPage();
            }
        } else {
            alert('Erro ao atualizar o alimento. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao salvar edição do alimento:', error);
        alert('Ocorreu um erro ao salvar as alterações. Tente novamente.');
    }
}

deleteFood(foodId) {
    const food = this.db.getById('foods', foodId);
    if (!food) {
        this.showMessage('Alimento não encontrado!', 'error', 'foods');
        return;
    }
    
    if (confirm(`Tem certeza que deseja excluir o alimento "${food.name}"? Esta ação não pode ser desfeita.`)) {
        const result = this.db.delete('foods', foodId);
        if (result) {
            this.showMessage('Alimento excluído com sucesso!', 'success', 'foods');
            this.loadFoodsPage();
        } else {
            this.showMessage('Erro ao excluir o alimento.', 'error', 'foods');
        }
    }
}

createMenuForClient(clientId) {
    this.openCreateMenuModal();
    
    // Selecionar o cliente automaticamente
    setTimeout(() => {
        const select = document.getElementById('menu-client');
        if (select) {
            select.value = clientId;
        }
    }, 100);
}

// Adicionar este método para melhorar a abertura de modais
openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        
        // Preencher selects se necessário
        if (modalId === 'create-menu-modal') {
            this.populateClientSelect();
        }
    }
}