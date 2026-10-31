document.addEventListener("DOMContentLoaded", () => {

    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    const nomeUsuario = document.getElementById("nomeUsuario");
    const menuUsuario = document.getElementById("menuUsuario");
    const loginLink = document.getElementById("loginLink");
    const logout = document.getElementById("logout");

    const abrir = document.getElementById("abrirModal");
    const modal = document.getElementById("modalSobre");
    const fechar = document.querySelector(".fechar");   

    abrir.addEventListener("click",(e)=>{

    e.preventDefault();

    modal.classList.add("ativo");

    });

    fechar.addEventListener("click",()=>{

        modal.classList.remove("ativo");

    });

    window.addEventListener("click",(e)=>{

        if(e.target===modal){

            modal.classList.remove("ativo");

        }

    });

    if(usuario){

        nomeUsuario.textContent = "Olá, " + usuario.nome;

        loginLink.addEventListener("click",(e)=>{

            e.preventDefault();

            menuUsuario.classList.toggle("ativo");

        });

    }else{

        loginLink.href="/Login/index.html";

    }

    if(logout){

        logout.addEventListener("click",()=>{

            localStorage.removeItem("usuarioLogado");

            window.location.reload();

        });

    }

    document.addEventListener("click",(e)=>{

        if(!menuUsuario.contains(e.target) && !loginLink.contains(e.target)){

            menuUsuario.classList.remove("ativo");

        }

    });

});