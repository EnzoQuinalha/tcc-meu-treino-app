from flask import Blueprint, request, jsonify
from database import db
from models import Usuario, Treino, Exercicio, TreinoExercicio
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

@api.route('/treinos', methods=['POST'])
@jwt_required()
def criar_treino():
    # Pega o ID do usuário logado a partir do token
    user_id = get_jwt_identity()
    
    # Pega os dados JSON da requisição
    dados = request.get_json()

    nome_treino = dados.get('nome')
    dia_treino = dados.get('dia')
    exercicios_data = dados.get('exercicios') # Esta será uma lista

    if not nome_treino or not exercicios_data:
        return jsonify({"erro": "Nome do treino e lista de exercícios são obrigatórios"}), 400

    # Cria a nova ficha de treino e associa ao usuário logado
    novo_treino = Treino(nome=nome_treino, dia=dia_treino, user_id=user_id)
    db.session.add(novo_treino)

    # Itera sobre a lista de exercícios recebida
    for exercicio_info in exercicios_data:
        # Verifica se o exercício existe no nosso catálogo (tabela 'exercicios')
        exercicio_id = exercicio_info.get('exercicio_id')
        exercicio_catalogo = Exercicio.query.get(exercicio_id)
        if not exercicio_catalogo:
            return jsonify({"erro": f"Exercício com ID {exercicio_id} não encontrado no catálogo"}), 404

        # Cria a associação entre o novo treino e o exercício do catálogo
        nova_associacao = TreinoExercicio(
            treino=novo_treino,  # Associa com o treino que acabamos de criar
            exercicio_id=exercicio_id,
            series=exercicio_info.get('series'),
            repeticoes=exercicio_info.get('repeticoes'),
            descanso_seg=exercicio_info.get('descanso_seg'),
            peso=exercicio_info.get('peso')
        )
        db.session.add(nova_associacao)

    # Salva tudo no banco de dados de uma vez
    db.session.commit()

    return jsonify({"mensagem": "Treino criado com sucesso!"}), 201

@api.route('/treinos', methods=['GET'])
@jwt_required()
def listar_treinos():
    # Pega o ID do usuário logado a partir do token
    user_id = get_jwt_identity()
    
    # Busca no banco de dados todos os treinos que pertencem a este usuário
    treinos_do_usuario = Treino.query.filter_by(user_id=user_id).all()
    
    # Precisamos converter os objetos de treino (que o Python entende) 
    # para um formato que possa ser enviado como JSON (dicionários e listas).
    resultado = []
    for treino in treinos_do_usuario:
        exercicios_list = []
        for assoc in treino.exercicios_associados:
            exercicios_list.append({
                "id_exercicio": assoc.exercicio.id,
                "nome_exercicio": assoc.exercicio.nome,
                "gif_url": assoc.exercicio.gif_url,
                "series": assoc.series,
                "repeticoes": assoc.repeticoes,
                "descanso_seg": assoc.descanso_seg,
                "peso": assoc.peso
            })

        resultado.append({
            "id": treino.id,
            "nome": treino.nome,
            "dia": treino.dia,
            "exercicios": exercicios_list
        })
        
    return jsonify(resultado)

@api.route('/treinos/<int:treino_id>', methods=['DELETE'])
@jwt_required()
def apagar_treino(treino_id):
    # Pega o ID do usuário logado a partir do token
    user_id = get_jwt_identity()
    
    # Busca o treino no banco de dados pelo ID fornecido na URL
    treino = Treino.query.get(treino_id)
    
    # --- Verificações de segurança ---
    # 1. Verifica se o treino realmente existe
    if not treino:
        return jsonify({"erro": "Treino não encontrado"}), 404
        
    # 2. Verifica se o treino pertence ao usuário que está tentando apagá-lo
    if str(treino.user_id) != user_id:
        return jsonify({"erro": "Acesso não autorizado"}), 403 # 403 Forbidden
        
    # Se tudo estiver certo, apaga o treino do banco de dados
    db.session.delete(treino)
    db.session.commit()
    
    return jsonify({"mensagem": "Treino apagado com sucesso"})

@api.route('/exercicios', methods=['GET'])
@jwt_required()
def listar_catalogo_exercicios():
    # Busca todos os exercícios da tabela 'exercicios'
    todos_exercicios = Exercicio.query.order_by(Exercicio.nome).all()
    
    # Converte a lista de objetos para um formato JSON
    resultado = [{
        "id": ex.id,
        "nome": ex.nome,
        "gif_url": ex.gif_url
    } for ex in todos_exercicios]
    
    return jsonify(resultado)

@api.route('/treinos/<int:treino_id>', methods=['GET'])
@jwt_required()
def obter_treino_por_id(treino_id):
    user_id = get_jwt_identity()
    
    treino = Treino.query.get(treino_id)
    
    # Verificações de segurança
    if not treino:
        return jsonify({"erro": "Treino não encontrado"}), 404
        
    if str(treino.user_id) != user_id:
        return jsonify({"erro": "Acesso não autorizado"}), 403

    # Serializa o treino e seus exercícios (lógica parecida com a de listar_treinos)
    exercicios_list = []
    for assoc in treino.exercicios_associados:
        exercicios_list.append({
            "id_associacao": assoc.id, # Pode ser útil no frontend
            "exercicio_id": assoc.exercicio.id,
            "nome_exercicio": assoc.exercicio.nome,
            "series": assoc.series,
            "repeticoes": assoc.repeticoes,
            "descanso_seg": assoc.descanso_seg,
            "peso": assoc.peso
        })

    resultado = {
        "id": treino.id,
        "nome": treino.nome,
        "dia": treino.dia,
        "exercicios": exercicios_list
    }
        
    return jsonify(resultado)

@api.route('/treinos/<int:treino_id>', methods=['PUT'])
@jwt_required()
def atualizar_treino(treino_id):
    user_id = get_jwt_identity()
    
    # Busca o treino que será editado
    treino = Treino.query.get(treino_id)
    
    # Verificações de segurança (se existe e se pertence ao usuário)
    if not treino:
        return jsonify({"erro": "Treino não encontrado"}), 404
    if str(treino.user_id) != user_id:
        return jsonify({"erro": "Acesso não autorizado"}), 403

    # Pega os novos dados do corpo da requisição
    dados = request.get_json()
    
    # Atualiza os campos simples
    treino.nome = dados.get('nome', treino.nome)
    treino.dia = dados.get('dia', treino.dia)
    
    # Estratégia "delete e recrie" para os exercícios
    # 1. Apaga todos os exercícios atualmente associados a este treino
    TreinoExercicio.query.filter_by(treino_id=treino_id).delete()
    
    # 2. Cria as novas associações com base nos dados recebidos
    exercicios_data = dados.get('exercicios')
    if exercicios_data:
        for exercicio_info in exercicios_data:
            exercicio_id = exercicio_info.get('exercicio_id')
            # Validação se o exercício existe no catálogo omitida por simplicidade,
            # mas seria bom adicionar em um projeto real
            nova_associacao = TreinoExercicio(
                treino_id=treino.id,
                exercicio_id=exercicio_id,
                series=exercicio_info.get('series'),
                repeticoes=exercicio_info.get('repeticoes'),
                descanso_seg=exercicio_info.get('descanso_seg'),
                peso=exercicio_info.get('peso')
            )
            db.session.add(nova_associacao)
            
    # Salva todas as alterações no banco
    db.session.commit()
    
    return jsonify({"mensagem": "Treino atualizado com sucesso!"})
