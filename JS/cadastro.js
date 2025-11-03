// Espera o DOM (toda a página HTML) estar completamente carregado
document.addEventListener("DOMContentLoaded", function() {

    // --- Seletores dos Elementos ---
    const inputSenha = document.getElementById('senha');
    const iconeSenha = document.getElementById('toggleSenha');

    // SVGs para os ícones
    const iconeOlhoAberto = `
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    `;

    const iconeOlhoFechado = `
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L12 12" />
    `;

    // --- Função para Alternar a Senha ---
    function toggleVisibilidadeSenha() {
        if (!inputSenha || !iconeSenha) {
            console.error("Elemento de senha ou ícone não encontrado.");
            return;
        }

        if (inputSenha.type === 'password') {
            inputSenha.type = 'text';
            iconeSenha.innerHTML = iconeOlhoFechado;
        } else {
            inputSenha.type = 'password';
            iconeSenha.innerHTML = iconeOlhoAberto;
        }
    }

    // --- Adiciona o Evento de Clique (Ícone) ---
    if (iconeSenha) {
        iconeSenha.addEventListener('click', toggleVisibilidadeSenha);
    }

    
    // --- ★★★ NOVO: REDIRECIONAMENTO DE CADASTRO ★★★ ---
    
    // 1. Encontra o botão "Próximo" pelo ID
    const btnCadastrar = document.getElementById('btnCadastrar');

    // 2. Adiciona um "ouvinte" de clique
    if (btnCadastrar) {
        btnCadastrar.addEventListener('click', function() {
            // 3. Redireciona o usuário para a página index.html
            // (No futuro, você primeiro salvaria os dados, depois redirecionaria)
            window.location.href = 'index.html';
        });
    }

});

