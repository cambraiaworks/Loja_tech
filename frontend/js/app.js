var grid = document.getElementById('produtosGrid')
var badge = document.getElementById('carrinhoBadge')
var btnAbrirCart = document.getElementById('btnAbrirCarrinho')
var btnFecharCart = document.getElementById('btnFecharCarrinho')
var painelCart = document.getElementById('painelCarrinho')
var overlay = document.getElementById('overlay')
var cartItens = document.getElementById('carrinhoItens')
var cartVazio = document.getElementById('carrinhoVazio')
var spanTotalItens = document.getElementById('totalItens')
var spanSubtotal = document.getElementById('subtotal')
var spanDesconto = document.getElementById('desconto')
var spanFinal = document.getElementById('valorFinal')
var spanDescInfo = document.getElementById('descontoInfo')
var btnFinalizar = document.getElementById('btnFinalizar')
var campoBusca = document.getElementById('campoBusca')
var divFiltros = document.getElementById('filtros')
var msgSemResultado = document.getElementById('msgSemResultado')
var modalOverlay = document.getElementById('modalOverlay')
var modalBody = document.getElementById('modalBody')
var modalTitulo = document.getElementById('modalTitulo')
var btnFecharModal = document.getElementById('btnFecharModal')
var btnCancelar = document.getElementById('btnCancelarModal')
var btnConfirmar = document.getElementById('btnConfirmarCompra')
var sucessoOverlay = document.getElementById('modalSucessoOverlay')
var msgSucesso = document.getElementById('msgSucesso')
var btnFecharSucesso = document.getElementById('btnFecharSucesso')
var navAuth = document.getElementById('navAuth')

let categoriaAtiva = 'Todos'
let termoBusca = ''

function atualizarNav() {
  if (!navAuth) return
  if (estaLogado()) {
    const u = getUsuario()
    let html = '<span class="nav-usuario">👤 ' + u.nome.split(' ')[0] + '</span>'
    html += '<a href="pedidos.html" class="nav-link">Meus Pedidos</a>'
    if (eAdmin()) {
      html += '<a href="admin.html" class="nav-link nav-admin">Painel Admin</a>'
    }
    html += '<button class="btn-logout" id="btnLogout">Sair</button>'
    navAuth.innerHTML = html
    document.getElementById('btnLogout').addEventListener('click', sair)
  } else {
    navAuth.innerHTML =
      '<a href="login.html" class="nav-link">Entrar</a>' +
      '<a href="cadastro.html" class="btn-cadastro-nav">Cadastrar</a>'
  }
}

const mostrarProdutos = (lista) => {
  grid.innerHTML = ''

  if (lista.length === 0) {
    msgSemResultado.classList.remove('escondido')
    return
  }

  msgSemResultado.classList.add('escondido')

  for (let i = 0; i < lista.length; i++) {
    const p = lista[i]
    const disponivel = p.estaDisponivel()
    const baixo = p.estoqueEstasBaixo && p.estoqueEstasBaixo()
    const classeCard = disponivel ? 'card' : 'card indisponivel'
    const textoDisp = disponivel ? '✔ Em estoque (' + p.estoque + ' un.)' : '✖ Indisponível'
    const classeDisp = disponivel ? 'card-disponibilidade disponivel' : 'card-disponibilidade indisponivel'
    const textoBotao = disponivel ? 'Adicionar ao Carrinho' : 'Sem Estoque'
    const badgeBaixo = baixo ? '<span class="badge-estoque-baixo">⚠ Últimas unidades</span>' : ''

    const card = document.createElement('div')
    card.className = classeCard

    card.innerHTML =
      '<img class="card-img" src="' + p.imagem + '" alt="' + p.nome + '" loading="lazy">' +
      '<div class="card-corpo">' +
        badgeBaixo +
        '<span class="card-categoria">' + p.categoria + '</span>' +
        '<h3 class="card-nome">' + p.nome + '</h3>' +
        '<p class="card-preco">' + p.precoFormatado() + '</p>' +
        '<p class="' + classeDisp + '">' + textoDisp + '</p>' +
        '<button class="btn-adicionar" ' + (disponivel ? '' : 'disabled') + '>' + textoBotao + '</button>' +
      '</div>'

    const btn = card.querySelector('.btn-adicionar')
    if (disponivel) {
      btn.addEventListener('click', function() {
        adicionarProduto(p.id)
      })
    }

    grid.appendChild(card)
  }
}

function mostrarFalhaCarregamentoProdutos(mensagem) {
  grid.innerHTML = ''
  const aviso = document.createElement('p')
  aviso.className = 'erro-produtos'
  aviso.textContent = mensagem
  grid.appendChild(aviso)
  msgSemResultado.classList.add('escondido')
}

function filtrar() {
  const lista = []

  for (let i = 0; i < produtos.length; i++) {
    const p = produtos[i]
    let okCategoria = false
    let okBusca = false

    if (categoriaAtiva === 'Todos' || p.categoria === categoriaAtiva) {
      okCategoria = true
    }

    if (p.nome.toLowerCase().indexOf(termoBusca.toLowerCase()) !== -1) {
      okBusca = true
    }

    if (okCategoria && okBusca) {
      lista.push(p)
    }
  }

  mostrarProdutos(lista)
}

