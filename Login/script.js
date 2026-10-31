document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const email = document.getElementById('email');
  const senha = document.getElementById('senha');
  const mensagem = document.getElementById('mensagem');

  function mostrarMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = `mensagem ${tipo || ''}`;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const botao = form.querySelector('button[type="submit"]');
    botao.disabled = true;
    try {
      const resposta = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.value.trim(), senha: senha.value })
      });
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.erro || 'Falha ao entrar.');

      // Nunca salve a senha no navegador. O token é usado nas rotas protegidas.
      localStorage.setItem('token', dados.token);
      localStorage.setItem('usuarioLogado', JSON.stringify(dados.cliente));
      mostrarMensagem(`Bem-vindo, ${dados.cliente.nome}!`, 'sucesso');
      setTimeout(() => { window.location.href = '/index.html'; }, 800);
    } catch (erro) {
      mostrarMensagem(erro.message || 'Não foi possível conectar ao servidor.', 'erro');
    } finally {
      botao.disabled = false;
    }
  });
});
