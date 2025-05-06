# Product Requirements Document (PRD)

## Projeto: Mamalu, cronômetros de Mamadas para bebês

### Objetivo

Criar um aplicativo web simples que permita aos usuários monitorar o tempo de mamadas e chupetadas de seus bebês. O aplicativo deve ser fácil de usar, responsivo e acessível em dispositivos móveis.

### Funcionalidades

1. **Cronômetros**: Dois cronômetros independentes, um para "Mamada" e outro para "Chupetada".
    1. Cada cronômetro deve ter botões de Play, Pause e Reset.
    1. Cada cronômetro deve ter um toggle para definir se está sendo utilizado o peito esquerdo ou direito.
    1. Quando um cronômetro for iniciado, o outro deve pausar automaticamente.
    1. O botão de Reset deve exibir um modal de confirmação antes de limpar o tempo acumulado.
2. **Exibição do Tempo**: O tempo total acumulado de cada cronômetro deve ser exibido em um formato legível (horas, minutos, segundos, milissegundos).
3. **Impressão de Histórico**:
    1. Um botão "Imprimir Histórico" que exiba em uma caixa de texto para cópia os registros ordenados pelo timestamp de início no seguinte formato:
        ``` text
        "Mamada (seio {lado}) iniciou às {timestamp} encerrou às {timestamp}

        Chupetada (seio {lado}) iniciou às {timestamp} encerrou às {timestamp}

        Mamada (seio {lado}) iniciou às {timestamp} encerrou às {timestamp}

        Total de mamadas: {soma_tempo_mamadas}
        Total de mamadas lado esquerdo: {soma_tempo_mamadas_esq}
        Total de mamadas lado direito: {soma_tempo_mamadas_dir}
        Total de chupetadas: {soma_tempo_chupetadas}"
        Total de chupetadas lado esquerdo: {soma_tempo_chupetadas_esq}"
        Total de chupetadas lado direito: {soma_tempo_chupetadas_dir}"
        ```
    1. Deve haver um botão "Copiar" que copie o conteúdo da caixa de texto para a área de transferência.

### Estilo

Cores suaves (pastel), fontes arredondadas e ícones que remetam ao universo infantil.

### Artefato

Um único arquivo HTML com JavaScript e CSS embutido.