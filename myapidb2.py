from fastapi import FastAPI, HTTPException, Depends
from sqlmodel import SQLModel, Field, Session, create_engine, select
from pydantic import BaseModel
from passlib.context import CryptContext
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import Column, Text
from datetime import datetime, timezone
from sqlalchemy import JSON
import json
from fastapi.staticfiles import StaticFiles

# Inisialisasi FastAPI
app = FastAPI()

app.mount("/thumbnails", StaticFiles(directory="thumbnails"), name="thumbnails")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Mengizinkan asal permintaan tertentu
    allow_credentials=True,
    allow_methods=["*"],  # Mengizinkan semua metode HTTP (GET, POST, PUT, DELETE, dll.)
    allow_headers=["*"],  # Mengizinkan semua header
)

# Inisialisasi hashing password
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Konfigurasi database SQLite
DATABASE_URL = "sqlite:///users.db"
engine = create_engine(DATABASE_URL, echo=True)

# Model SQLModel untuk tabel User
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    password: str
    modules: str = Field(default="")  # Disimpan sebagai string (dipisahkan koma)
    liked_forums : List[dict] = Field(default = [], sa_column=Column(JSON))
    disliked_forums : List[dict] = Field(default = [], sa_column=Column(JSON))

class LikedForums(BaseModel):
    forum_id: int

class DislikedForums(BaseModel):
    forum_id: int

# Model Pydantic untuk request pembuatan user
class UserCreate(BaseModel):
    username: str
    password: str
    modules: List[str] = []  # List nama modul

class LoginRequest(BaseModel):
    username: str
    password: str

class Forum(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user : str = Field(sa_column = Column(Text))    
    text: str = Field(sa_column=Column(Text))  # Gunakan tipe `Text` agar lebih fleksibel
    upVoteCount: int = Field(default=0)  # Default ke 0
    downVoteCount: int = Field(default=0)  # Default ke 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    replies: List[dict] = Field(default=[], sa_column=Column(JSON))
    sentiment : str = Field(sa_column=Column(Text))

class ForumCreate(BaseModel) : 
    user : str
    text : str 
    upVoteCount : int = 0
    downVoteCount : int = 0
    sentiment : str

class Reply(BaseModel) : 
    user : str
    text : str 

# Fungsi untuk membuat database dan tabel jika belum ada
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# Fungsi hashing password
def hash_password(password: str):
    return pwd_context.hash(password)

# Fungsi verifikasi password
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

# Dependency untuk session database
def get_session():
    with Session(engine) as session:
        yield session

# Endpoint untuk membuat user baru
@app.post("/users/")
async def create_user(user: UserCreate, session: Session = Depends(get_session)):
    existing_user = session.exec(select(User).where(User.username == user.username)).first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    new_user = User(
        username=user.username,
        password=hash_password(user.password),
        modules=",".join(user.modules)  # Simpan list sebagai string
    )
    session.add(new_user)
    session.commit()
    return {"message": "User created successfully"}

# Endpoint untuk mendapatkan data user berdasarkan username
@app.get("/users/{username}")
async def get_user(username: str, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == username)).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "username": user.username,
        "modules": user.modules.split(",") if user.modules else []  # Konversi string ke list
    }

# Endpoint untuk update daftar modul user
@app.put("/users/{username}/modules")
async def update_user_modules(username: str, modules: List[str], session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == username)).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.modules = ",".join(modules)  # Simpan sebagai string dipisahkan koma
    session.add(user)
    session.commit()

    return {"message": "Modules updated successfully", "modules": modules}

