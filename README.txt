AÇAÍ TOP — SITE RESPONSIVO

Arquivos:
- index.html
- style.css
- script.js
- assets/referencia.png (imagem enviada como referência)

CONFIGURAÇÃO DO WHATSAPP
Abra o arquivo script.js e altere a linha:
const STORE_WHATSAPP = "5511999999999";

Use DDI + DDD + número, sem espaços, traços ou parênteses.
Exemplo: 5511987654321

COMO ABRIR
Basta abrir index.html no navegador.
Para publicar, envie a pasta completa para sua hospedagem.

PERSONALIZAÇÃO
No script.js você pode alterar:
- tamanhos e preços (array sizes)
- ingredientes e adicionais (array ingredients)
- produtos prontos (array products)

No index.html você pode trocar:
- endereço
- horário
- textos da página

Observação: a página usa Google Fonts e precisa de internet para carregar as fontes. Todo o restante funciona localmente.

ATUALIZAÇÃO — EXCLUSÃO DE ITENS
-------------------------------
Cada açaí adicionado aparece na área “Itens do pedido” com um botão “Excluir”.
Ao clicar nesse botão, somente aquele item é removido, e a quantidade e o total
do pedido são recalculados automaticamente.
