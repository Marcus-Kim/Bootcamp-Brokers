# SQLAlchemy References

References for SQLAlchemy relationships when building your backend

## Relationships

- **Unidirectional:** We only need to define the `db.relationship` attribute on the model that has the foreign key to the other model.
  > **Note:** we do not use `backref` or `back_populates` in a unidirectional relationship

```py
class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    category = db.relationship('Category')
```

- **Bidirectional:** We use either `backref` or `back_populates` to define a bidirectional relationship of all types *(One-to-One, One-to-Many, Many-to-Many)*

  - **backref** vs **back_populates:**
    - `backref` - Only applied to one of the models, and automatically creates the attribute on the other model.
    - `back_populates` - Applied to both models in order to explicitly name the attributes.

```py
#backref
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(100))
    posts = db.relationship('Post', backref='author', lazy=True)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    content = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

#back_populates
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    posts = db.relationship('Post', back_populates='author')

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50))
    content = db.Column(db.Text)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    author = db.relationship('User', back_populates='posts')
```
