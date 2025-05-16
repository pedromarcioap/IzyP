// Aguarda o DOM estar completamente carregado antes de adicionar listeners
document.addEventListener('DOMContentLoaded', () => {
    const promptInput = document.getElementById('promptInput');
    const generateButton = document.getElementById('generateButton');
    const responseDiv = document.getElementById('response');

    // Adiciona um listener de evento de clique ao botão
    generateButton.addEventListener('click', async () => {
        const prompt = promptInput.value.trim(); // Remove espaços em branco extras
        responseDiv.textContent = ''; // Limpa a resposta anterior
        responseDiv.classList.add('loading'); // Adiciona classe para indicador de loading

        if (!prompt) {
            responseDiv.textContent = 'Por favor, insira um prompt.';
            responseDiv.classList.remove('loading');
            return;
        }

        try {
            // Chama a função puter.ai.chat() conforme a documentação no HTML
            // Usando o modelo claude-3-7-sonnet com streaming
            const response = await puter.ai.chat(prompt, { model: 'claude-3-7-sonnet', stream: true });

            responseDiv.classList.remove('loading'); // Remove indicador de loading

            // Processa a resposta em tempo real (streaming)
            let fullResponse = '';
            for await (const part of response) {
                 // puter.print() é para o ambiente Puter, em uma extensão atualizamos o DOM
                 if (part?.text) { // Verifica se a parte contém texto
                    fullResponse += part.text;
                    responseDiv.textContent = fullResponse;
                    // Opcional: Rola automaticamente para ver o texto chegando
                    responseDiv.scrollTop = responseDiv.scrollHeight;
                 }
            }

        } catch (error) {
            console.error("Erro ao chamar Puter.ai.chat:", error);
            responseDiv.textContent = 'Erro: ' + (error.message || 'Ocorreu um erro desconhecido.');
            responseDiv.classList.remove('loading');
        }
    });

    // Opcional: Permite enviar o prompt pressionando Enter na área de texto
    promptInput.addEventListener('keypress', function(event) {
        // Verifica se a tecla pressionada é Enter e não é Shift+Enter
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Previne a quebra de linha padrão
            generateButton.click(); // Simula um clique no botão
        }
    });
});
