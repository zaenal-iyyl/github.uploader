import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [repo, setRepo] = useState("");
  const [token, setToken] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [msg, setMsg] = useState("");

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    setFile(f);
  };

  const upload = async () => {

    if (!file) return alert("Upload ZIP dulu");

    const form = new FormData();
    form.append("file", file);
    form.append("repo", repo);
    form.append("token", token);
    form.append("private", isPrivate);

    setMsg("Uploading...");

    const res = await fetch("/api/upload", {
      method: "POST",
      body: form
    });

    const data = await res.json();

    setMsg(JSON.stringify(data));
  };

  return (
    <div style={{padding:40,fontFamily:"sans-serif"}}>

      <h1>ZIP → GitHub Repo</h1>

      <input
        placeholder="GitHub Token"
        value={token}
        onChange={e=>setToken(e.target.value)}
      />

      <br/><br/>

      <input
        placeholder="Repo Name"
        value={repo}
        onChange={e=>setRepo(e.target.value)}
      />

      <br/><br/>

      <label>
        <input
          type="checkbox"
          checked={isPrivate}
          onChange={e=>setIsPrivate(e.target.checked)}
        />
        Private Repo
      </label>

      <br/><br/>

      <div
        onDrop={handleDrop}
        onDragOver={(e)=>e.preventDefault()}
        style={{
          border:"2px dashed gray",
          padding:40,
          textAlign:"center"
        }}
      >
        {file ? file.name : "Drag ZIP here"}
      </div>

      <br/>

      <button onClick={upload}>
        Upload
      </button>

      <p>{msg}</p>

    </div>
  );
}