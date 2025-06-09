// Obtém referências aos elementos HTML
const filmeForm = document.getElementById('filmeForm');
const tituloInput = document.getElementById('titulo');
const generoInput = document.getElementById('genero');
const anoInput = document.getElementById('ano');
const listaFilmes = document.getElementById('listaFilmes');
const filtroGeneroSelect = document.getElementById('filtroGenero');
const backgroundMusic = document.getElementById('background-music');
const toggleMusicBtn = document.getElementById('toggle-music-btn');

// Array para armazenar os filmes (inicialmente vazio)
let filmes = [];

// Função para carregar filmes do localStorage (se houver)
function carregarFilmes() {
    const filmesSalvos = localStorage.getItem('filmesFavoritos');
    if (filmesSalvos) {
        filmes = JSON.parse(filmesSalvos);
        renderizarFilmes(); // Renderiza os filmes carregados
        popularFiltroGeneros(); // Popula o filtro com os gêneros existentes
    }
}

// Função para salvar filmes no localStorage
function salvarFilmes() {
    localStorage.setItem('filmesFavoritos', JSON.stringify(filmes));
}

// Função para adicionar um novo filme
function adicionarFilme(event) {
    event.preventDefault(); // Evita o recarregamento da página ao enviar o formulário

    const titulo = tituloInput.value.trim(); // .trim() remove espaços em branco extras
    const genero = generoInput.value.trim();
    const ano = parseInt(anoInput.value); // Converte para número inteiro

    if (titulo && genero && !isNaN(ano)) { // Validação básica
        const novoFilme = {
            id: Date.now(), // ID único baseado no timestamp atual
            titulo: titulo,
            genero: genero,
            ano: ano
        };

        filmes.push(novoFilme); // Adiciona o novo filme ao array
        salvarFilmes(); // Salva no localStorage
        renderizarFilmes(); // Atualiza a lista exibida
        popularFiltroGeneros(); // Atualiza as opções de gênero no filtro

        // Limpa o formulário
        filmeForm.reset();
    } else {
        alert('Por favor, preencha todos os campos corretamente.');
    }
}

// Função para remover um filme
function removerFilme(id) {
    filmes = filmes.filter(filme => filme.id !== id); // Remove o filme pelo ID
    salvarFilmes(); // Salva no localStorage
    renderizarFilmes(); // Atualiza a lista exibida
    popularFiltroGeneros(); // Atualiza as opções de gênero (caso algum gênero tenha sumido)
}

