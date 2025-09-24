# IMREA Assistente – HC Telemedicina

Sistema Web Demonstrativo para Atendimento Digital ao Paciente  
 Entrega da Sprint 3 do Challenge FIAP

---

##  Introdução

Este repositório contém a **terceira entrega** do sistema web de telemedicina desenvolvido para o Instituto de Medicina Física e Reabilitação (IMREA) do Hospital das Clínicas.

O objetivo é representar, de forma **realista e didática**, o fluxo de interação entre pacientes e um ambiente de saúde digital.  
Nesta Sprint 3, ampliamos as funcionalidades, refinamos a interface e reforçamos boas práticas de **acessibilidade**, **usabilidade** e **arquitetura front-end**.

---

## Objetivos da Sprint 3

- **Evolução da experiência de agendamento**  
  Permitir ao paciente escolher **modalidade** (Presencial ou Telemedicina) e facilitar o gerenciamento de horários disponíveis.

- **Interface mais moderna e responsiva**  
  Reestruturação visual das páginas (Home, Agendar, Resultados e Contato) com Tailwind CSS, tipografia personalizada e design mais limpo.

- **Integração de novas seções e fluxos**  
  Inclusão de equipe com links para LinkedIn/GitHub, melhoria nos modais e melhor organização de rotas.

- **Base sólida para integrações futuras**  
  Código pronto para evoluir com banco de dados, autenticação real e recursos de teleconsulta.

---

## Funcionalidades Atualizadas

-  **Autenticação (mock)**  
  Área de login simples para simulação de acesso seguro.

- **Agendamento avançado**  
  - Escolha entre **Consulta** ou **Exame**  
  - Seleção de **modalidade**: Presencial ou Telemedicina  
  - Validação automática de horários disponíveis (07h às 18h)  
  - Confirmação visual e listagem de agendamentos feitos.

- **Chat com Profissionais**  
  Modal para simulação de conversas e orientações.

- **Resultados Online**  
  Consulta de exames, laudos e receitas de maneira prática.

- **Interface e navegação aprimoradas**  
  - Header responsivo com menu mobile (hambúrguer) e botão de login.  
  - Hero com vídeo de fundo, textos alinhados e rolagem suave para a seção “Sobre Nós”.  
  - Seções “Sobre Nós”, “Serviços” e “Equipe” mais atraentes.

---

## Estrutura principal do Projeto

challenge-sprint-03/
├── public/
│ ├── imgs/ # Logos, fotos de alunos e imagens de apoio
│ └── videos/ # Vídeo do hero (Home)
├── src/
│ ├── components/ # Header, Footer, Modal, etc.
│ ├── pages/ # Home, Agendar, Resultados, Contato
│ ├── routes.tsx # Definição das rotas
│ └── main.tsx # Ponto de entrada
├── index.html
└── tailwind.config.js

yaml
Copiar código

---

## Tecnologias Empregadas

- **React + TypeScript** – construção de componentes e roteamento.
- **Vite** – build rápido e leve.
- **Tailwind CSS** – estilização moderna, responsiva e com tipografia personalizada (`Inter`/`Poppins`).
- **Node.js & npm** – gerenciamento de dependências e scripts.
- **JavaScript (React Hooks)** – controle de estado, modais, agendamento dinâmico.

---

## Padrões de Design e Usabilidade

- **Responsividade total:**  
  Layout fluido para desktop, tablet e smartphone.

- **Acessibilidade:**  
  Cores com alto contraste, navegação por teclado e fonte legível.

- **Arquitetura limpa:**  
  Separação de componentes, rotas bem definidas e CSS modular.

- **Feedback claro:**  
  Mensagens em tempo real para horários disponíveis, confirmações de agendamento e status de carregamento.

---

## Time de Desenvolvimento

| Nome | RM / Turma | LinkedIn | GitHub |
|------|------------|---------|--------|
| **Bruno Vinicius Barbosa** | 566366 / 1TDSPY | [LinkedIn](https://www.linkedin.com/in/brunovbarbosaa) | [GitHub](https://github.com/brunovinicius02) |
| **João Pedro Bitencourt Goldoni** | 564339 / 1TDSPX | [LinkedIn](https://www.linkedin.com/in/joaopedrogoldoni) | [GitHub](https://github.com/JoaoPedroBitencourtGoldoni) |
| **Marina Tamagnini Magalhães** | 561786 / 1TDSPX | [LinkedIn](https://www.linkedin.com/in/marina-t-36b14328b) | [GitHub](https://github.com/marina-2907/marina) |

---

## Linha do Tempo / Principais Commits

| Data       | Responsável | Descrição |
|------------|------------|-----------|
| 30/09/2024 | Marina     | Configuração inicial com React, Vite e Tailwind |
| 07/09/2024 | Marina     | Criação do Header e Footer responsivos |
| 12/09/2024 | Marina     | Página Home com vídeo e seções “Sobre Nós” e “Serviços” |
| 18/09/2024 | Marina     | Formulário de agendamento com modalidades e validações |
| 21/09/2024 | Marina     | Ajustes em rotas, modais e página de resultados |
| 23/09/2024 | Equipe     | Revisão geral de design, acessibilidade e UX |
| 24/09/2024 | Marina     | README final e otimizações de build |

*(Datas ilustrativas: ajuste conforme o histórico real de commits.)*

---

## Como Executar Localmente

1. Clonar o repositório:
   ```bash
   git clone https://github.com/marina-2907/challenge-sprint-03.git
   cd challenge-sprint-03
Instalar dependências:

bash
Copiar código
npm install
Rodar o servidor local:

bash
Copiar código
npm run dev
Abra em http://localhost:5173.



Considerações de Segurança e Limitações
-------------------------------------------------
Este sistema não processa nem armazena dados reais de pacientes.

Todos os dados e imagens são fictícios ou de domínio público.

O projeto é exclusivamente acadêmico, não sendo um produto de produção hospitalar.


