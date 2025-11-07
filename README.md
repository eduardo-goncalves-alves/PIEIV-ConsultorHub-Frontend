# ConsultorHub - Projeto Frontend

## Pré-requisitos
Antes de começar, garanta que você tem as seguintes ferramentas instaladas em seu computador.

Node.js (LTS): (Que já inclui o npm). Você pode baixar aqui.
Git: Essencial para clonar o repositório.
VS Code: (Você já tem).
Java JDK (17+): Necessário para rodar o backend.
PostgreSQL: O banco de dados do projeto.

## Instalação e Configuração
Para o projeto funcionar, você precisa ter dois servidores rodando: o Backend e o Frontend.

Parte 1: Configurando o Backend (Servidor)
Clone o Repositório do Backend:

Configurando o Frontend (React)
Este é o projeto que está neste repositório.

## Clone o Repositório do Frontend:

```
git clone https://github.com/eduardo-goncalves-alves/PIEIV-ConsultorHub-Frontend.git
Entre na Pasta do Projeto:
```

```
cd PIEIV-ConsultorHub-Frontend
Instale as Dependências: O npm vai ler o package.json e baixar todas as bibliotecas necessárias (React, Vite, Tailwind, etc.).
```

```
npm install
🏃‍♂️ Rodando o Projeto
Agora que tudo está configurado, você precisa de 2 terminais abertos para rodar a aplicação:
```

## Terminal: Frontend

Na pasta PIEIV-ConsultorHub-Frontend, rode:

```
npm run dev
Seu terminal do frontend mostrará uma URL (provavelmente http://localhost:5173/). Abra essa URL no seu navegador. O React (rodando no 5173) irá automaticamente se conectar à sua API (rodando no 8080).
```

## Fluxo de Trabalho da Equipe (Git)
Para manter o projeto organizado e sem bagunça, vamos seguir este fluxo de trabalho:

**NUNCA trabalhe direto na branch main.**

> Antes de começar qualquer tarefa, atualize sua main local:

```
git checkout main
git pull origin main
```

Crie uma nova branch para a sua tarefa (ex: "corrigir-bug-login", "feature/tela-clientes"):

```
git checkout -b feature/minha-nova-tarefa
Faça seu trabalho, salve os arquivos e "commite" seu progresso:
```

```
git add .
git commit -m "feat: Adiciona o formulário de clientes"
```

Envie sua branch para o GitHub:

```
git push origin feature/minha-nova-tarefa
```

Vá até o site do GitHub e abra um Pull Request (PR) para que seu código possa ser revisado e "juntado" (mergeado) à main.
