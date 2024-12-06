from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from datetime import datetime
import os
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['SECRET_KEY'] = 'nopaswordnamepidoryourbad'  
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///blog.db'
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'admin_login'


if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    attachment = db.Column(db.String(200))
    likes = db.Column(db.Integer, default=0)
    views = db.Column(db.Integer, default=0)

class Like(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'))
    ip_address = db.Column(db.String(50))

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/bio')
def bio():
    return render_template('bio.html')

@app.route('/thoughts')
def thoughts():
    posts = Post.query.order_by(Post.timestamp.desc()).all()
    return render_template('thoughts.html', posts=posts)

@app.route('/support')
def support():
    return render_template('support.html')

@app.route('/add_post', methods=['POST'])
def add_post():
    content = request.form.get('content')
    file = request.files.get('attachment')
    
    filename = None
    if file and file.filename:
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    
    post = Post(content=content, attachment=filename)
    db.session.add(post)
    db.session.commit()
    
    return jsonify({'success': True})

@app.route('/like_post/<int:post_id>', methods=['POST'])
def like_post(post_id):
    ip_address = request.remote_addr
    existing_like = Like.query.filter_by(post_id=post_id, ip_address=ip_address).first()
    
    if not existing_like:
        like = Like(post_id=post_id, ip_address=ip_address)
        post = Post.query.get_or_404(post_id)
        post.likes += 1
        db.session.add(like)
        db.session.commit()
        return jsonify({'success': True, 'likes': post.likes})
    
    return jsonify({'success': False, 'message': 'Already liked'})

@app.route('/view_post/<int:post_id>', methods=['POST'])
def view_post(post_id):
    post = Post.query.get_or_404(post_id)
    post.views += 1
    db.session.commit()
    return jsonify({'success': True, 'views': post.views})

@app.route('/admin')
@login_required
def admin():
    posts = Post.query.order_by(Post.timestamp.desc()).all()
    return render_template('admin.html', posts=posts)

@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        user = User.query.filter_by(username=username).first()
        
        if user and check_password_hash(user.password_hash, password):
            login_user(user)
            return redirect(url_for('admin'))
        
        flash('Invalid username or password')
    return render_template('login.html')

@app.route('/admin/logout')
@login_required
def admin_logout():
    logout_user()
    return redirect(url_for('index'))

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        if not User.query.filter_by(username='admin').first():
            admin = User(
                username='admin',
                password_hash=generate_password_hash('change-this-password')
            )
            db.session.add(admin)
            db.session.commit()
    app.run(debug=True)
