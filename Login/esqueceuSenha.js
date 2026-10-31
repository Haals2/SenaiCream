document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("recuperarForm");
    const mensagem = document.getElementById("mensagem");

    function mostrar(texto, tipo){

        mensagem.textContent = texto;
        mensagem.className = "mensagem " + tipo;

        setTimeout(()=>{
            mensagem.className = "mensagem";
        },3000);

    }

    form.addEventListener("submit",(e)=>{

        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value;
        const confirmar = document.getElementById("confirmar").value;

        if(email==="" || senha==="" || confirmar===""){
            mostrar("⚠️ Preencha todos os campos.","erro");
            return;
        }

        if(senha!==confirmar){
            mostrar("❌ As senhas não coincidem.","erro");
            return;
        }

        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        const indice = usuarios.findIndex(u => u.email === email);

        if(indice === -1){
            mostrar("❌ E-mail não encontrado.","erro");
            return;
        }

        usuarios[indice].senha = senha;

        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        mostrar("✅ Senha alterada com sucesso!","sucesso");

        setTimeout(()=>{
            window.location.href="index.html";
        },1500);

    });

});