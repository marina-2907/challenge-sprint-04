# IMREA Assistente – HC Telemedicina  
Sistema Web + API com Integração ao Banco de Dados  
- Entrega Final – Sprint 4 | Challenge FIAP + IMREA (HCFMUSP)

---

## 🔹 Sobre o Projeto

Este repositório contém a entrega final do **IMREA Assistente**, uma solução web desenvolvida para a Telemedicina do Hospital das Clínicas, com o propósito de:

 Facilitar o agendamento de consultas e exames  
 Garantir mais acessibilidade e autonomia ao paciente  
 Reduzir o absenteísmo em até **20% → 10%**  
 Melhorar acompanhamento, resultados e comunicação digital

O sistema une:

**Front-end em React** 
**API Java**  
**Banco de Dados Oracle** 

---

## 🔹 Evoluções da Sprint Final

| Recurso | Status |
|--------|:-----:|
| Autenticação de paciente |  Mock + validações |
| Agendamentos integrados com BD Oracle |  Inserir, listar, editar e excluir |
| Validação de horários e modalidades | Presencial / Telemedicina |
| Consulta de Resultados |  Com filtro e atualização |
| Chat informativo com profissionais |  Simulação |
| UI responsiva e acessível |  Tailwind + Navegação fluida |

---

## 🔹 Arquitetura Geral

React (Vite + Tailwind) → API Flask → Oracle Database

yaml
Copiar código

Comunicação via endpoints REST  
Scripts SQL desenvolvidos para criação e carga de dados

---

## 🔹 Tecnologias Utilizadas

| Camada | Tecnologias |
|--------|-------------|
| Front-end | React + Vite + TypeScript + TailwindCSS |
| Back-end | java |
| Banco de Dados | Oracle Cloud (SQL + PL/SQL + DDL + DML) |
| Controle de Versão | Git + GitHub |
| Design | UX Responsivo + Acessibilidade |

---

## 🗂 Estrutura do Projeto

bash
challenge-sprint-04/
├─ frontend/ (React)
│  ├─ src/pages/
│  ├─ src/components/
│  └─ ...
└─ backend/ (Flask API)
   ├─ app.js
   ├─ database/
   └─ ...
 Separação profissional entre Front e API

▶️ Instalação e Execução
🔹 1️⃣ Rodar Frontend
sh
Copiar código
cd CHALLENGE-SPRINT-04
npm install
npm run dev
➡️ Acesse: http://localhost:5173

🔹 2️⃣ Rodar API Python
sh
Copiar código
cd backend
python app.py
➡️ API local: http://localhost:8080

 Certifique-se de ter o driver oracledb instalado e conexão ativa com o Oracle.

Banco de Dados
Scripts DDL e DML inclusos no repositório

Tabelas principais:

TB_PACIENTE

TB_CONSULTA

TB_RECEITA

TB_LOGIN

- Primary Keys, Foreign Keys, unique e validador de datas e horários


---

 - Equipe
   
Nome	RM	Turma	GitHub	LinkedIn

🔹Bruno Vinicius Barbosa	566366	1TDSPY	🔗 https://github.com/brunovinicius02
	🔗 https://linkedin.com/in/brunovbarbosaa

🔹João Pedro Bitencourt Goldoni	564339	1TDSPX	🔗 https://github.com/JoaoPedroBitencourtGoldoni
	🔗 https://linkedin.com/in/joaopedrogoldoni

🔹Marina Tamagnini Magalhães	561786	1TDSPX	🔗 https://github.com/marina-2907
	🔗 https://linkedin.com/in/marina-t-36b14328b

---

- Links Importantes

🔹 Repositório GitHub:
👉 https://github.com/marina-2907/challenge-sprint-04

🔹 Vídeo de Apresentação:
▶️ https://youtu.be/7Qk0hgxOw0Y?si=LolBu9mRVVotEOq4



