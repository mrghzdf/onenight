# Checklist de Release (One Night PT-BR)

## 1. Build

- [ ] Rodar `npm run build:apk:release-install`
- [ ] Confirmar arquivo `one-night-ptbr-release.apk` na raiz
- [ ] Confirmar instalação no dispositivo sem erro

## 2. Smoke test rápido

- [ ] Home abre com fundo correto
- [ ] Seleção de papéis funciona (`+`, `-`, `Limpar`)
- [ ] Botão `Jogar` habilita/desabilita conforme validação
- [ ] Tela de Configurações abre e fecha

## 3. Áudio

- [ ] Teste de voz PT-BR funciona
- [ ] Trilha de fundo toca no `Testar trilha`
- [ ] Volume da trilha responde no `+/-`
- [ ] Durante a narração, trilha abaixa e volta

## 4. Jogo

- [ ] Sequência noturna avança corretamente
- [ ] Timer não corta texto longo
- [ ] `Pausar`, `Próximo` e `Parar` funcionam

## 5. Visual

- [ ] Fonte especial aparece nos títulos esperados
- [ ] Ícone do app está correto
- [ ] Texto da ação cabe no card de jogo

## 6. Entrega

- [ ] Compartilhar `one-night-ptbr-release.apk` com tester
- [ ] Registrar versão testada (`package.json`)
