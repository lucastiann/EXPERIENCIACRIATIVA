<?php
include "conexao.php";

//exempo 
$id_paciente = 1; // apenas exemplo!

$sql = "SELECT data_consulta, relatorio 
        FROM consultas 
        WHERE id_paciente = $id_paciente
        ORDER BY data_consulta DESC
        LIMIT 3";

$resultado = $conn->query($sql);
?>
// exemplo
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tela Consulta</title>
  <link rel="stylesheet" href="consulta.css">
</head>
<body>

  <main class="consulta-container">

    <form class="consulta-form" method="POST" action="salvar-consulta.php">

      <section class="conteudo-consulta">

        <div class="relatorio-box">
          <label for="relatorio">RELATÓRIO DA CONSULTA:</label>
          <textarea id="relatorio" name="relatorio"></textarea>
        </div>

        <div class="dados-consulta">
          <div class="campo">
            <label for="acompanhante">Acompanhante</label>
            <input type="text" id="acompanhante" name="acompanhante">
          </div>

          <div class="campo">
            <label for="data-consulta">Data consulta:</label>
            <input type="date" id="data-consulta" name="data_consulta">
          </div>

          <input type="hidden" name="id_paciente" value="<?php echo $id_paciente; ?>">
        </div>

        <aside class="historico-box">
          <h2>HISTÓRICO CONSULTA</h2>

          <?php
          if ($resultado->num_rows > 0) {
              while ($consulta = $resultado->fetch_assoc()) {
          ?>

            <div class="historico-item">
              <p>DATA: <?php echo date("d/m/Y", strtotime($consulta["data_consulta"])); ?></p>
              <p>OBS: <?php echo htmlspecialchars($consulta["relatorio"]); ?></p>
            </div>

          <?php
              }
          } else {
          ?>

            <div class="historico-item">
              <p>Nenhuma consulta encontrada.</p>
            </div>

          <?php
          }
          ?>

        </aside>

      </section>

      <button type="submit" class="btn-salvar">SALVAR</button>

    </form>

  </main>

</body>
</html>