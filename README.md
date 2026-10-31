# SenaiCream — integração Node.js + Express + SQLite + JWT

O ZIP do projeto original já tem o front-end. Este pacote contém os arquivos novos/alterados para integrar cadastro e login ao back-end.

## 1. Onde colocar os arquivos

Copie a pasta `backend` para dentro da pasta principal `Projeto SenaiCream`. Depois substitua os arquivos existentes:
- `Projeto SenaiCream/Login/cadastro.js`
- `Projeto SenaiCream/Login/script.js`

A estrutura deve ficar assim:

```text
Projeto SenaiCream/
  index.html
  Login/
    index.html
    cadastro.html
    script.js        (substituído)
    cadastro.js      (substituído)
  backend/
    package.json
    server.js
    .env             (você vai criar)
```

## 2. Instalar

Instale o Node.js LTS se ainda não estiver instalado. Abra o terminal do VS Code na pasta `Projeto SenaiCream/backend` e execute:

```bash
npm install
```

Crie o arquivo `.env` dentro da pasta `backend`, copiando o conteúdo de `.env.example`. Troque `JWT_SECRET` por uma chave aleatória longa (pelo menos 24 caracteres), por exemplo uma frase aleatória sem acentos. Não compartilhe essa chave.

## 3. Iniciar o servidor

Ainda no terminal dentro de `backend`:

```bash
npm start
```

Abra no navegador **http://localhost:3000**. Não abra os HTML com `file://` e não use Live Server: o front-end precisa ser servido pelo Express para acessar `/api/...`.

## 4. Testar

1. Abra `http://localhost:3000/Login/cadastro.html`.
2. Cadastre nome, e-mail e uma senha com pelo menos 8 caracteres.
3. Entre em `http://localhost:3000/Login/index.html` e faça login.
4. O servidor cria automaticamente `backend/senaicream.db`. As senhas são guardadas como hash bcrypt, não em texto puro.

## 5. Testar uma rota protegida

Depois do login, abra DevTools > Console e execute:

```js
fetch('/api/auth/me', {
  headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
}).then(r => r.json()).then(console.log)
```

A resposta deve trazer o cliente autenticado. Se o token estiver ausente/expirado, a API retorna HTTP 401.

## Observações

- SQLite é a escolha simples para este projeto local: não precisa instalar um servidor de banco separado.
- O endpoint de cadastro valida dados e bloqueia e-mails duplicados.
- O endpoint de login retorna JWT com validade padrão de 2 horas.
- Para um site publicado, use HTTPS, proteja a chave JWT, adicione limitação de tentativas de login e reveja a estratégia de armazenamento do token. `localStorage` é adequado para este exercício, mas tem riscos se houver XSS.
- O arquivo `Login/esqueceuSenha.js` ainda não implementa recuperação real de senha. Isso exigiria fluxo com e-mail (SMTP) e token de redefinição.