# Endpoint untuk login user
@app.post("/login")
async def login_user(login_request: LoginRequest, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == login_request.username)).first()

    if not user:
        raise HTTPException(status_code=404, detail="Username not found")

    if not verify_password(login_request.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid password")

    return {"message": "Login successful", "username": user.username, "modules": user.modules.split(",") if user.modules else []}

@app.get("/get-forum") 
async def get_forum(session : Session = Depends(get_session))  :
    forum = session.exec(select(Forum)).all()
    return {
        "messages" : "Get Forum Success", 
        "forum" : [x.model_dump() for x in forum]
    }

@app.post("/post-forum")
async def post_forum(forum : ForumCreate, session : Session = Depends(get_session)) :
    new_forum = Forum(
        text=forum.text,
        user=forum.user,
        upVoteCount=forum.upVoteCount,
        downVoteCount=forum.downVoteCount,
        sentiment = forum.sentiment
    )
    session.add(new_forum)
    session.commit()
    session.refresh(new_forum)
    return {
      "message": "Forum posted successfully",
      "forum": new_forum.model_dump()  # ✅ Mengembalikan data dalam format dictionary
    }

from fastapi import HTTPException

@app.delete("/delete-forum/{id}")
async def delete_forum(id: int, session: Session = Depends(get_session)):
    forum = session.exec(select(Forum).where(Forum.id == id)).first()

    if not forum:
        raise HTTPException(status_code=404, detail="Forum not found")

    session.delete(forum)
    session.commit()
    return {"message": "Forum deleted successfully"}

@app.put("/put-upvote/{id}")
async def put_upvote(id: int, session: Session = Depends(get_session)):
    forum = session.exec(select(Forum).where(Forum.id == id)).first()

    if not forum:
        raise HTTPException(status_code=404, detail="Forum not found")

    forum.upVoteCount += 1
    session.add(forum)
    session.commit()
    session.refresh(forum)
    
    return {"message": "Upvote added successfully", "upVoteCount": forum.upVoteCount}

@app.put("/put-downvote/{id}")
async def put_downvote(id: int, session: Session = Depends(get_session)):
    forum = session.exec(select(Forum).where(Forum.id == id)).first()

    if not forum:
        raise HTTPException(status_code=404, detail="Forum not found")

    forum.downVoteCount += 1
    session.add(forum)
    session.commit()
    session.refresh(forum)
    
    return {"message": "downVote added successfully", "downVoteCount": forum.downVoteCount}

@app.post("/add-reply-forum/{id}")
async def add_reply_forum(reply: Reply, id: int, session: Session = Depends(get_session)):
    forum = session.exec(select(Forum).where(Forum.id == id)).first()
    if not forum:
        raise HTTPException(status_code=404, detail="Forum not found")

    # ✅ Ambil replies sebagai list, tambahkan reply baru, lalu simpan kembali
    updated_replies = forum.replies.copy()  # Salin data untuk menghindari error mutasi
    updated_replies.append(reply.model_dump())  # Tambahkan reply baru

    forum.replies = updated_replies  # Set ulang field replies
    session.add(forum)
    session.commit()
    session.refresh(forum)

    return {"message": "Reply added successfully", "forum": forum.model_dump()}

@app.post("/add-user-liked-forums/{username}/{id}")
async def add_user_liked_forums(id: int, username: str, liked_forums: LikedForums, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == username)).first()
    forum = session.exec(select(Forum).where(Forum.id == id)).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not forum:
        raise HTTPException(status_code=404, detail="Forum not found")

    temp_user_liked_forums = set(user.liked_forums)
    temp_user_disliked_forums = set(user.disliked_forums)

    forum_id = liked_forums.forum_id

    if forum_id in temp_user_liked_forums:
        # Jika sudah like, hapus dari like
        temp_user_liked_forums.remove(forum_id)
        forum.upVoteCount -= 1
        message = "Forum unliked successfully"
    else:
        # Jika belum like, tambahkan ke like
        temp_user_liked_forums.add(forum_id)
        forum.upVoteCount += 1
        message = "Forum liked successfully"

        # Jika sebelumnya user sudah dislike, hapus dari disliked_forums
        if forum_id in temp_user_disliked_forums:
            temp_user_disliked_forums.remove(forum_id)
            forum.downVoteCount -= 1

    user.liked_forums = list(temp_user_liked_forums)
    user.disliked_forums = list(temp_user_disliked_forums)

    session.add(user)
    session.add(forum)
    session.commit()
    session.refresh(user)
    session.refresh(forum)

    return {"message": message, "user": user, "forum": forum}


@app.post("/add-user-disliked-forums/{username}/{id}")
async def add_user_disliked_forums(id: int, username: str, disliked_forums: DislikedForums, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == username)).first()
    forum = session.exec(select(Forum).where(Forum.id == id)).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not forum:
        raise HTTPException(status_code=404, detail="Forum not found")

    temp_user_liked_forums = set(user.liked_forums)
    temp_user_disliked_forums = set(user.disliked_forums)

    forum_id = disliked_forums.forum_id

    if forum_id in temp_user_disliked_forums:
        # Jika sudah dislike, hapus dari dislike
        temp_user_disliked_forums.remove(forum_id)
        forum.downVoteCount -= 1
        message = "Forum undisliked successfully"
    else:
        # Jika belum dislike, tambahkan ke dislike
        temp_user_disliked_forums.add(forum_id)
        forum.downVoteCount += 1
        message = "Forum disliked successfully"

        # Jika sebelumnya user sudah like, hapus dari liked_forums
        if forum_id in temp_user_liked_forums:
            temp_user_liked_forums.remove(forum_id)
            forum.upVoteCount -= 1

    user.liked_forums = list(temp_user_liked_forums)
    user.disliked_forums = list(temp_user_disliked_forums)

    session.add(user)
    session.add(forum)
    session.commit()
    session.refresh(user)
    session.refresh(forum)

    return {"message": message, "user": user, "forum": forum}

# Fungsi untuk membaca data dari modules.json
def read_json_file():
    try:
        with open("modules.json", "r", encoding="utf-8") as file:
            return json.load(file)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid JSON format")

# Endpoint untuk mendapatkan semua modul
@app.get("/modules")
async def get_modules():
    return read_json_file()

# Buat database saat aplikasi pertama kali dijalankan
create_db_and_tables()
