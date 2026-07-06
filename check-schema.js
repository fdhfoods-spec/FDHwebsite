const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false }, global: { fetch: fetch } })

async function check() {
  const { data, error } = await supabase.from('users').select('*').limit(1)
  console.log('Users schema:', data && data[0] ? Object.keys(data[0]) : error)
  
  const { data: addrData, error: addrErr } = await supabase.from('addresses').select('*').limit(1)
  console.log('Addresses table:', addrErr ? addrErr.message : 'exists')
}
check()
