# IMREA Assistente – HC Telemedicina  
Sistema Web + API com Integração ao Banco de Dados  
**Entrega Final – Sprint 4 | Challenge FIAP + IMREA (HCFMUSP)**

---

## 🔹 Sobre o Projeto

Este repositório contém a entrega final do **IMREA Assistente**, uma solução web desenvolvida para a Telemedicina do Hospital das Clínicas, com o propósito de:

- Facilitar o agendamento de consultas e exames  
- Garantir mais acessibilidade e autonomia ao paciente  
- Reduzir o absenteísmo em até **20% → 10%**  
- Melhorar acompanhamento, resultados e comunicação digital

O sistema une:

**Front-end em React**  
**API Java**  
**Banco de Dados Oracle**

---

## 🔹 Evoluções da Sprint Final

| Recurso | Status |
|----------|:------:|
| Autenticação de paciente | Mock + validações |
| Agendamentos integrados com BD Oracle | Inserir, listar, editar e excluir |
| Validação de horários e modalidades | Presencial / Telemedicina |
| Consulta de Resultados | Com filtro e atualização |
| Chat informativo com profissionais | Simulação |
| UI responsiva e acessível | Tailwind + Navegação fluida |

---

## 🔹 Arquitetura Geral

**React (Vite + Tailwind) → API Flask → Oracle Database**

Comunicação via endpoints REST  
Scripts SQL desenvolvidos para criação e carga de dados

---

## 🔹 Tecnologias Utilizadas

| Camada | Tecnologias |
|--------|--------------|
| Front-end | React + Vite + TypeScript + TailwindCSS |
| Back-end | Java |
| Banco de Dados | Oracle Cloud (SQL + PL/SQL + DDL + DML) |
| Controle de Versão | Git + GitHub |
| Design | UX Responsivo + Acessibilidade |

---

## 🗂 Estrutura do Projeto

challenge-sprint-04/
├─ frontend/ (React)
│ ├─ src/pages/
│ ├─ src/components/
│ └─ ...
└─ backend/ (Flask API)
├─ app.js
├─ database/
└─ ...

yaml
Copiar código
Separação profissional entre Front e API.

---

## ▶️ Instalação e Execução

### 🔹 1️⃣ Rodar Frontend
bash
cd challenge-sprint-04
npm install
npm run dev
➡️ Acesse: http://localhost:5173

Como Rodar a API (Java – Spring Boot)

✅ 1️⃣ Pré-requisitos
Antes de iniciar, certifique-se de ter instalado:
Java 17+
Maven (versão 3.8+)
Porta 8080 disponível no seu computador

▶️ 2️⃣ Rodando o Servidor Java

No terminal, entre na pasta do backend:

cd backend-java

Em seguida, execute:

mvn clean install

mvn spring-boot:run

java -jar target/api-imrea-java-0.0.1-SNAPSHOT.jar
🌐 3️⃣ API disponível
Quando o servidor iniciar, ele ficará disponível em:
http://localhost:8080/api

📡 4️⃣ Endpoints principais
🔹 Consultas / Agendamentos
GET    /api/agendamentosPOST   /api/agendamentosGET    /api/agendamentos/telefone/{telefone}

🔹 Dados do Paciente
GET    /api/paciente-dados/telefone/{telefone}

🔹 Pacientes (compatibilidade)
GET    /api/pacientes
GET    /api/pacientes/{id}
POST   /api/pacientes

🔹 Médicos (compatibilidade)
GET    /api/medicos
GET    /api/medicos/{id}
GET    /api/medicos/especialidade/{especialidade}

🎯 5️⃣ Integração com o Front-end
O front consome automaticamente a API usando a variável:
VITE_API_URL=http://localhost:8080/api


🧩 Banco de Dados
Scripts DDL e DML inclusos no repositório.
Tabelas principais:

TB_PACIENTE

TB_CONSULTA

TB_RECEITA

TB_LOGIN

Com Primary Keys, Foreign Keys, Unique e validadores de datas/horários.

👥 Equipe
👤 Nome	🆔 RM	🎓 Turma	💻 GitHub	💼 LinkedIn
Bruno Vinicius Barbosa	566366	1TDSPY	github.com/brunovinicius02	linkedin.com/in/brunovbarbosaa
João Pedro Bitencourt Goldoni	564339	1TDSPX	github.com/JoaoPedroBitencourtGoldoni	linkedin.com/in/joaopedrogoldoni
Marina Tamagnini Magalhães	561786	1TDSPX	github.com/marina-2907	linkedin.com/in/marina-t-36b14328b

🔗 Links Importantes 

🔹 Repositório GitHub: ▶️ https://github.com/marina-2907/challenge-sprint-04

🔹 Deploy Online (Site na Vercel): 🌍 https://challenge-sprint-04-entrega.vercel.app/

🔹 Projeto no Painel da Vercel (Dashboard): 🧩 https://vercel.com/marina-tamagnini-magalhaes-projects/challenge-sprint-04

🔹 Vídeo de Apresentação (YouTube): ▶️ https://youtu.be/7Qk0hgxOw0Y?si=LolBu9mRVVotEOq4
