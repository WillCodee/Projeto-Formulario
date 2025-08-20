const form = document.getElementById('form')
const nameInput = document.getElementById('name')
const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password')
const repeatPassword = document.getElementById('repeat-password')
const cpfInput = document.getElementById('cpf')
const generoSelect = document.getElementById('genero')
const messageTextArea = document.getElementById('message')
const popup = document.querySelector('.mensagem')

form.addEventListener("submit", (e) => {
    e.preventDefault()
    let valid = true
    

    limparErros()
    

    //Verificar se o nome está vazio
    if(nameInput.value === ""){
        criaErro(nameInput,'Campo nome não pode está em branco')
        valid = false
    }else if(!validateName(nameInput.value)){
        criaErro(nameInput,'Informe o nome corretamente')
        valid = false
    }

    //Verificar se o email está preenchido e é valido
    if(emailInput.value === ""){
       criaErro(emailInput,'Campo email não pode está em branco')
        valid = false
    } else if (!isEmailValid(emailInput.value)){
        criaErro(emailInput,'Informe o Email corretamente')
        valid = false
    }

    //Verifica se a senha está preenchida
    if( !validatePassword(passwordInput.value)){
        valid = false
    }

    if(repeatPassword.value !== passwordInput.value){
        criaErro(repeatPassword,"As senhas devem ser Iguais")
        valid = false
    }

    //Verifica se o CPF é válido
    if(!validateCPF(cpfInput.value)){
        criaErro(cpfInput,"CPF inválido")
        valid = false
    }

    //Verificar se genero foi selecionado
    if(generoSelect.value === ""){
        criaErro(generoSelect,"Favor selecione um Genero")
        valid = false
    }

    //Verifica se a mensagem está preenchida
    if(messageTextArea.value == ""){
        criaErro(messageTextArea,"Favor escreva uma Mensagem")
        valid = false
    }

    //Envio do forms
    if(valid){

        const dados = {
            nome: nameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
            cpf: cpfInput.value,
            genero: generoSelect.value,
            mensagem: messageTextArea.value,
        }

        desabilitarForm(true)
        popup.style.display = "block"

        salvarDados(dados)

    setTimeout(()=>{
        desabilitarForm(false)
        popup.style.display = "none"
        form.submit()
    }, 5000)
        

    }
    

})

function salvarDados(novoDado){
    let dados = JSON.parse(localStorage.getItem('cadastrados')) || []
    dados.push(novoDado)
    localStorage.setItem('cadastrados',JSON.stringify(dados))
}

function desabilitarForm(disabled){
    const campos = form.querySelectorAll('input, select,textarea, button')
    campos.forEach(campo => campo.disabled = disabled)
}

function isEmailValid(email){
    //Regex para Validar email

    const emailRegex = new RegExp(
        //usuario12@host.com.br
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}$/
    )

    if(emailRegex.test(email)){
        return true
    }
    return false
}

//função q valida a senha

function validatePassword(password){
    const senhaLimpa = String(password || '').trim()

    function valida(){
        if(!senhaLimpa){
            criaErro(passwordInput, 'Campo Senha precisa está preenchido')
            return false
        }
        if(senhaLimpa.length < 6 || senhaLimpa.length > 12){
        criaErro(passwordInput, 'A Senha Precisa ter entre 6 e 12 Caracteres')
        return false
        }
        if(!passwordLetras(senhaLimpa)){
            criaErro(passwordInput,'A Senha precisa ter pelo menos uma letra')
            return false
        }
        if(!passwordNumbers(senhaLimpa)){
            criaErro(passwordInput,'A Senha precisa ter pelo menos um numero')
            return false
        }
        return true
    }

    //Contém Numeros
    function passwordNumbers(senha){
        const RegexSenhaNumbers = /\d/ 

        if(RegexSenhaNumbers.test(senha)){
            return true
        }
        return false
    }

    //Letra Maiuscula
    function passwordLetras(senha){
        const RegexSenhaLetras = new RegExp(
            /[a-zA-Z]/
        )

        if(RegexSenhaLetras.test(senha)){
            return true
        }
        return false
    }
    

    return valida()
}

function validateName(name){
    const nameRegex = new RegExp(
        /^[a-zA-Z\s]+$/  // Não Aceita Números apenas Letras
    )

    if(nameRegex.test(name)){
        return true
    }
    return false
}

function criaErro(campo,msg){
    const div = document.createElement('div')
    div.innerText = msg
    div.classList.add('error-text')
    campo.insertAdjacentElement('afterend',div)
}

function limparErros(){
    const divs = document.querySelectorAll('.error-text')
    divs.forEach( div => div.remove())
}

function validateCPF(cpf){
    const cpfLimpo = cpf.replace(/\D+/g, '')  // Remove tudo que não for número


    function valida(){
        if(!cpfLimpo) return false
        if(cpfLimpo.length !== 11) return false
        if(isSequencia()) return false
        
        const novoCPF = geraNovoCPF() 
        return novoCPF === cpfLimpo  // Se o CPF gerado for igual ao informado, é válido
    }
    
     // Gera os dois dígitos verificadores do CPF
    function geraNovoCPF(){
        const cpfParcial = cpfLimpo.slice(0, -2)// Aceita os 9 primeiros dígitos
        const digito1 = criaDigito(cpfParcial)
        const digito2 = criaDigito(cpfParcial + digito1)
        return cpfParcial + digito1 + digito2 // Retorna o CPF completo
    }  

    //calcula cada dígito
    function criaDigito(cpfParcial){
        const cpfArray = Array.from(cpfParcial) // Transforma a string em array 
        let regressivo = cpfArray.length + 1

        const total = cpfArray.reduce((ac,val)=>{
            ac += regressivo * Number(val)
            regressivo--
            return ac
        },0)

        const digito = 11 - (total % 11)
        return digito > 9 ? '0' : String(digito)
    }


    function isSequencia(){
        return cpfLimpo.charAt(0).repeat(11) === cpfLimpo
    }

    return valida()
}

