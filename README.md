IMREA Assistente – HC Telemedicina

Sistema Web + API com Integração ao Banco de Dados
Entrega Final – Sprint 4 | Challenge FIAP + IMREA (HCFMUSP)

🔹 Sobre o Projeto

O IMREA Assistente é uma solução web voltada para a Telemedicina do Hospital das Clínicas, desenvolvida com o objetivo de:

Facilitar o agendamento de consultas e exames

Oferecer acessibilidade e autonomia ao paciente

Reduzir o absenteísmo de 20% → 10%

Melhorar comunicação, resultados e interação digital

A solução integra:

Front-end em React

API em Java (Spring Boot)

Banco de Dados Oracle

🔹 Evoluções da Sprint Final
Funcionalidade	Status
Autenticação de Paciente	✔ Mock + validações
Agendamentos Integrados	✔ Inserir, listar, editar, excluir
Validação de Modalidades	✔ Presencial / Telemedicina
Consulta de Resultados	✔ Filtros + atualizações
Chat Informativo	✔ Simulação
UI Responsiva e Acessível	✔ Tailwind + Navegação fluida
🔹 Arquitetura Geral
React (Vite + Tailwind)
        ↓
    API Java (Spring Boot)
        ↓
     Oracle Database


Comunicação realizada via REST API.
Scripts DDL e DML incluídos no repositório.

🔹 Tecnologias Utilizadas
Camada	Tecnologias
Front-end	React, Vite, TypeScript, TailwindCSS
Back-end	Java + Spring Boot
Banco de Dados	Oracle (DDL, DML, PL/SQL)
Versionamento	Git + GitHub
Design	UX Responsivo + Acessibilidade
🗂 Estrutura do Projeto
challenge-sprint-04/
├─ frontend/          → Aplicação React
│   ├─ src/pages/
│   ├─ src/components/
│   └─ ...
└─ backend-java/      → API Java Spring Boot
    ├─ src/main/java/
    ├─ src/main/resources/
    └─ ...


Separação profissional entre Front-end e API Java.

▶️ Instalação e Execução
🔹 1️⃣ Rodando o Front-end (React)
cd frontend
npm install
npm run dev


➡️ Acesse: http://localhost:5173

🚀 Como Rodar a API (Java – Spring Boot)
✅ 1️⃣ Pré-requisitos

Certifique-se de ter instalado:

Java 17+

Maven 3.8+

Porta 8080 disponível

▶️ 2️⃣ Rodando o Servidor Java

No terminal:

cd backend-java


Execute:

mvn clean install
mvn spring-boot:run


Ou, se quiser rodar o .jar:

java -jar target/api-imrea-java-0.0.1-SNAPSHOT.jar

🌐 3️⃣ API Disponível

Quando iniciar, a API estará em:

http://localhost:8080/api

📡 4️⃣ Endpoints Principais
🔹 Consultas / Agendamentos
GET    /api/agendamentos
POST   /api/agendamentos
GET    /api/agendamentos/telefone/{telefone}

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

O React consome a API via variável de ambiente:

VITE_API_URL=http://localhost:8080/api


No deploy da Vercel, configure em:

Project → Settings → Environment Variables

🧩 Banco de Dados

Scripts DDL e DML incluídos no repositório.

Principais tabelas:

TB_PACIENTE

TB_CONSULTA

TB_RECEITA

TB_LOGIN

validação de horários, chaves primárias, FKs, UNIQUE, CHECK etc.

👥 Equipe
Nome	RM	Turma	GitHub	LinkedIn
Bruno Vinicius Barbosa	566366	1TDSPY	github.com/brunovinicius02	linkedin.com/in/brunovbarbosaa
João Pedro Bitencourt Goldoni	564339	1TDSPX	github.com/JoaoPedroBitencourtGoldoni	linkedin.com/in/joaopedrogoldoni
Marina Tamagnini Magalhães	561786	1TDSPX	github.com/marina-2907	linkedin.com/in/marina-t-36b14328b
🔗 Links Importantes

🔹 Repositório GitHub:
https://github.com/marina-2907/challenge-sprint-04

🔹 Deploy Online (Vercel):
https://challenge-sprint-04-entrega.vercel.app/

🔹 Dashboard da Vercel:
https://vercel.com/marina-tamagnini-magalhaes-projects/challenge-sprint-04

🔹 Vídeo da Apresentação:
https://youtu.be/7Qk0hgxOw0Y?si=LolBu9mRVVotEOq4
