import { useState, useRef } from "react"

export default function Home(){

const[token,setToken]=useState("")
const[repo,setRepo]=useState("")
const[file,setFile]=useState(null)
const[isPrivate,setIsPrivate]=useState(false)
const[msg,setMsg]=useState("")

const fileInput=useRef()

const maxSize=15*1024*1024

function handleFile(f){

if(!f)return

if(!f.name.endsWith(".zip")){
alert("File harus ZIP")
return
}

if(f.size>maxSize){
alert("Max 15MB")
return
}

setFile(f)
}

function drop(e){
e.preventDefault()
handleFile(e.dataTransfer.files[0])
}

async function upload(){

if(!token||!repo||!file){
alert("Isi semua field")
return
}

const form=new FormData()

form.append("token",token)
form.append("repo",repo)
form.append("private",isPrivate)
form.append("file",file)

setMsg("Uploading...")

const res=await fetch("/api/upload",{
method:"POST",
body:form
})

const data=await res.json()

if(data.repo){
setMsg("Success: "+data.repo)
}else{
setMsg(data.error)
}

}

return(

<div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">

<div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8">

<div className="text-center mb-6">
<h1 className="text-2xl font-bold text-white">
ZIP → GitHub Uploader
</h1>
<p className="text-slate-400 text-sm mt-1">
Upload ZIP and create repository instantly
</p>
</div>

<div className="space-y-4">

<input
className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-green-500 outline-none"
placeholder="GitHub Personal Access Token"
value={token}
onChange={e=>setToken(e.target.value)}
/>

<input
className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-green-500 outline-none"
placeholder="Repository Name"
value={repo}
onChange={e=>setRepo(e.target.value)}
/>

<label className="flex items-center gap-2 text-slate-400 text-sm">
<input
type="checkbox"
checked={isPrivate}
onChange={e=>setIsPrivate(e.target.checked)}
className="accent-green-500"
/>
Private Repository
</label>

<div
onDrop={drop}
onDragOver={e=>e.preventDefault()}
onClick={()=>fileInput.current.click()}
className="border-2 border-dashed border-slate-700 rounded-xl p-10 text-center cursor-pointer hover:border-green-500 hover:bg-slate-800 transition"
>

{file ? (
<div className="text-green-400 font-medium">
{file.name}
</div>
) : (
<div className="text-slate-400">
<p className="text-sm">
Drag & Drop ZIP here
</p>
<p className="text-xs mt-1 text-slate-500">
or click to upload (max 15MB)
</p>
</div>
)}

</div>

<input
type="file"
accept=".zip"
ref={fileInput}
className="hidden"
onChange={e=>handleFile(e.target.files[0])}
/>

<button
onClick={upload}
className="w-full bg-green-500 hover:bg-green-600 transition text-white font-semibold p-3 rounded-lg"
>
Create Repo & Upload
</button>

{msg && (
<div className="text-center text-sm text-slate-400 mt-2">
{msg}
</div>
)}

</div>

</div>

</div>

)

}
