function selecionar(card){


card.classList.toggle("selecionado");


let lista=document.getElementById("lista");


lista.innerHTML="";



document.querySelectorAll(".selecionado").forEach(item=>{


let sabor=item.querySelector("p").innerText;


lista.innerHTML += 
`
<li>🍦 ${sabor}</li>
`;


});


}