import { useState,useRef } from "react"

export default function Home(){

const [token,setToken]=useState("")
const [repo,setRepo]=useState("")
const [isPrivate,setIsPrivate]=useState(false)
const [file,setFile]=useState(null)
const [msg,setMsg]=useState("")

const fileInput=useRef()

const maxSize = 15 * 1024 * 1024

const handleFile=(f)=>{

 if(!f) return

 if(!f.name.endsWith(".zip")){
  alert("File harus ZIP")
  return
 }

 if(f.size > maxSize){
  alert("ZIP maksimal 15MB")
  return
 }

 setFile(f)
}

const drop=(e)=>{
 e.preventDefault()
 handleFile(e.dataTransfer.files[0])
}

const select=(e)=>{
 handleFile(e.target.files[0])
}

const upload=async()=>{

 if(!token || !repo || !file){
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
  setMsg("Repo created: "+data.repo)
 }else{
  setMsg(data.error)
 }

}

return(

<div className="min-h-screen flex items-center justify-center bg-slate-900">

<div className="w-[420px] bg-slate-800 p-6 rounded-xl shadow-xl">

<h1 className="text-xl font-bold text-white text-center mb-6">
ZIP → GitHub Repo
</h1>

<input
placeholder="GitHub Token"
value={token}
onChange={e=>setToken(e.target.value)}
className="w-full p-2 mb-3 rounded bg-slate-700 text-white"
/>

<input
placeholder="Repository Name"
value={repo}
onChange={e=>setRepo(e.target.value)}
className="w-full p-2 mb-3 rounded bg-slate-700 text-white"
/>

<label className="text-gray-300 text-sm mb-3 block">
<input
type="checkbox"
checked={isPrivate}
onChange={e=>setIsPrivate(e.target.checked)}
className="mr-2"
/>
Private Repo
</label>

<div
onDrop={drop}
onDragOver={(e)=>e.preventDefault()}
onClick={()=>fileInput.current.click()}
className="border-2 border-dashed border-slate-600 hover:border-green-400 transition rounded-lg p-8 text-center text-gray-400 cursor-pointer"
>

{file ? file.name : "Drag ZIP here or click"}

</div>

<p className="text-xs text-gray-400 text-center mt-2">
Max ZIP size: 15MB
</p>

<input
type="file"
accept=".zip"
ref={fileInput}
onChange={select}
className="hidden"
/>

<button
onClick={upload}
className="w-full mt-4 bg-green-500 hover:bg-green-600 p-2 rounded text-white font-semibold"
>
Upload
</button>

<p className="text-center text-gray-300 mt-4 text-sm">
{msg}
</p>

</div>

</div>

)

}
