// ==========================================
// 1. MÁSCARA DO CPF (000.000.000-00)
// ==========================================
const cpfInput = document.getElementById('cpf');
cpfInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é número
    
    if (value.length > 3) value = value.replace(/^(\d{3})(\d)/, '$1.$2');
    if (value.length > 6) value = value.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    if (value.length > 9) value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
    
    e.target.value = value;
});

// ==========================================
// 2. MÁSCARA DO TELEFONE ((00) 00000-0000 ou (00) 0000-0000)
// ==========================================
const telefoneInput = document.getElementById('telefone');
telefoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');

    // Se digitou algo, começa a moldar o DDD entre parênteses: (00)
    if (value.length > 0) {
        value = value.replace(/^(\d{2})(\d)/, '($1) $2');
    }
    // Se for telefone fixo antigo ou enquanto digita o celular (00) 0000-0000
    if (value.length > 2 && value.length <= 13) {
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
    }
    // Se virar celular com 9 dígitos (00) 00000-0000, ele reajusta o hífen de lugar dinamicamente
    if (value.length > 13) {
        // Remove o hífen antigo colocado no passo anterior e posiciona após o 5º dígito do número
        value = value.replace('-', '');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }

    e.target.value = value;
});

// ==========================================
// 3. MÁSCARA DO CEP (00000-000)
// ==========================================
const cepInput = document.getElementById('cep');
cepInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');

    // Se digitou mais de 5 números, adiciona o hífen: 00000-000
    if (value.length > 5) {
        value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    }

    e.target.value = value;
});