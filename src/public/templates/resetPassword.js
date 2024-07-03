export const resetPassword = (resetLink) => `
<head>
  <title>Restablecer Contraseña</title>
</head>
<body>
  <h1>Restablecer Contraseña</h1>
  <p>Para restablecer su contraseña, haga clic en el siguiente enlace:</p>
  <a href="${resetLink}">Restablecer Contraseña</a>
</body>
`