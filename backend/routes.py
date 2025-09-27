from flask import Blueprint, request, jsonify
from database import db
from models import Usuario
from flask_bcrypt import Bcrypt

# Inicializamos o bcrypt aqui, mas ele será configurado no app.py
bcrypt = Bcrypt()

# Cria um "Blueprint". Pense nisso como um organizador de rotas.
# Todas as rotas definidas aqui começarão com /api
api = Blueprint('api', __name__)

@api.route('/usuarios', methods=['POST'])
def criar_usuario():
    # Pega os dados JSON enviados na requisição
    dados = request.get_json()

    nome = dados.get('nome')
    email = dados.get('email')
    senha = dados.get('senha')

    # Validação simples
    if not nome or not email or not senha:
        return jsonify({'erro': 'Dados incompletos'}), 400

    # Verifica se o email já existe
    if Usuario.query.filter_by(email=email).first():
        return jsonify({'erro': 'Email já cadastrado'}), 409

    # Gera o hash da senha
    senha_hash = bcrypt.generate_password_hash(senha).decode('utf-8')

    # Cria a nova instância do usuário
    novo_usuario = Usuario(nome=nome, email=email, senha_hash=senha_hash)

    # Adiciona ao banco de dados e salva
    db.session.add(novo_usuario)
    db.session.commit()

    # Retorna uma resposta de sucesso
    return jsonify({'mensagem': 'Usuário criado com sucesso!'}), 201