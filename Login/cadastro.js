const form = document.getElementById('cadastroForm');
const mensagem = document.getElementById('mensagem');

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo || ''}`;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;
  const confirmar = document.getElementById('confirmar').value;

  if (!nome || !email || !senha || !confirmar) {
    mostrarMensagem('Preencha todos os campos.', 'erro');
    return;
  }
  if (senha !== confirmar) {
    mostrarMensagem('As senhas são diferentes.', 'erro');
    return;
  }
  if (senha.length < 8) {
    mostrarMensagem('A senha precisa ter pelo menos 8 caracteres.', 'erro');
    return;
  }

  const botao = form.querySelector('button[type="submit"]');
  botao.disabled = true;
  try {
    const resposta = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha })
    });
    const dados = await resposta.json();
    if (!resposta.ok) throw new Error(dados.erro || 'Não foi possível criar a conta.');
    mostrarMensagem('Conta criada com sucesso! Você já pode entrar.', 'sucesso');
    form.reset();
    setTimeout(() => { window.location.href = 'index.html'; }, 1200);
  } catch (erro) {
    mostrarMensagem(erro.message || 'Não foi possível conectar ao servidor.', 'erro');
  } finally {
    botao.disabled = false;
  }
});
