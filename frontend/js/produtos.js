const API_URL = '/api'

class Produto {
  constructor(id, codigo, nome, categoria, preco, estoque, imagem) {
    this.id = id
    this.codigo = codigo
    this.nome = nome
    this.categoria = categoria
    this.preco = preco
    this.estoque = estoque
    this.imagem = imagem
  }

  estaDisponivel() {
    if (this.estoque > 0) {
      return true
    }
    return false
  }

  estoqueEstasBaixo() {
    if (this.estoque > 0 && this.estoque <= 3) {
      return true
    }
    return false
  }

  precoFormatado() {
    return this.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }
}

let produtos = []

async function carregarProdutos() {
  try {
    const resp = await fetch(API_URL + '/produtos')
    if (!resp.ok) {
      throw new Error('O servidor respondeu com erro ao carregar os produtos.')
    }

    const dados = await resp.json()
    const lista = []

    for (let i = 0; i < dados.length; i++) {
      const d = dados[i]
      lista.push(new Produto(d.id, d.codigo, d.nome, d.categoria, Number(d.preco), d.estoque, d.imagem_url))
    }

    produtos = lista
    return produtos
  } catch (err) {
    console.error('Erro ao carregar produtos:', err)
    throw new Error('Não foi possível carregar os produtos.')
  }
}
