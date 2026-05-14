import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id   = searchParams.get('id')
  const type = searchParams.get('type')   // 'artisan' | 'client'
  const name = searchParams.get('name')

  if (!id || !type || !name || !['artisan', 'client'].includes(type)) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // Enregistrement de la session dans l'audit log (SECURITY DEFINER contourne RLS)
  const supabase = createClient()
  const { data: logId } = await supabase.rpc('log_impersonation_start', {
    p_target_id:   id,
    p_target_type: type,
    p_target_name: decodeURIComponent(name),
    p_admin_email: 'cyril.chomette@investhub.cloud',
  })

  // Redirection vers le portail correspondant
  const destination = type === 'artisan' ? '/historiques' : '/chantier'
  const response = NextResponse.redirect(new URL(destination, request.url))

  const opts = { path: '/', maxAge: 3600, sameSite: 'lax' as const }
  response.cookies.set('imp_id',   id,   opts)
  response.cookies.set('imp_type', type, opts)
  response.cookies.set('imp_name', name, opts)
  if (logId) {
    response.cookies.set('imp_log', String(logId), opts)
  }

  return response
}
