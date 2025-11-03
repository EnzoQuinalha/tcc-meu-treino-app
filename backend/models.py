from database import db

class Usuario(db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    senha_hash = db.Column(db.String(256), nullable=False)
    
    # Relação: Um usuário pode ter muitos treinos.
    treinos = db.relationship('Treino', backref='usuario', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f'<Usuario {self.nome}>'

# --- SEU MODELO IMPLEMENTADO ---

# Tabela 1: O Catálogo de todos os exercícios possíveis
class Exercicio(db.Model):
    __tablename__ = 'exercicios'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(120), unique=True, nullable=False)
    gif_url = db.Column(db.String(255)) # URL para o GIF demonstrativo

    def __repr__(self):
        return f'<Exercicio {self.nome}>'

# Tabela 2: A Ficha de Treino, que pertence a um usuário
class Treino(db.Model):
    __tablename__ = 'treinos'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(120), nullable=False) # Ex: "Treino A"
    dia = db.Column(db.String(50)) # Ex: "Segunda-feira", "Peito e Tríceps"
    
    # Chave estrangeira que liga o treino ao seu dono
    user_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    
    # Relação com a tabela de associação
    exercicios_associados = db.relationship('TreinoExercicio', backref='treino', lazy=True, cascade="all, delete-orphan")
    registros = db.relationship('RegistroTreino', backref='treino', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f'<Treino {self.nome}>'

# Tabela 3: A Tabela de Associação (Junction Table) que você idealizou
class TreinoExercicio(db.Model):
    __tablename__ = 'treino_exercicio'
    id = db.Column(db.Integer, primary_key=True) # ID próprio, como você sugeriu
    
    # Chaves estrangeiras
    treino_id = db.Column(db.Integer, db.ForeignKey('treinos.id'), nullable=False)
    exercicio_id = db.Column(db.Integer, db.ForeignKey('exercicios.id'), nullable=False)
    
    # Dados específicos desta combinação
    series = db.Column(db.String(50))
    repeticoes = db.Column(db.String(50))
    descanso_seg = db.Column(db.Integer)
    peso = db.Column(db.String(50), nullable=True) # Opcional, como você sugeriu
    
    # Relações para facilitar a navegação
    exercicio = db.relationship('Exercicio')

    def __repr__(self):
        return f'<Associacao Treino ID:{self.treino_id} Exercicio ID:{self.exercicio_id}>'
    
class RegistroTreino(db.Model):
    __tablename__ = 'registros_treino'

    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.Date, nullable=False) 
    user_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    treino_id = db.Column(db.Integer, db.ForeignKey('treinos.id'), nullable=False)
    
    usuario = db.relationship('Usuario')
    def __repr__(self):
        return f'<RegistroTreino user:{self.user_id} data:{self.data}>'