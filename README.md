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

chellange-sprint-03/
├─ public/ # Imagens e Videos
├─ src/
│ ├─ components/ # Componentes reutilizáveis (Carousel, Footer, FormField, Header e Modal.)
│ ├─ hooks/ # ( useForm. )
│ ├─ pages/ # Páginas principais (Home, Agendar, Chat, Contato, Login e Resultados.)
│ ├─ App.tsx # Componente raiz da aplicação
│ ├─ main.tsx # Ponto de entrada da aplicação
│ └─ index.css # Estilos globais (TailwindCSS)
├─ package.json # Dependências e scripts
└─ vite.config.ts # Configuração do Vite

---

##  Instalação e Execução

### 1️⃣ Pré-requisitos
- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### 2️⃣ Clonar o repositório
```bash
git clone https://github.com/marina-2907/chellange-sprint-03.git
cd chellange-sprint-03