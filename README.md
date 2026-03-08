 → GitHub Repo Uploader

Tool untuk upload file ZIP lalu otomatis membuat repository dan mengupload semua file ke GitHub.

Tool ini berguna untuk orang yang ingin upload project ke GitHub langsung dari web atau HP tanpa perlu PC atau git command.

Features
- Upload file ZIP
- Auto extract ZIP
- Auto create GitHub repository
- Upload semua file ke repo
- Support public / private repo
- Limit upload 15MB
- UI web sederhana

--------------------------------------------------

Installation

Clone repository

git clone https://github.com/USERNAME/REPO.git
cd REPO

Install dependencies

npm install

Run development server

npm run dev

Buka di browser

http://localhost:3000

--------------------------------------------------

Deploy ke Vercel

1. Push project ke GitHub
2. Import project di Vercel
3. Deploy

Platform: Vercel

--------------------------------------------------

API Usage

Endpoint

POST /api/upload

Digunakan untuk upload file dan membuat repository.

Form Data

token   = GitHub Personal Access Token
repo    = Nama repository
private = true / false
file    = File ZIP

--------------------------------------------------

Example Request (curl)

curl -X POST http://localhost:3000/api/upload \
-F "token=GITHUB_TOKEN" \
-F "repo=my-repo" \
-F "private=false" \
-F "file=@project.zip"

--------------------------------------------------

Example Response

Success

{
 "repo": "https://github.com/username/my-repo"
}

Error

{
 "error": "ZIP max 15MB"
}

--------------------------------------------------

GitHub Token

Buat token di

https://github.com/settings/tokens

Permission yang diperlukan

repo

--------------------------------------------------

Upload Limit

Maximum file size

15MB

--------------------------------------------------

How It Works

1. User upload file ZIP
2. Server extract file
3. Server create repository
4. Semua file di upload ke repo

--------------------------------------------------

Tech Stack

Next.js
Tailwind CSS
GitHub API
Formidable
Adm-Zip

--------------------------------------------------

Use Case

Tool ini cocok untuk:

- User yang hanya memakai HP
- User yang tidak ingin menggunakan git command
- Upload project ke GitHub dengan cepat

--------------------------------------------------

License

MIT License
