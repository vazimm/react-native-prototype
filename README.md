# EduBlog — protótipo React Native

Aplicativo isolado para avaliar a migração do módulo de autoria e administração de conteúdo do professor. 


## Arquitetura e versões

- Expo SDK 58, React Native 0.88.0, React 19.3.0 e TypeScript.
- React Navigation Native Stack para navegação.
- Context API para sessão; Axios para API REST.
- `expo-secure-store` para persistir o JWT e o perfil do usuário no armazenamento seguro do dispositivo.
- `StyleSheet`, `TextInput`, `FlatList`, `Modal`, `Alert` e `Switch` no lugar dos elementos específicos do navegador.
- Estilos consolidados em [src/styles.ts](./src/styles.ts) para manter tokens visuais e estilos de telas/componentes em um ponto único.
- Vitest cobre validação, filtros e comportamento do cliente HTTP.

O backend está no repositório separado `Roch-Daniel/blog-api`. Os schemas, contratos e regras aqui foram adaptados dos arquivos `src/pages/TeacherDashboard.tsx`, `TeacherPosts.tsx`, `TeacherPostForm.tsx`, `src/services/*`, `src/interfaces/*` e `src/utils/post.ts` do frontend web. Os arquivos web não são importados em runtime, pois dependem de DOM/React Router e de armazenamento de sessão do navegador.

## Funcionalidades

- Login usando o endpoint e payload existentes.
- Dashboard com contagem de publicações e rascunhos.
- Listagem por professor com busca de título, filtro de disciplina e status.
- Visualização, edição e exclusão com confirmação nativa.
- Criação e edição com os mesmos campos, validações, sanitização de texto e catálogos da aplicação web.
- Controle de acesso à área para o papel `PROFESSOR`; as decisões de autorização continuam sendo aplicadas pelo backend.
- Tratamento de sessão expirada: resposta 401 apaga credenciais seguras e retorna à tela de login.

## Endpoints existentes utilizados

| Método | Endpoint | Uso |
| --- | --- | --- |
| POST | `/auth/login` | Autenticar professor |
| GET | `/posts/all` | Carregar posts; filtrar localmente pelo professor autenticado como na versão web |
| GET | `/posts/:id` | Carregar edição ou visualizar publicação |
| GET | `/catalog/disciplines` | Catálogo de disciplinas |
| GET | `/catalog/status` | Catálogo de status |
| POST | `/posts` | Criar publicação |
| PUT | `/posts/:id` | Atualizar publicação |
| DELETE | `/posts/:id` | Excluir publicação |

As requisições autenticadas enviam o JWT no header `Authorization` e o endpoint de listagem existente retorna a coleção usada pela interface web. A filtragem do professor é aplicada no cliente e a autorização efetiva para escrita não depende desse filtro local.

## Pré-requisitos e instalação

- Node.js `22.13.0` ou superior (requisito do Expo SDK 58).
- npm.
- Expo Go compatível com SDK 58, ou emulador Android/iOS configurado. A execução de simulador iOS requer macOS; no Windows, use Android ou um dispositivo físico.

No diretório do protótipo:

```sh
cd react-native-prototype
npm install
```

Crie `.env` a partir de `.env.example`. A URL padrão aponta para a API hospedada. Para usar a API local, configure o endereço de acordo com o destino:

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000
```

`10.0.2.2` é o endereço especial do host no emulador Android. No simulador iOS use `http://localhost:3000`. Em dispositivo físico, use o IP LAN do computador e permita conexões na rede local/firewall, por exemplo `http://192.168.1.20:3000`. `localhost` no dispositivo é o próprio dispositivo. Endereço HTTP em redes de teste precisa ser permitido pela configuração de rede do dispositivo/backend. Para staging ou produção, configure a URL HTTPS correspondente.

Não coloque senhas, tokens, segredo JWT, credenciais de banco ou strings de conexão no `.env` do aplicativo. Variáveis `EXPO_PUBLIC_*` são incorporadas ao bundle e não são segredos.

## Executar

```sh
npm start
```

Use o QR code com Expo Go ou escolha Android na interface do Expo. Também há atalhos:

```sh
npm run android
npm run ios
```

