const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321', 
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'fake'
);
async function test() {
  const { data, error } = await supabase.from('products').select('id, name, image').order('id', { ascending: false }).limit(2);
  console.log(data, error);
}
test();
