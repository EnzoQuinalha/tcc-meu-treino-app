// Espera o DOM (toda a página HTML) estar completamente carregado
// antes de tentar adicionar interatividade.
document.addEventListener("DOMContentLoaded", function() {

    // --- SELETORES PRINCIPAIS ---
    const btnAdicionar = document.getElementById('btnAdicionarExercicio');
    const exerciciosContainer = document.getElementById('exercicios-container');

    // Começamos em 3, pois os exercícios 1 e 2 já existem no HTML
    let exercicioCount = 3;

    // --- FUNCIONALIDADE DE ADICIONAR EXERCÍCIO ---
    
    // Verifica se o botão "Adicionar" existe na página
    if (btnAdicionar) {
        btnAdicionar.addEventListener('click', function() {
            // 1. Cria um novo elemento div para o card
            const novoCard = document.createElement('div');
            novoCard.classList.add('exercicio-card');
            
            // 2. Define o HTML interno do card usando o contador
            novoCard.innerHTML = criarHTMLCardExercicio(exercicioCount);

            // 3. Adiciona o novo card ao container
            if (exerciciosContainer) {
                exerciciosContainer.appendChild(novoCard);
            }

            // 4. Força um pequeno "reflow" para que a animação CSS funcione
            requestAnimationFrame(() => {
                novoCard.style.opacity = '1';
                novoCard.style.transform = 'scale(1)';
            });

            // 5. Incrementa o contador para o próximo exercício
            exercicioCount++;
        });
    }

    // Função que gera o HTML para um novo card de exercício
    function criarHTMLCardExercicio(numero) {
        return `
            <div class="exercicio-card-header">
                <label for="ex${numero}-nome" class="form-label-inline">Exercício ${numero}</label>
                <button type="button" class="btn-remover">Remover</button>
            </div>
            <input type="text" id="ex${numero}-nome" class="form-input" placeholder="Ex: Rosca Direta">
            
            <div class="form-row">
                <div class="form-group">
                    <label for="ex${numero}-series" class="form-label-inline">Séries</label>
                    <input type="number" id="ex${numero}-series" class="form-input" placeholder="3">
                </div>
                <div class="form-group">
                    <label for="ex${numero}-reps" class="form-label-inline">Reps</label>
                    <input type="text" id="ex${numero}-reps" class="form-input" placeholder="10-12">
                </div>
            </div>
            
            <label for="ex${numero}-obs" class="form-label-inline">Observação (Opcional)</label>
            <textarea id="ex${numero}-obs" class="form-textarea" placeholder="Ex: Fazer com halteres..."></textarea>
        `;
    }

    // --- FUNCIONALIDADE DE REMOVER EXERCÍCIO ---

    // Delegação de Eventos no container
    if (exerciciosContainer) {
        exerciciosContainer.addEventListener('click', function(event) {
            
            if (event.target.classList.contains('btn-remover')) {
                const cardDoExercicio = event.target.closest('.exercicio-card');
                
                if (cardDoExercicio) {
                    removerCardComAnimacao(cardDoExercicio);
                }
            }
        });
    }

    // Função para aplicar animação de "fade-out" e remoção
    function removerCardComAnimacao(card) {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        card.style.height = '0px';
        card.style.paddingTop = '0';
        card.style.paddingBottom = '0';
        card.style.marginTop = '0';
        card.style.marginBottom = '0';
        card.style.borderWidth = '0';
        
        setTimeout(() => {
            card.remove();
        }, 300);
    }

    
    // --- ★★★ NOVO: REDIRECIONAMENTO DE SALVAR TREINO ★★★ ---

    // 1. Encontra o botão "Salvar Treino" pelo ID
    const btnSalvarTreino = document.getElementById('btnSalvarTreino');

    // 2. Adiciona um "ouvinte" de clique
    if (btnSalvarTreino) {
        btnSalvarTreino.addEventListener('click', function() {
            // 3. Redireciona o usuário para a página meus-treinos.html
            // (No futuro, você primeiro salvaria os dados)
            window.location.href = 'meus-treinos.html';
        });
    }

});

