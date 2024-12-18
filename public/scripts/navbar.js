async function verifyOnline() {
    const token = localStorage.getItem("token")
    if (token) {
      const url = "http://localhost:9000/api/sessions/online"
      const opts = {
        method: "POST",
        headers: { "Content-Type": "application/json", token },
      }
      let response = await fetch(url, opts)
      response = await response.json()
      const { online } = response
      if (online) {
        document.querySelector("#navbar").innerHTML = `
            <li class="nav-item">
              <a class="nav-link" href="index.html">Inicio</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="createProduct.html">Crear producto</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="cart.html">Carrito</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="profile.html">Perfil</a>
            </li>
            <li id="signout" class="nav-link">Cerrar sesion!</li>
          `
        document.querySelector("#signout").addEventListener("click", async () => {
          const url = "http://localhost:9000/api/sessions/signout"
          const opts = {
            method: "POST",
            headers: { "Content-Type": "application/json", token: localStorage.getItem("token") },
          }
          let response = await fetch(url, opts)
          localStorage.removeItem("token")
          response = await response.json()
          location.replace("/")
        })
      }
    }
  }
  
  verifyOnline()