import { FcSearch } from "react-icons/fc";
import './style.css';
import {useState,useRef } from 'react';
import api from'./services/api.js'
import Swal from 'sweetalert2'


function App() {
  
  const inputRef = useRef(null);
  const [showMain, setShowMain] = useState(false);
  const [input, setInput] = useState('')
  const [responseAPICEP, setCEP] = useState({})

  async function handleSearch(){
   if(input == ''){
    Swal.fire({
      title: "Nenhum CEP informado!",
      text: "Informe um CEP para buscar informações sobre.",
      icon: "warning"
    });
    return;
   }else if(input.length < 8){
    inputRef.current.setCustomValidity("CEP é composto por 8 dígitos numéricos.");
    inputRef.current.reportValidity();
    return;

   }

   try{
    const response = await api.get(`${input}/json`)
    if(response.data.erro){
      Swal.fire({
        title: "Nenhum CEP encontrado!",
        text: "Não foram encontradas informações sobre o CEP solicitado.",
        icon: "warning"
      });
   
    } else {
      setCEP(response.data)
      setShowMain(true);
    }

    console.log("Requisiçaõ enviada")
    console.log(response)
   }
   catch{
    setInput("")
    Swal.fire({
      title: "Falha ao buscar informações!",
      text: "Certifique-se que o valor informado é númerico e segue padrão CEP.",
      icon: "error"
    });
   }

  }


  return (
    <div className="container">
      <h1 className="title">Busca CEP</h1>

      <div className="containerInput">
        <input
         type="text" placeholder="Digite o CEP desejado..."
         maxlength="8"
         value={input}
         onChange={(event) => setInput(event.target.value)}
         ref={inputRef}
         onKeyDown={(e) => {
          if (e.key === "Enter")
            handleSearch();
          }}
         ></input>

        <button className="buttonSearch"
        onClick={handleSearch}
        > <FcSearch  size={25} color="#FFF"></FcSearch >
        </button>
      </div>
      
      {showMain && (<main className="main">
        <h2>CEP: {responseAPICEP.cep}</h2>
        <span>Complemento: {responseAPICEP.logradouro}</span>
        <span>{responseAPICEP.complemento}</span>
        <span>{responseAPICEP.bairro}</span>
        <span>{responseAPICEP.localidade}</span>
      </main>  )}

    </div>
  );
}

export default App;
