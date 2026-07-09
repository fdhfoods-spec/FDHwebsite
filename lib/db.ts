import fs from 'fs'
import path from 'path'

const dbPath = path.join(process.cwd(), 'data', 'db.json')

export interface DatabaseSchema {
  products: any[]
}

const defaultDb: DatabaseSchema = {
  products: []
}

export function initDb() {
  const dataDir = path.dirname(dbPath)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(defaultDb, null, 2))
  }
}

export function readDb(): DatabaseSchema {
  initDb()
  try {
    const data = fs.readFileSync(dbPath, 'utf8')
    return JSON.parse(data)
  } catch (err) {
    console.error('Error reading DB:', err)
    return defaultDb
  }
}

export function writeDb(data: DatabaseSchema) {
  initDb()
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
}
