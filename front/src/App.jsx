import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const login = async (e)=> {
    e.preventDefault()
    console.log({email,password})
    const url= "http://localhost:9000/api/sessions/login"
    const body= {email, password}
    const response= await axios.post(url, body)
    console.log(response);
    
  }
  return (
    <>
      <div >
        <section className="form">
          
          <form >
            <fieldset >
              <label  htmlFor="email">
                EMAIL:
              </label>
              <input
                onChange={e=>setEmail(e.target.value)}
                type="text"
                name="email"
                id="email"
              />
            </fieldset>
            <fieldset >
              <label  htmlFor="password">
                PASSWORD:
              </label>
              <input
                onChange={e=>setPassword(e.target.value)}
                type="password"
                name="password"
                id="password"
              />
            </fieldset>
            <button onClick={login} className="button">
              INICIAR SESION
            </button>
          </form>
        </section>
      </div>
    </>
  );
}

export default App;
