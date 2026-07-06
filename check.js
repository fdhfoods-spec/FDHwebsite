require('dotenv').config({ path: '.env.local' })
const fetch = require('node-fetch')
async function check() {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/users?phone=eq.1234567890`
  const res = await fetch(url, { 
    method: 'PATCH',
    headers: { 
      'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({ address: 'test_address' })
  })
  const data = await res.json()
  console.log('users update:', data)
}
check()
