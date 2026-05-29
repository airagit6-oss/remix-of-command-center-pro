const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rvwgyjrqboscaficjwjt.supabase.co';
// You'll need to add your service role key to .env or add it here temporarily
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndFixRole() {
  const email = process.argv[2]; // Pass email as argument
  
  if (!email) {
    console.log('Usage: node check-role.js <email>');
    process.exit(1);
  }

  console.log(`Checking role for: ${email}`);

  // Get user by email
  const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
  
  if (userError) {
    console.error('Error fetching users:', userError);
    return;
  }

  const user = users.find(u => u.email === email);
  
  if (!user) {
    console.log('User not found with email:', email);
    return;
  }

  console.log('User ID:', user.id);

  // Check current roles
  const { data: roles, error: rolesError } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', user.id);

  if (rolesError) {
    console.error('Error fetching roles:', rolesError);
    return;
  }

  console.log('Current roles:', roles);

  // Check if user has boss_owner role
  const hasBossOwner = roles.some(r => r.role === 'boss_owner');

  if (!hasBossOwner) {
    console.log('User does not have boss_owner role. Assigning...');
    
    const { error: insertError } = await supabase
      .from('user_roles')
      .insert({
        user_id: user.id,
        role: 'boss_owner',
        approval_status: 'approved'
      });

    if (insertError) {
      console.error('Error assigning role:', insertError);
    } else {
      console.log('Successfully assigned boss_owner role!');
    }
  } else {
    console.log('User already has boss_owner role');
  }
}

checkAndFixRole();
