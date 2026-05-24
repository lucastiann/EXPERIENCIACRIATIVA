<?php
include "conexao.php";

$id_paciente = $_POST["id_paciente"];
$acompanhante = $_POST["acompanhante"];
$data_consulta = $_POST["data_consulta"];
$relatorio = $_POST["relatorio"];

$sql = "INSERT INTO consultas 
        (id_paciente, acompanhante, data_consulta, relatorio)
        VALUES 
        ('$id_paciente', '$acompanhante', '$data_consulta', '$relatorio')";

if ($conn->query($sql) === TRUE) {
    header("Location: consulta.php?id_paciente=" . $id_paciente);
    exit;
} else {
    echo "Erro ao salvar consulta: " . $conn->error;
}
?>