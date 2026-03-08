import formidable from "formidable"
import AdmZip from "adm-zip"
import fs from "fs"
import path from "path"
import { Octokit } from "@octokit/rest"

export const config = {
 api:{ bodyParser:false }
}

export default async function handler(req,res){

 const form=formidable({uploadDir:"/tmp",keepExtensions:true})

 form.parse(req,async(err,fields,files)=>{

 try{

 const token=(Array.isArray(fields.token)?fields.token[0]:fields.token)?.toString().trim()
 const repo=(Array.isArray(fields.repo)?fields.repo[0]:fields.repo)?.toString().trim()
 const isPrivate=fields.private==="true"

 const zipPath=files.file.filepath

 const stats=fs.statSync(zipPath)

 const maxSize=15*1024*1024

 if(stats.size>maxSize){
  return res.status(400).json({error:"ZIP melebihi 15MB"})
 }

 const octokit=new Octokit({auth:token})

 const user=await octokit.users.getAuthenticated()

 const username=user.data.login

 await octokit.repos.createForAuthenticatedUser({
  name:repo,
  private:isPrivate
 })

 const zip=new AdmZip(zipPath)

 const extract="/tmp/extract"

 zip.extractAllTo(extract,true)

 const filesList=getFiles(extract)

 for(const file of filesList){

 const content=fs.readFileSync(file).toString("base64")

 const filePath=file.replace(extract+"/","")

 await octokit.repos.createOrUpdateFileContents({
  owner:username,
  repo,
  path:filePath,
  message:"upload via web",
  content
 })

 }

 res.json({
  repo:`https://github.com/${username}/${repo}`
 })

 }catch(e){

 res.status(500).json({error:e.message})

 }

 })

}

function getFiles(dir){

 let results=[]

 const list=fs.readdirSync(dir)

 list.forEach(file=>{

 file=path.join(dir,file)

 const stat=fs.statSync(file)

 if(stat && stat.isDirectory()){
  results=results.concat(getFiles(file))
 }else{
  results.push(file)
 }

 })

 return results

}