// Função para renderizar/exibir os filmes na lista
function renderizarFilmes() {
    listaFilmes.innerHTML = ''; // Limpa a lista antes de renderizar novamente

    const generoSelecionado = filtroGeneroSelect.value;
    
    // Filtra os filmes se um gênero for selecionado
    const filmesParaExibir = generoSelecionado
        ? filmes.filter(filme => filme.genero.toLowerCase() === generoSelecionado.toLowerCase())
        : filmes;

    if (filmesParaExibir.length === 0) {
        listaFilmes.innerHTML = '<li style="text-align: center; color: #888;">Nenhum filme cadastrado ou correspondente ao filtro.</li>';
        return;
    }

    filmesParaExibir.forEach(filme => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="filme-info">
                <span class="titulo">${filme.titulo}</span>
                <span class="genero">Gênero: ${filme.genero}</span>
                <span class="ano">Ano: ${filme.ano}</span>
            </div>
            <button class="remove-btn" data-id="${filme.id}">Remover</button>
        `;
        listaFilmes.appendChild(li);
    });

    // Adiciona event listeners aos botões de remover recém-criados
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const id = parseInt(event.target.dataset.id);
            removerFilme(id);
        });
    });
}

// Função para popular o select de filtro com gêneros únicos
function popularFiltroGeneros() {
    filtroGeneroSelect.innerHTML = '<option value="">Todos</option>'; // Começa com a opção "Todos"

    const generos = [...new Set(filmes.map(filme => filme.genero))]; // Obtém gêneros únicos
    generos.sort().forEach(genero => { // Ordena e adiciona ao select
        const option = document.createElement('option');
        option.value = genero;
        option.textContent = genero;
        filtroGeneroSelect.appendChild(option);
    });

    // Mantém o gênero selecionado no filtro após a atualização
    const generoAtualSelecionado = filtroGeneroSelect.dataset.selected || ''; // Pega o último selecionado
    if (generoAtualSelecionado) {
        filtroGeneroSelect.value = generoAtualSelecionado;
    }
}

// --- Event Listeners ---
filmeForm.addEventListener('submit', adicionarFilme);

// Escuta a mudança no select de gênero para filtrar
filtroGeneroSelect.addEventListener('change', (event) => {
    filtroGeneroSelect.dataset.selected = event.target.value; // Salva o selecionado
    renderizarFilmes();
});

// Carrega os filmes ao carregar a página
document.addEventListener('DOMContentLoaded', carregarFilmes);

if (toggleMusicBtn && backgroundMusic) {
    toggleMusicBtn.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            backgroundMusic.muted = false; // Desmuta ao reproduzir
        } else {
            backgroundMusic.pause();
            backgroundMusic.muted = true; // Muta ao pausar
        }
    });

    // Tentar tocar quando a página carregar, mas mutado
    backgroundMusic.muted = true;
    backgroundMusic.play().catch(e => console.log("Autoplay mutado bloqueado, mas não é um problema."));
}

if (backgroundMusic) { // Verifica se o elemento de áudio existe
    // Define o volume inicial para um valor mais baixo (por exemplo, 0.2 para 20%)
    backgroundMusic.volume = 0.5; // Ajuste este valor entre 0.0 e 1.0

    // Se você tiver o botão de ligar/desligar a música:
    if (toggleMusicBtn) {
        toggleMusicBtn.addEventListener('click', () => {
            if (backgroundMusic.paused) {
                backgroundMusic.play();
                backgroundMusic.muted = false; // Desmuta ao reproduzir, se estava mutado
            } else {
                backgroundMusic.pause();
                backgroundMusic.muted = true; // Muta ao pausar, se não estava
            }
        });

        // Tentar tocar quando a página carregar, mas mutado (para respeitar autoplay policies)
        // O volume já foi definido acima
        backgroundMusic.muted = true; // Começa mutado para poder dar autoplay
        backgroundMusic.play().catch(e => console.log("Autoplay mutado bloqueado, mas não é um problema."));

    } else {
        // Você pode tentar reproduzir aqui, mas lembre-se das restrições do navegador.
        // backgroundMusic.play().catch(e => console.log("Autoplay bloqueado. O usuário precisa interagir."));
    }
}

// --- Event Listeners do Botão de Áudio ---

if (backgroundMusic && toggleMusicBtn) {
    // Define o volume inicial para um valor mais baixo (por exemplo, 0.2 para 20%)
    backgroundMusic.volume = 0.5 // Ajuste este valor entre 0.0 e 1.0

    // Evento de clique no botão de ligar/desligar
    toggleMusicBtn.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.muted = false; // Desmuta antes de tentar tocar
            backgroundMusic.play()
                .then(() => {
                    toggleMusicBtn.textContent = 'Desligar Música'; // Mudar texto para "Desligar"
                    toggleMusicBtn.style.backgroundColor = '#990000'; // Mudar cor para indicar que está tocando (opcional)
                    toggleMusicBtn.style.borderColor = '#ff0000'; // Borda vermelha (opcional)
                })
                .catch(error => {
                    console.warn('Problema ao tentar tocar a música:', error);
                    // Opcional: mostrar uma mensagem ao usuário se a reprodução falhar
                    alert('Não foi possível reproduzir a música. Pode ser necessário interagir mais com a página.');
                    backgroundMusic.muted = true; // Muta novamente se não conseguiu tocar
                });
        } else {
            backgroundMusic.pause();
            backgroundMusic.muted = true; // Muta ao pausar para que possa dar play novamente depois sem bloqueio
            toggleMusicBtn.textContent = 'Ligar Música'; // Mudar texto para "Ligar"
            toggleMusicBtn.style.backgroundColor = 'var(--button-bg)'; // Volta à cor original
            toggleMusicBtn.style.borderColor = 'var(--accent-green)'; // Volta à borda original
        }
    });

    // Opcional: Tentar tocar a música mutada ao carregar a página, se permitido pelo navegador.
    // O usuário ainda terá que desmutar clicando no botão.
    document.addEventListener('DOMContentLoaded', () => {
        backgroundMusic.muted = true; // Garante que comece mutado
        backgroundMusic.play().catch(error => {
            console.log("Autoplay mutado impedido ou não suportado. Usuário deve interagir para iniciar.", error);
            // Se o autoplay mutado for bloqueado, o botão ainda funcionará no clique
        });
    });
}
