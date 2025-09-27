from database import db

# A classe Usuario herda de db.Model, que é a classe base para todos os modelos do SQLAlchemy
class Usuario(db.Model):
    # __tablename__ define o nome da tabela no banco de dados. É uma boa prática usar nomes no plural e em minúsculas.
    __tablename__ = 'usuarios'

    # Definindo as colunas da tabela 'usuarios'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    
    # Armazenaremos o hash da senha, e não a senha em texto puro, por segurança.
    senha_hash = db.Column(db.String(256), nullable=False)

    def __repr__(self):
        # O método __repr__ define como o objeto será exibido, o que é útil para debugging.
        return f'<Usuario {self.nome}>'

# Você pode adicionar outros models aqui no futuro, como o de Exercícios, por exemplo.
# class Exercicio(db.Model):
#     ...