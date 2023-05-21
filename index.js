const container=document.querySelector(".card-container");
const modal=document.querySelector(".modal");
const modal2=document.querySelector(".modal2");
const cerrarModal=document.querySelector(".modal_close");
const gameover=document.querySelector(".anuncio");
const cuadro=document.querySelector(".cuadro");
const inicio=document.querySelector(".newgame");
const start=document.querySelector(".modal_close");
const user=document.querySelector("#name");
const info=document.querySelector(".usuario");
const timer=document.querySelector(".tiempo");
const textpuntaje=document.querySelector(".puntaje");
const puntuaciones=document.querySelector(".puntuaciones")
const agregarmodal2=document.querySelector(".tabla_puntajes")
const salir=document.querySelector(".salir")

const imagenes=[
    { name: "saman", imagen: "img/saman.jpg" },
  { name: "biblioteca", imagen: "img/biblioteca.jpg" },
  { name: "eugenio", imagen: "img/eugenio.jpg" },
  { name: "ceis", imagen: "img/ceis.jpg" },
  { name: "little_miss", imagen: "img/little_miss.jpg" },
  { name: "metrotech", imagen: "img/metrotech.jpg" },
  { name: "pelusa", imagen: "img/pelusa.jpg" },
  { name: "senet", imagen: "img/senet.jpg" }
];

window.addEventListener("load", ()=>{
    textpuntaje.classList.remove("show")
     setTimeout(
     ()=>{modal.showModal()},100
                )

    })

window.onkeydown = function(e){
    if(e.keyCode === 27){ 
        e.preventDefault();
    }
}; 

inicio.addEventListener("click",()=>{

    clearInterval(interval);
    gameover.innerHTML ="";
    textpuntaje.innerHTML="<h3>Puntaje:</h3>";
    puntuaciones.classList.remove("show")
    puntaje=0;
    guardar()
    user.value="";
    modal.showModal()
})

start.addEventListener("click", ()=>{
    if(user.value!=""){
    
    setTimeout( ()=> {
        info.innerHTML=`<h3>Nombre de usuario: ${user.value} </h3>`
        textpuntaje.classList.add("show")
        inicio.classList.add("show")
        inicializar()
        
    }
        ,1000)
    seconds=0;
    minutes=3;
    faltante=178;
    interval = setInterval(Timer, 1000);  
    cargar();

    
    }  
})

puntuaciones.addEventListener("click",()=>{
    usuarios=usuarios.sort((a,b)=>{
        return b.puntuacion-a.puntuacion
    })
    usuarios.forEach((o) => {
      agregarmodal2.innerHTML+=`<p class="modal2_text">${o.nombre}:  ${o.puntuacion}</p>`  
    } 

    );
    modal2.showModal()
    
} 
)

salir.addEventListener("click",()=>{
    modal2.close()
    agregarmodal2.innerHTML="";
})


let seconds = 0,
minutes = 3;
let faltante=178;
let puntaje=0;
let puntuación_máxima=100;
const numtarjetas= imagenes.length *2 ;
let escogido=false;
let esperar=false;
let tarjetaabierta;
let tarjetaabierta2;
let match;
let contadortarjetas=0;
let usuarios=[];


function repetidos(){
    let repetido=null;
    for(let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].nombre== user.value && usuarios[i].puntuacion==puntaje ) {
              return repetido=usuarios[i];
        }
    }
    return repetido;
}

function guardar() {
    let usuario={nombre:user.value
    , puntuacion:puntaje  
    }
    let repetido=repetidos();

    if(repetido==null){
    usuarios.push(usuario)
} 
    
    localStorage.setItem("users",JSON.stringify(usuarios))

}

function cargar() {
    antiguos=JSON.parse(localStorage.getItem("users"))
    if(antiguos!=null) {
        usuarios=JSON.parse(localStorage.getItem("users"))
}

}

function inicializar() {
    const cartas=mezclar()
    tabla(cartas)
    
}

const Timer=() => {
    if(seconds>0){
    seconds -= 1;
    }

    faltante-=1

if( faltante==0) {
       derrota()
       
  }

  else if (seconds == 0) {
    minutes -= 1;
    seconds=59;}

  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timer.innerHTML = `<h3>Tiempo: ${minutesValue}:${secondsValue}</h3>`;

  

}


function mezclar() {
    const pares=[...imagenes,...imagenes];
    const cartas=[];
    for (let i=0; i<numtarjetas ; i++ ) {
        const indice=Math.floor(Math.random()*pares.length);
        cartas.push(pares[indice]);
        pares.splice(indice,1);
    }
    return cartas;
}


function tabla(cartas) {
    escogido=false;
     tarjetaabierta;
     tarjetaabierta2;
     match;
    contadortarjetas=0;
    container.innerHTML="";
    esperar=false

    for(let i=0; i< 4*4; i++) {

        container.innerHTML += `
     <div class="card" data-card-value="${cartas[i].name}">
        <div class="front">
        <img src="img/logo.jpg"  class="image"/>
        </div>
        <div class="back">
        <img src="${cartas[i].imagen}"  class="image"/></div>
     </div>
     `;

    }

    container.style.margin="auto";


    let cards = document.querySelectorAll(".card");
 
    cards.forEach(
        (card)=> {
            card.addEventListener("click",
                ()=>{
                if(faltante>0) {
                   
                    if (!card.classList.contains("emparejada")) {
                        if(!esperar) {
                        card.classList.add("flipped");
                        
                        if (!escogido) {
                          
                          tarjetaabierta = card;
                          
                          match = card.getAttribute("data-card-value");

                          escogido=true;
                        } else { 
                           esperar=true; 
                          tarjetaabierta2 = card;
                          let match2 = card.getAttribute("data-card-value");

                          if (match == match2) {
                           
                            tarjetaabierta.classList.add("emparejada");
                            tarjetaabierta2.classList.add("emparejada");
                            setTimeout(()=>{esperar=false},800)
                            escogido = false;
                            contadortarjetas += 1;
                            
                            if (contadortarjetas == (numtarjetas/ 2)) {
                                victoria()
                              esperar=true;
                            }
                          } else {
                            
                            let [tempFirst, tempSecond] = [tarjetaabierta, tarjetaabierta2];
                            escogido=false;
                            tarjetaabierta = null;
                            tarjetaabierta2 = null;
                             setTimeout(() => {
                              tempFirst.classList.remove("flipped");
                              tempSecond.classList.remove("flipped");
                              esperar=false;
                            }, 800);
                          }
                        }
                      }
                    }
                } else if (faltante<=0) {
                    let [tempFirst, tempSecond] = [tarjetaabierta, tarjetaabierta2];
                            escogido=false;
                            tarjetaabierta = null;
                            tarjetaabierta2 = null;
                             setTimeout(() => {
                              tempFirst.classList.remove("flipped");
                              tempSecond.classList.remove("flipped");
                              esperar=false;
                            }, 900);

                }
            }
            )
        }
    )


}


function victoria() {
    clearInterval(interval);
    gameover.innerHTML += `<h2 class="mensaje">Juego Terminado, felicidades haz ganado </h2>`;
    puntaje=Math.round(puntuación_máxima * (faltante / 180))
    textpuntaje.innerHTML=`<h3>Puntaje: ${puntaje}</h3>`
    guardar()
    puntuaciones.classList.add("show")


}

function derrota() {
    guardar()
    clearInterval(interval);
    timer.innerHTML=`<h3>Tiempo: ${00}:${00}</h3>`
    gameover.innerHTML += `<h2 class="mensaje">Juego Terminado, haz perdido intenta de nuevo </h2>`;
    puntuaciones.classList.add("show")

}
