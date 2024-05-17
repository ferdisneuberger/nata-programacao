class UsersValidators {
    static nameValidator(nome) {
        if(!nome || !nome.trim()){
            return {error:"O campo nome é obrigatório"}
        }

        const nomeMaiusculo = nome.toUpperCase().trim()
        
        if (nomeMaiusculo.length > 50) {
            return { error: "O Tamanho do nome não deve exceder 50 caracteres" }
        }

        return { nome : nomeMaiusculo }
    }

    static emailValidator(email) {
        if(!email || !email.trim()){
            return {error:"O campo email é obrigatório"}
        }

        const emailMinusculo = email.toLowerCase().trim()
        
        return { email : emailMinusculo }
    }
}

module.exports = UsersValidators;