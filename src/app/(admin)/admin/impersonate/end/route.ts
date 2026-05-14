import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const logId = request.cookies.get('imp_log')?.value
  const type  = request.cookies.get('imp_type')?.value

  // Clôture de la session dans l'audit log
  if (logId) {
    const supabase = createClient()
    await supabase.rpc('log_impersonation_end', { p_log_id: logId })
  }

  // Retour au back-office sur la liste correspondante
  const backTo = type === 'client' ? '/admin/clients' : '/admin/artisans'
  const response = NextResponse.redirect(new URL(backTo, request.url))

  // Suppression des cookies d'impersonation
  for (const name of ['imp_id', 'imp_type', 'imp_name', 'imp_log']) {
    response.cookies.delete(name)
  }

  return response
}
