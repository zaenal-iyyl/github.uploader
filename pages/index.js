import { useState, useRef } from "react";

export default function Home() {

  const [file,setFile] = useState(null)
  const [repo,setRepo] = useState("")
  const [token,setToken] = useState("")
  const [isPrivate,setIsPrivate] = useState(false)
  const [msg,setMsg] = useState("")

  const fileInput = useRef()

  const handleDrop = (e)=>{
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    setFile(f)
  }

  const handleSelect = (e)=>{
    const f = e.target.files[0]
    setFile(f)
  }

  const upload = async ()=>{

    if(!file) return alert("Upload ZIP dulu")

    const form = new FormData()

    form.append("file",file)
    form.append("repo",repo)
    form.append("token",token)
    form.append("private",isPrivate)

    setMsg("Uploading...")

    const res = await fetch("/api/upload",{
      method:"POST",
      body:form
    })

    const data = await res.json()

    setMsg(JSON.stringify(data))
  }

  return (

<div style={{
height:"100vh",
display:"flex",
justifyContent:"center",
alignItems:"center",
background:"#0f172a",
fontFamily:"sans-serif"
}}>

<div style={{
width:"400px",
background:"#1e293b",
padding:"30px",
borderRadius:"10px",
color:"white"
}}>

<h2 style={{textAlign:"center"}}>ZIP → GitHub Repo</h2>

<input
placeholder="GitHub Token"
value={token}
onChange={e=>setToken(e.target.value)}
style={input}
/>

<input
placeholder="Repository Name"
value={repo}
onChange={e=>setRepo(e.target.value)}
style={input}
/>

<label style={{display:"block",marginBottom:"10px"}}>
<input
type="checkbox"
checked={isPrivate}
onChange={e=>setIsPrivate(e.target.checked)}
/> Private Repo
</label>

<div
onDrop={handleDrop}
onDragOver={(e)=>e.preventDefault()}
onClick={()=>fileInput.current.click()}
style={{
border:"2px dashed #475569",
padding:"40px",
textAlign:"center",
borderRadius:"8px",
cursor:"pointer",
marginBottom:"15px"
}}
>

{file ? file.name : "Drag ZIP here or click"}

</div>

<input
type="file"
accept=".zip"
ref={fileInput}
onChange={handleSelect}
style={{display:"none"}}
/>

<button
onClick={upload}
style={{
width:"100%",
padding:"10px",
background:"#22c55e",
border:"none",
borderRadius:"6px",
color:"white",
fontWeight:"bold",
cursor:"pointer"
}}
>
Upload
</button>

<p style={{marginTop:"10px",fontSize:"14px"}}>{msg}</p>

</div>
</div>

  )

}

const input = {
width:"100%",
padding:"10px",
marginBottom:"10px",
borderRadius:"6px",
border:"none"
}
