<?php
include 'conexao.php';

// 1. Recebendo os dados do formulário
$cpf           = $_POST['cpf'] ?? '';
$nome          = $_POST['nome'] ?? '';
$endereco      = $_POST['endereco'] ?? '';
$telefone      = $_POST['telefone'] ?? '';
$email         = $_POST['email'] ?? '';
$especialidade = $_POST['profissao'] ?? ''; // Mantendo o name="profissao" do seu HTML
$senha         = $_POST['senha'] ?? '';
$confirmarSenha = $_POST['confirmar_senha'] ?? ''; // Puxando o name do HTML

$erros = [];

// 2. Validações
if (!validarCPF($cpf)) {
    $erros[] = "CPF inválido.";
}

if (!$email) { // Corrigido o $
    $erros[] = "E-mail inválido.";
}

if (empty($senha)) { // Corrigido para verificar se está vazia
    $erros[] = "Senha não pode ser vazia.";
}

if ($senha !== $confirmarSenha) {
    $erros[] = "As senhas não coincidem.";
} elseif (strlen($senha) < 6) { 
    $erros[] = "A senha deve ter no mínimo 6 caracteres.";
}

// Limpa o CPF, telefone e CEP para garantir que só tenham números
$cpfLimpo = preg_replace('/\D/', '', $cpf);
$telefoneLimpo = preg_replace('/\D/', '', $_POST['telefone'] ?? '');
$cepLimpo      = preg_replace('/\D/', '', $_POST['cep'] ?? '');

// 3. Processamento e Inserção no Banco
if (empty($erros)) {
    
    // Criptografa a senha por segurança antes de salvar
    $senhaHash = password_hash($senha, PASSWORD_DEFAULT);

    $conn->begin_transaction();

    try {
        // Query 1: Insere na tabela pessoa (usando os números limpos e a senha protegida)
        $sql1 = "INSERT INTO pessoa (cpf, nome, endereco, telefone, email, senha) 
                 VALUES ('$cpfLimpo', '$nome', '$endereco', '$telefoneLimpo', '$email', '$senhaHash')";
        $conn->query($sql1);
        
        // Query 2: Insere na tabela profissional vinculando pelo mesmo CPF
        $sql2 = "INSERT INTO profesional (cpf, especializacao) 
                 VALUES ('$cpfLimpo', '$especialidade')";
        $conn->query($sql2);

        // Se as duas queries rodaram sem estourar nenhuma exceção, confirma no banco!
        $conn->commit();

        echo "<h2>Cadastro realizado com sucesso!</h2>";
        echo "<strong>Nome:</strong> $nome <br>";
        echo "<strong>E-mail:</strong> $email <br>";
        echo "<strong>Especialidade:</strong> $especialidade <br>";

    } catch (Exception $e) {
        // Se QUALQUER uma das tabelas der erro de sintaxe, coluna errada ou restrição, desfaz tudo
        $conn->rollback();
        
        echo "<h2>Erro ao realizar o cadastro de segurança</h2>";
        echo "Nenhuma alteração foi feita no banco de dados. <br>";
        echo "Detalhes técnicos do erro: " . $conn->error;
    }

} else {
    // Exibe os erros de validação encontrados (CPF, senha, etc.)
    echo "<h2>Não foi possível realizar o cadastro:</h2>";
    echo "<ul>";
    foreach ($erros as $erro) {
        echo "<li style='color: red;'>$erro</li>";
    }
    echo "</ul>";
    echo "<a href='javascript:history.back()'>Voltar e corrigir</a>";
}

// Função de validação do CPF
function validarCPF($cpf) {
    $cpf = preg_replace('/\D/', '', $cpf);

    if (strlen($cpf) != 11) return false;
    if (preg_match('/(\d)\1{10}/', $cpf)) return false;

    for ($t = 9; $t < 11; $t++) {
        for ($d = 0, $c = 0; $c < $t; $c++) {
            $d += $cpf[$c] * (($t + 1) - $c);
        }
        $d = ((10 * $d) % 11) % 10;
        if ($cpf[$c] != $d) return false;
    }
    return true;
}

// Fecha a conexão com o banco de dados de forma limpa
$conn->close();
?>