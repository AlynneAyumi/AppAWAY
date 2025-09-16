# AWAY - Sistema Patronato

Sistema de gestão para patronatos criado com Angular 19.

## 📋 Sobre o Projeto

O AWAY é um sistema web criado para auxiliar na gestão de patronatos, oferecendo funcionalidades para:

- **Gestão de Assistidos**: Cadastro e controle de pessoas assistidas
- **Gestão de Usuários**: Administração de usuários do sistema
- **Documentos**: Gerenciamento de documentos dos assistidos
- **Comparecimentos**: Controle de comparecimentos e atividades
- **Relatórios**: Geração de relatórios gerenciais
- **Calendário**: Agendamento e controle de eventos

## 🛠️ Tecnologias Utilizadas na Criação

- **Angular 19.2.0** - Framework principal usado na criação
- **TypeScript 5.7.2** - Linguagem de programação
- **SCSS** - Pré-processador CSS
- **RxJS 7.8.0** - Programação reativa
- **SweetAlert2** - Alertas e modais
- **Angular CLI 19.2.16** - Ferramentas para criação e desenvolvimento

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/away-sistema-patronato.git
cd away-sistema-patronato
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto em modo de desenvolvimento:
```bash
npm start
```

4. Acesse a aplicação no navegador:
```
http://localhost:4200
```

### Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run watch` - Build em modo watch para desenvolvimento

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── components/          # Componentes da aplicação
│   │   ├── assistidos/     # Gestão de assistidos
│   │   ├── usuarios/       # Gestão de usuários
│   │   ├── documentos/     # Gestão de documentos
│   │   ├── comparecimentos/ # Controle de comparecimentos
│   │   ├── relatorios/     # Geração de relatórios
│   │   ├── calendario/     # Sistema de calendário
│   │   ├── dashboard/      # Painel principal
│   │   ├── login/          # Autenticação
│   │   └── layout/         # Layout principal
│   ├── guards/             # Guards de rota
│   ├── interceptors/       # Interceptadores HTTP
│   ├── models/             # Modelos de dados
│   ├── services/           # Serviços da aplicação
│   ├── app.routes.ts       # Configuração de rotas
│   └── app.config.ts       # Configuração da aplicação
├── public/                 # Arquivos estáticos
└── styles.scss            # Estilos globais
```

## 🔐 Funcionalidades

### Autenticação
- Login seguro com guards de rota
- Interceptador para adicionar tokens de autenticação
- Controle de sessão

### Gestão de Assistidos
- Cadastro completo de assistidos
- Listagem com filtros e busca
- Histórico de atividades

### Gestão de Documentos
- Upload e gerenciamento de documentos
- Categorização por tipo
- Controle de versões

### Sistema de Relatórios
- Relatórios gerenciais
- Exportação em diferentes formatos
- Filtros personalizáveis

### Calendário
- Agendamento de eventos
- Visualização mensal/semanal
- Notificações

## 🧪 Desenvolvimento

### Adicionando Novos Componentes

```bash
ng generate component components/nome-do-componente
```

### Adicionando Novos Serviços

```bash
ng generate service services/nome-do-servico
```

## 📝 Licença

Este projeto está licenciado sob a Licença Apache 2.0 - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Contato

Projeto criado como Projeto Integrador de Extensão do Curso de Análise e Desenvolvimento de Sistemas & Engenharia de Software.

---

**Versão**: 0.0.0  
**Última atualização**: 2024