function adicionarProduto(id) {
  let prod = null
  let i = 0
  while (i < produtos.length) {
    if (produtos[i].id === id) {
      prod = produtos[i]
      break
    }
    i++
  }

  if (prod === null) return

  const res = carrinho.adicionarItem(prod, 1)

  if (res.sucesso) {
    atualizarCarrinho()
    badge.style.transform = 'scale(1.6)'
    setTimeout(function() { badge.style.transform = 'scale(1)' }, 200)
    mostrarToast('Produto adicionado ao carrinho!', 'sucesso')
  } else {
    mostrarToast(res.mensagem, 'erro')
  }
}

function atualizarCarrinho() {
  const resumo = carrinho.obterResumo()

  badge.textContent = resumo.totalItens
  spanTotalItens.textContent = resumo.totalItens
  spanSubtotal.textContent = carrinho.formatarMoeda(resumo.subtotal)
  spanDesconto.textContent = carrinho.formatarMoeda(resumo.desconto.valor)
  spanFinal.textContent = carrinho.formatarMoeda(resumo.total)
  spanDescInfo.textContent = resumo.desconto.mensagem

  cartItens.innerHTML = ''

  if (carrinho.estaVazio()) {
    cartVazio.classList.remove('escondido')
    cartItens.appendChild(cartVazio)
    return
  }

  cartVazio.classList.add('escondido')

  for (let i = 0; i < resumo.itens.length; i++) {
    const item = resumo.itens[i]
    const el = montarItemCarrinho(item)
    cartItens.appendChild(el)
  }
}

const montarItemCarrinho = (item) => {
  const div = document.createElement('div')
  div.className = 'item-carrinho'

  div.innerHTML =
    '<p class="item-nome">' + item.produto.nome + '</p>' +
    '<p class="item-preco-unit">Preço unitário: ' + item.produto.precoFormatado() + '</p>' +
    '<div class="item-controles">' +
      '<div class="item-quantidade">' +
        '<button class="btn-qty btn-menos">−</button>' +
        '<span class="qty-valor">' + item.quantidade + '</span>' +
        '<button class="btn-qty btn-mais">+</button>' +
      '</div>' +
      '<span class="item-subtotal">' + item.subtotalFormatado() + '</span>' +
    '</div>' +
    '<button class="btn-remover">🗑 Remover</button>'

  div.querySelector('.btn-menos').addEventListener('click', function() {
    const res = carrinho.alterarQuantidade(item.produto.id, item.quantidade - 1)
    if (res.sucesso) {
      atualizarCarrinho()
      filtrar()
    }
  })

  div.querySelector('.btn-mais').addEventListener('click', function() {
    const res = carrinho.alterarQuantidade(item.produto.id, item.quantidade + 1)
    if (!res.sucesso) {
      mostrarToast(res.mensagem, 'erro')
    } else {
      atualizarCarrinho()
      filtrar()
    }
  })

  div.querySelector('.btn-remover').addEventListener('click', function() {
    carrinho.removerItem(item.produto.id)
    atualizarCarrinho()
    filtrar()
  })

  return div
}

function abrirCarrinho() {
  painelCart.classList.remove('escondido')
  overlay.classList.remove('escondido')
  document.body.style.overflow = 'hidden'
}

function fecharCarrinho() {
  painelCart.classList.add('escondido')
  overlay.classList.add('escondido')
  document.body.style.overflow = ''
}

function abrirResumo() {
  if (carrinho.estaVazio()) {
    mostrarToast('Carrinho vazio! Adicione algum produto antes de finalizar.', 'erro')
    return
  }

  if (!estaLogado()) {
    modalTitulo.textContent = 'Login necessário'
    modalBody.innerHTML =
      '<div class="modal-login-aviso">' +
        '<p>Para finalizar a compra você precisa estar logado.</p>' +
        '<p>Seus produtos no carrinho serão mantidos após o login.</p>' +
        '<a href="login.html" class="btn-ir-login">Fazer Login</a>' +
        '<a href="cadastro.html" class="btn-ir-cadastro">Criar conta</a>' +
      '</div>'
    document.getElementById('modalFooter').classList.add('escondido')
    modalOverlay.classList.remove('escondido')
    document.body.style.overflow = 'hidden'
    return
  }

  document.getElementById('modalFooter').classList.remove('escondido')
  const resumo = carrinho.obterResumo()
  modalBody.innerHTML = ''
  modalTitulo.textContent = 'Resumo do Pedido'

  for (let i = 0; i < resumo.itens.length; i++) {
    const item = resumo.itens[i]
    const linha = document.createElement('div')
    linha.className = 'modal-item'
    linha.innerHTML =
      '<span class="modal-item-nome">' + item.produto.nome + '</span>' +
      '<span class="modal-item-qty">x' + item.quantidade + '</span>' +
      '<span class="modal-item-sub">' + item.subtotalFormatado() + '</span>'
    modalBody.appendChild(linha)
  }

  const divRes = document.createElement('div')
  divRes.className = 'modal-resumo'
  divRes.innerHTML =
    '<div class="modal-resumo-linha"><span>Total de itens:</span><span>' + resumo.totalItens + '</span></div>' +
    '<div class="modal-resumo-linha"><span>Subtotal:</span><span>' + carrinho.formatarMoeda(resumo.subtotal) + '</span></div>' +
    '<div class="modal-resumo-linha desconto"><span>Desconto:</span><span>− ' + carrinho.formatarMoeda(resumo.desconto.valor) + '</span></div>' +
    '<div class="modal-resumo-linha total"><span>Valor final:</span><span>' + carrinho.formatarMoeda(resumo.total) + '</span></div>'
  modalBody.appendChild(divRes)

  modalOverlay.classList.remove('escondido')
  document.body.style.overflow = 'hidden'
}

