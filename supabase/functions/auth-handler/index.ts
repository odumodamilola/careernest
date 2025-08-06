import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, userData, userId, credits, actionType, featureUsed } = await req.json();

    switch (action) {
      case 'onSignUp':
        // Initialize user profile with enterprise features
        const { error: insertError } = await supabaseClient
          .from('users')
          .insert({
            id: userData.id,
            email: userData.email,
            role: userData.role || 'trial',
            plan_tier: userData.planTier || 'free',
            credit_quota: userData.planTier === 'pro' ? 1000 : userData.planTier === 'starter' ? 200 : 100,
            profile_data: {
              full_name: userData.fullName,
              onboarding_completed: false
            },
            email_verified: false,
            terms_accepted_at: new Date().toISOString(),
            privacy_accepted_at: new Date().toISOString()
          });

        if (insertError) {
          console.error('Profile creation error:', insertError);
          throw insertError;
        }

        // Log security event
        await supabaseClient.rpc('log_security_event', {
          user_uuid: userData.id,
          event_type_param: 'registration_success',
          severity_param: 'info',
          metadata_param: { source: 'auth_handler' }
        });

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'checkCredits':
        const { data: user, error: userError } = await supabaseClient
          .from('users')
          .select('credit_quota, credits_used, plan_tier')
          .eq('id', userId)
          .single();

        if (userError) throw userError;

        const available = user.credit_quota - user.credits_used;
        
        return new Response(
          JSON.stringify({ 
            available,
            canProceed: available >= (credits || 1),
            planLimit: user.credit_quota,
            planTier: user.plan_tier
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'consumeCredits':
        const { data: consumeResult, error: consumeError } = await supabaseClient
          .rpc('consume_user_credits', {
            user_uuid: userId,
            credits_to_consume: credits,
            action_type_param: actionType,
            feature_used_param: featureUsed
          });

        if (consumeError) throw consumeError;

        return new Response(
          JSON.stringify({ success: consumeResult }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'getUserAnalytics':
        const { data: analytics, error: analyticsError } = await supabaseClient
          .from('activity_logs')
          .select('action, created_at, metadata, success')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(100);

        if (analyticsError) throw analyticsError;

        return new Response(
          JSON.stringify({ analytics }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'cleanupSessions':
        const { data: cleanupResult, error: cleanupError } = await supabaseClient
          .rpc('cleanup_expired_sessions');

        if (cleanupError) throw cleanupError;

        return new Response(
          JSON.stringify({ deletedSessions: cleanupResult }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error: any) {
    console.error('Auth handler error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.details || null
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});