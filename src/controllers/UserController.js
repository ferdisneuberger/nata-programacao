const crypto = require('crypto')
const fs = require('fs').promises
const path = require('path')

class UserController{
    static async create(req, res){
        const {nome, email} = req.body

        if(!nome || !nome.trim()) return res.status(400).send({error:"O campo nome é obrigatório"})

        if(!email || !email.trim()) return res.status(400).send({error:"O campo email é obrigatório"})
        
        const nomeMaiusculo = nome.toUpperCase().trim()

        if (nomeMaiusculo.length > 50) return res.status(400).send({error:"O Tamanho do nome não deve exceder 50 caracteres"})
        
        const emailMinusculo = email.toLowerCase().trim()

        const caminhoDoArquivo = path.join(__dirname, '..', 'users.json')
        
        let users = [];

        try{
            await fs.access(caminhoDoArquivo)
            const usersData = await fs.readFile(caminhoDoArquivo)
            users = JSON.parse(usersData)
        } catch (error){

            if(error.code === 'ENOENT'){
                await fs.writeFile(caminhoDoArquivo, '[]')
            } else {
                return res.status(500).send({error:"Error no servidor"})
            }
        }
        
        const novoUsuario = {
            "userId":crypto.randomUUID(),
            "nome": nomeMaiusculo,
            "email": emailMinusculo,
            "createdAt": new Date().toISOString()
        }

        const existeUsuarioComEsseEmail = users.find(user => user.email === emailMinusculo)
        
        if (existeUsuarioComEsseEmail) return res.status(409).send({error:"Email já cadastrado"})
        
        users.push(novoUsuario)

        try{
            await fs.writeFile(caminhoDoArquivo, JSON.stringify(users, null, 2))
            return res.status(201).send(novoUsuario)
        }catch(error){
            return res.status(500).send({error:"Error no servidor"})
        }
    }

    static async getAll(req, res){
        const caminhoDoArquivo = path.join(__dirname, '..', 'users.json')

        try{
            await fs.access(caminhoDoArquivo)
            const usersData = await fs.readFile(caminhoDoArquivo)
            const users = JSON.parse(usersData)
            
            return res.status(200).send(users)
        } catch (error){
            if(error.code === 'ENOENT'){
                await fs.writeFile(caminhoDoArquivo, '[]')
                return res.status(200).send('[]')
            } else {
                return res.status(500).send({error:"Error no servidor"})
            }
        }
    }

    static async getById(req, res){
        const { userId } = req.params
        const caminhoDoArquivo = path.join(__dirname, '..', 'users.json')

        try{
            await fs.access(caminhoDoArquivo)
            const usersData = await fs.readFile(caminhoDoArquivo)
            const users = JSON.parse(usersData)

            const user = users.find(user => user.userId === userId)
            if(!user) return res.status(404).send({error:"Usuário não encontrado"})

            return res.status(200).send(user)
        } catch (error){
            if(error.code === 'ENOENT'){
                await fs.writeFile(caminhoDoArquivo, '[]')
                return res.status(404).send({error:"Usuário não encontrado"})
            } else {
                return res.status(500).send({error:"Error no servidor"})
            }
        }
    }
    
    static async delete(req, res){
        const { userId } = req.params
        const caminhoDoArquivo = path.join(__dirname, '..', 'users.json')

        try{
            await fs.access(caminhoDoArquivo)
            const usersData = await fs.readFile(caminhoDoArquivo)
            const users = JSON.parse(usersData)

            const user = users.find(user => user.userId === userId)
            if(!user) return res.status(404).send({error:"Usuário não encontrado"})

            const indexUser = users.indexOf(user)
            
            users.splice(indexUser, 1)

            await fs.writeFile(caminhoDoArquivo, JSON.stringify(users, null, 2))

            return res.status(204).send()
        } catch (error){
            console.log(error)
            if(error.code === 'ENOENT'){
                await fs.writeFile(caminhoDoArquivo, '[]')
                return res.status(404).send({error:"Usuário não encontrado"})
            } else {
                return res.status(500).send({error:"Error no servidor"})
            }
        }
    }
}
module.exports = UserController;