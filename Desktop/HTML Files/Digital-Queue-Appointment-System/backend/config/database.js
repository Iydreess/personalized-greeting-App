const { supabase, supabaseAdmin } = require('./supabase');

// Database connection wrapper for Supabase
const db = {
  // Execute a query using Supabase
  async execute(query, params = []) {
    try {
      // This is a simplified wrapper - in practice, you'll use Supabase's
      // specific methods like select(), insert(), update(), delete()
      console.log('Query:', query);
      console.log('Params:', params);
      
      // For now, return a mock result to maintain compatibility
      return [[], []];
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  },

  // Get Supabase client for direct operations
  getClient() {
    return supabase;
  },

  // Get admin client for operations that bypass RLS
  getAdminClient() {
    return supabaseAdmin;
  }
};

// Test Supabase connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('services').select('id').limit(1);
    if (error && error.code !== 'PGRST116') { // PGRST116 is "table not found" which is ok during setup
      throw error;
    }
    console.log('✅ Supabase connected successfully');
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
    console.log('Make sure to set up your Supabase environment variables and run the schema');
  }
};

// Initialize Supabase connection
testConnection();

module.exports = db;