function fecharModal() {
  modalOverlay.classList.add('escondido')
  document.getElementById('modalFooter').classList.remove('escondido')
  document.body.style.overflow = ''
}

async function confirmarCompra() {
  if (!estaLogado()) {
    mostrarToast('Você precisa estar logado para finalizar a compra.', 'erro')
    return
  }

  const resumo = carrinho.obterResumo()
  const itensPedido = resumo.itens.map(it => ({
    produto_id: it.produto.id,
    quantidade: it.quantidade
  }))

  btnConfirmar.disabled = true
  btnConfirmar.textContent = 'Processando...'

  try {
    const resp = await fetchComAuth(API_URL + '/pedidos', {
      method: 'POST',
      body: JSON.stringify({ itens: itensPedido })
    })

    const data = await resp.json()

    if (!resp.ok) {
      mostrarToast(data.erro || 'Erro ao finalizar pedido.', 'erro')
      btnConfirmar.disabled = false
      btnConfirmar.textContent = 'Confirmar Compra'
      return
    }

    fecharModal()
    fecharCarrinho()
    carrinho.limpar()
    atualizarCarrinho()

    try {
      await carregarProdutos()
      filtrar()
    } catch (err) {
      mostrarFalhaCarregamentoProdutos('A compra foi confirmada, mas não foi possível atualizar os produtos. Atualize a página.')
    }

    const totalFmt = Number(data.total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    msgSucesso.textContent = 'Pedido #' + data.pedido_id + ' confirmado! Valor total: ' + totalFmt + '. Obrigado por comprar na Nexvion Tech!'
    sucessoOverlay.classList.remove('escondido')
    document.body.style.overflow = 'hidden'
  } catch (err) {
    mostrarToast('Falha na comunicação com o servidor.', 'erro')
  }

  btnConfirmar.disabled = false
  btnConfirmar.textContent = 'Confirmar Compra'
}

function fecharSucesso() {
  sucessoOverlay.classList.add('escondido')
  document.body.style.overflow = ''
}

function mostrarToast(msg, tipo) {
  const aviso = document.createElement('div')
  aviso.textContent = msg
  const cor = tipo === 'erro' ? '#ff4d6d' : '#00b4d8'
  aviso.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:' + cor + ';color:#fff;padding:12px 24px;border-radius:50px;font-weight:600;font-size:0.9rem;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,0.3);white-space:nowrap;transition:opacity 0.5s;'
  document.body.appendChild(aviso)
  setTimeout(function() { aviso.style.opacity = '0' }, 2200)
  setTimeout(function() { if (aviso.parentNode) document.body.removeChild(aviso) }, 2700)
}

btnAbrirCart.addEventListener('click', abrirCarrinho)
btnFecharCart.addEventListener('click', fecharCarrinho)
overlay.addEventListener('click', fecharCarrinho)
btnFinalizar.addEventListener('click', abrirResumo)
btnFecharModal.addEventListener('click', fecharModal)
btnCancelar.addEventListener('click', fecharModal)
btnConfirmar.addEventListener('click', confirmarCompra)
btnFecharSucesso.addEventListener('click', fecharSucesso)

campoBusca.addEventListener('input', function() {
  termoBusca = this.value
  filtrar()
})

divFiltros.addEventListener('click', function(e) {
  const btn = e.target.closest('.btn-filtro')
  if (!btn) return
  const botoes = divFiltros.querySelectorAll('.btn-filtro')
  for (let i = 0; i < botoes.length; i++) {
    botoes[i].classList.remove('ativo')
  }
  btn.classList.add('ativo')
  categoriaAtiva = btn.getAttribute('data-categoria')
  filtrar()
})

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    if (!sucessoOverlay.classList.contains('escondido')) {
      fecharSucesso()
    } else if (!modalOverlay.classList.contains('escondido')) {
      fecharModal()
    } else if (!painelCart.classList.contains('escondido')) {
      fecharCarrinho()
    }
  }
})

atualizarNav()
carregarProdutos().then(function(lista) {
  carrinho.sincronizarComProdutos(lista)
  atualizarCarrinho()
  filtrar()
}).catch(function() {
  mostrarFalhaCarregamentoProdutos('Não foi possível carregar os produtos. Confira se o servidor está funcionando e atualize a página.')
  atualizarCarrinho()
})
