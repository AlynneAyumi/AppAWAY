# Guia de Contribuição

Obrigado por considerar contribuir para o projeto AWAY - Sistema Patronato!

## 🚀 Como Contribuir

### 1. Fork do Projeto

1. Faça um fork do repositório
2. Clone seu fork localmente:
```bash
git clone https://github.com/seu-usuario/away-sistema-patronato.git
cd away-sistema-patronato
```

### 2. Configuração do Ambiente

1. Instale as dependências:
```bash
npm install
```

2. Execute o projeto para verificar se está funcionando:
```bash
npm start
```

### 3. Criando uma Branch

Crie uma branch para sua feature ou correção:
```bash
git checkout -b feature/nome-da-feature
# ou
git checkout -b fix/descricao-do-bug
```

### 4. Padrões de Código

- Use TypeScript para todo o código
- Siga as convenções do Angular
- Use SCSS para estilos
- Mantenha os componentes pequenos e focados
- Adicione comentários JSDoc para funções públicas
- Use nomes descritivos para variáveis e funções

### 5. Testes

Antes de fazer commit, certifique-se de que:
- O projeto compila sem erros
- Não há erros de linting
- As funcionalidades existentes continuam funcionando

### 6. Commit

Faça commits descritivos:
```bash
git add .
git commit -m "feat: adiciona nova funcionalidade de relatórios"
```

Use os seguintes prefixos:
- `feat:` para novas funcionalidades
- `fix:` para correções de bugs
- `docs:` para documentação
- `style:` para formatação
- `refactor:` para refatoração
- `test:` para testes
- `chore:` para tarefas de manutenção

### 7. Push e Pull Request

1. Push sua branch:
```bash
git push origin feature/nome-da-feature
```

2. Abra um Pull Request no GitHub com:
   - Descrição clara do que foi feito
   - Screenshots (se aplicável)
   - Lista de mudanças
   - Referências a issues relacionadas

## 📋 Checklist para Pull Requests

- [ ] Código segue os padrões do projeto
- [ ] Funcionalidade foi testada localmente
- [ ] Não há erros de compilação
- [ ] Documentação foi atualizada (se necessário)
- [ ] Commit messages são descritivos
- [ ] Branch está atualizada com a main

## 🐛 Reportando Bugs

Ao reportar bugs, inclua:

1. Descrição detalhada do problema
2. Passos para reproduzir
3. Comportamento esperado vs atual
4. Screenshots (se aplicável)
5. Informações do ambiente (navegador, OS, etc.)

## 💡 Sugerindo Funcionalidades

Para sugerir novas funcionalidades:

1. Verifique se já não existe uma issue similar
2. Descreva a funcionalidade detalhadamente
3. Explique o valor/benefício da funcionalidade
4. Se possível, forneça mockups ou exemplos

## 📞 Suporte

Se tiver dúvidas sobre como contribuir:

1. Verifique a documentação existente
2. Procure por issues similares
3. Abra uma nova issue com a tag `question`

## 📝 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a Licença Apache 2.0.

---

Obrigado por contribuir! 🙏
