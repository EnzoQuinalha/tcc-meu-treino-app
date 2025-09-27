from flask import Blueprint, request, jsonify
from database import db
from models import Usuario
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

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

@api.route('/login', methods=['POST'])
def login_usuario():
    # Pega os dados JSON enviados na requisição
    dados = request.get_json()
    email = dados.get('email')
    senha = dados.get('senha')

    # Validação simples
    if not email or not senha:
        return jsonify({'erro': 'Email e senha são obrigatórios'}), 400

    # Busca o usuário no banco de dados pelo email
    usuario = Usuario.query.filter_by(email=email).first()

    # Verifica se o usuário existe E se a senha enviada corresponde ao hash salvo no banco
    if not usuario or not bcrypt.check_password_hash(usuario.senha_hash, senha):
        return jsonify({'erro': 'Credenciais inválidas'}), 401 # Código 401: Unauthorized

    # Se as credenciais estiverem corretas, criamos o token de acesso
    access_token = create_access_token(identity=str(usuario.id))
    
    # Retorna o token para o frontend
    return jsonify(access_token=access_token)

@api.route('/perfil', methods=['GET'])
@jwt_required() # <-- Este é o "segurança" que protege a rota
def meu_perfil():
    # A função get_jwt_identity() pega o 'id' do usuário que foi salvo no token durante o login
    id_do_usuario_logado = get_jwt_identity()

    # Busca o usuário no banco de dados com base nesse id
    usuario = Usuario.query.get(id_do_usuario_logado)

    if not usuario:
        return jsonify({"erro": "Usuário não encontrado"}), 404

    # Retorna os dados do usuário (sem a senha, claro!)
    return jsonify({
        "id": usuario.id,
        "nome": usuario.nome,
        "email": usuario.email
    })