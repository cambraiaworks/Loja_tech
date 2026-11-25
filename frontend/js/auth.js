function getToken() {
  return localStorage.getItem('nexvion_token')
}

function getUsuario() {
  const raw = localStorage.getItem('nexvion_usuario')
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch (e) {
    return null
  }
}

function estaLogado() {
  return getToken() !== null
}

function eAdmin() {
  const u = getUsuario()
  return u !== null && u.perfil === 'admin'
}

function setSession(token, usuario) {
  localStorage.setItem('nexvion_token', token)
  localStorage.setItem('nexvion_usuario', JSON.stringify(usuario))
}

function clearSession() {
  localStorage.removeItem('nexvion_token')
  localStorage.removeItem('nexvion_usuario')
}

async function fetchComAuth(url, options) {
  const token = getToken()
  const opts = options || {}
  opts.headers = opts.headers || {}
  if (token) {
    opts.headers['Authorization'] = 'Bearer ' + token
  }
  opts.headers['Content-Type'] = opts.headers['Content-Type'] || 'application/json'
  return fetch(url, opts)
}


async function sair() {
  try {
    const resp = await fetchComAuth(API_URL + '/auth/logout', { method: 'POST' })
    if (!resp.ok && resp.status !== 401) throw new Error('Falha ao encerrar sessão.')
    clearSession()
    window.location.href = 'index.html'
  } catch {
    alert('Não foi possível encerrar a sessão no servidor. Tente novamente.')
  }
}
