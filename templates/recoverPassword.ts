const year = new Date().getFullYear();

const recoverPasswordTemplate = (displayName: string, link: string) => `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      .sanble-container {
        padding: 50px;
        background-color: #f1f1f1;
        color: #839197;
        text-align: center;
      }
      .sanble-img-header {
        margin-bottom: 30px;
      }
      .sanble-card {
        background-color: #fff;
        border-radius: 5px;
        padding: 30px;
        text-align: center;
      }
      .sanble-card-content {
        width: 75%;
        padding: 20px;
        margin: auto;
      }
      .sanble-title {
        font-size: 24px;
        text-align: center;
      }
      .sanble-text {
        text-align: left;
      }
      .sanble-card-image {
        text-align: center;
        margin-bottom: 20px;
      }
      .sanble-btn-container {
        text-align: center;
        margin: 30px;
      }
      .sanble-btn-container a {
        background-color: #ff7315;
        padding: 8px 25px;
        border: none;
        color: #fff;
        font-size: 18px;
        font-weight: 700;
        border-radius: 5px;
        margin-top: 15px;
        cursor: pointer;
        text-decoration: none;
      }
      .sanble-thanks {
        text-align: left;
      }
      .sanble-card-footer {
        text-align: left;
        font-size: 10px;
      }
      .sanble-card-footer p {
        margin-bottom: 0;
      }
      .sanble-footer {
        margin-top: 20px;
        text-align: center;
      }
      .sanble-not-forgot {
        color: #ff7315;
      }
    </style>
  </head>
  <body>
    <section class="sanble-container">
      <img
        class="sanble-img-header"
        src="https://i.imgur.com/B20jC7T.png"
        width="200"
        alt="Sanble"
      />
      <section class="sanble-card">
        <div class="sanble-card-content">
          <div class="sanble-card-body">
            <div class="sanble-card-image">
              <img
                src="https://i.imgur.com/A4U3Sht.png"
                width="100"
                alt="Email"
              />
            </div>
            <h1 class="sanble-title">¿Problemas para entrar?</h1>
            <p class="sanble-text">
              Hola, <b>${displayName}</b>. <br />
              Restablecer su contraseña es fácil. Simplemente presione el botón
              de abajo y siga las instrucciones. Lo tendremos listo y
              funcionando en poco tiempo.
            </p>
            <div class="sanble-btn-container">
              <a href="${link}" target="_blank"> Restablecer la contraseña </a>
            </div>
            <p class="sanble-not-forgot">
              Si no olvidó su contraseña, puede ignorar este correo electrónico
            </p>
            <div class="sanble-thanks">
              <p>Gracias,</p>
              <p>Equipo de Sanble.</p>
            </div>
          </div>
          <hr />
          <div class="sanble-card-footer">
            <p>
              Si tiene problemas para hacer clic en el botón, copie y pegue la
              URL a continuación en su navegador web
            </p>
            <span>${link}</span>
          </div>
        </div>
      </section>
      <div class="sanble-footer">
        <p>${year} © Todos los derechos reservados, Venezuela.</p>
      </div>
    </section>
  </body>
</html>
`;

export default recoverPasswordTemplate;
