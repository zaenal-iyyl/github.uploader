import formidable from "formidable"
import AdmZip from "adm-zip"
import fs from "fs"
import path from "path"
import { Octokit } from "@octokit/rest"

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(req, res) {

  const form = formidable({
    uploadDir: "/tmp",
    keepExtensions: true,
    multiples: false
  })

  form.parse(req, async (err, fields, files) => {

    if (err) {
      return res.status(500).json({ error: "Upload gagal" })
    }

    try {

      const token = (Array.isArray(fields.token) ? fields.token[0] : fields.token)?.toString().trim()
      const repo = (Array.isArray(fields.repo) ? fields.repo[0] : fields.repo)?.toString().trim()
      const isPrivate = fields.private === "true"

      if (!token || !repo) {
        return res.status(400).json({ error: "Token atau repo kosong" })
      }

      const uploaded = files.file

      let zipPath

      if (Array.isArray(uploaded)) {
        zipPath = uploaded[0].filepath
      } else {
        zipPath = uploaded?.filepath
      }

      if (!zipPath) {
        return res.status(400).json({ error: "ZIP tidak terbaca" })
      }

      const stats = fs.statSync(zipPath)

      const maxSize = 15 * 1024 * 1024

      if (stats.size > maxSize) {
        return res.status(400).json({ error: "ZIP melebihi 15MB" })
      }

      const octokit = new Octokit({
        auth: token
      })

      const user = await octokit.users.getAuthenticated()

      const username = user.data.login

      await octokit.repos.createForAuthenticatedUser({
        name: repo,
        private: isPrivate
      })

      const zip = new AdmZip(zipPath)

      const extractPath = "/tmp/extracted"

      if (!fs.existsSync(extractPath)) {
        fs.mkdirSync(extractPath)
      }

      zip.extractAllTo(extractPath, true)

      const filesList = getFiles(extractPath)

      for (const file of filesList) {

        const content = fs.readFileSync(file).toString("base64")

        const relativePath = file.replace(extractPath + "/", "")

        await octokit.repos.createOrUpdateFileContents({
          owner: username,
          repo: repo,
          path: relativePath,
          message: "upload via web",
          content: content
        })
      }

      return res.json({
        repo: `https://github.com/${username}/${repo}`
      })

    } catch (e) {

      return res.status(500).json({
        error: e.message
      })

    }

  })

}

function getFiles(dir) {

  let results = []

  const list = fs.readdirSync(dir)

  list.forEach(file => {

    const filePath = path.join(dir, file)

    const stat = fs.statSync(filePath)

    if (stat && stat.isDirectory()) {

      results = results.concat(getFiles(filePath))

    } else {

      results.push(filePath)

    }

  })

  return results
}
