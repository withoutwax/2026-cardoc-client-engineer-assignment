# 카닥 Client 개발자 개발 테스트

## 프로젝트 실행 방법

1. **환경 변수 설정**: 프로젝트 루트에 `.env` 파일을 생성하고 GitHub Personal Access Token을 설정합니다.

   ```
   VITE_GITHUB_TOKEN=your_github_pat_token
   ```

2. **의존성 설치**:

   ```bash
   npm install
   ```

3. **Relay 컴파일러 실행** (GraphQL 아티팩트 생성):

   ```bash
   npm run relay
   ```

4. **개발 서버 실행**:
   ```bash
   npm run dev
   ```

## 사용한 기술 스택

- **Core**: React 19, TypeScript
- **Data Fetching & State**: Relay (GraphQL), React Context API
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite
- **Router**: React Router DOM v7

## 구현한 기능 목록

### 1. Repository 검색 및 페이지네이션

- **Relay Query**: `useLazyLoadQuery`를 사용하여 GitHub GraphQL API로부터 레포지토리 데이터를 검색합니다.
- **Pagination**: `usePaginationFragment`를 활용하여 커서 기반의 "더 보기(Load More)" 기능을 구현했습니다.
- **URL Sync**: 검색어가 URL Query Parameter(`?q=...`)와 동기화되어 새로고침 시에도 검색 상태가 유지됩니다.

### 2. 북마크 기능 (Local Storage)

- **Client-Side Persistence**: 서버 데이터와 별개로 관심 있는 레포지토리를 로컬 스토리지에 저장하여 영구 보관합니다.
- **Global State Management**: `BookmarkContext`를 구현하여 여러 컴포넌트(`RepositoryItem`, `BookmarkList`) 간의 상태를 동기화했습니다.
- **Optimistic UI**: 북마크 토글 시 즉각적으로 UI가 반응하도록 최적화했습니다.

### 3. GitHub Star 연동 (Mutation)

- **Real-time Mutation**: 실제 GitHub 계정의 Star 기능을 연동했습니다 (`addStar`, `removeStar`).
- **Optimistic Updates**: Relay의 `optimisticUpdater`를 사용하여 네트워크 응답을 기다리지 않고 즉시 별 아이콘과 카운트가 업데이트됩니다.
- **Error Handling**: 권한 부족 등의 이유로 요청 실패 시 콘솔에 에러를 로깅합니다.

## 어려웠던 점과 해결 과정

저는 Relay를 사용해본 경험이 없어서 이번에 처음 사용을 해보았습니다. AI를 적극 활용하여 구현을 진행하였으며, Relay의 공식 문서와 튜토리얼을 참고하여 구현을 진행하였습니다. 따라서 코드 한줄 한줄이 정확히 무슨역할을 하며 어떤 부분이 구체적으로 작동이 되는지는 완벽하게 이해를 하지는 못하였습니다.

하지만 Relay의 데이터의 흐름을 이해하고 왜 이러한 기술이 생겨났는지를 이 기술의 역할과 철학을 이해하려고 시도하였습니다.
알아본 결과 Relay는 부모 컴포넌트가 자식 컴포넌트가 어떤 데이터를 필요로 하는지는 모르지만 각각의 자식은 자식의 컴포넌트 레벨에서 필요한 데이터를 선언하고, 가져오는 방식으로 동작하는 것을 이해하였습니다. (Colocation - Prop Drilling 같은 부모가 데이터를 전부 가져오고 자식에게 전달하는 방식의 단점을 보완하기 위함)

### 데이터의 흐름

1. Fetching (초기 로딩): 최상위(부모) 컴포넌트에서 쿼리를 실행하여 서버로부터 데이터를 가져옵니다.
2. Normalization (정규화 및 저장): 받아온 데이터는 **Relay Environment(런타임)**가 자동으로 분해하여 중앙 Data Store에 저장합니다.
3. Fragment Reading (읽기): 자식 컴포넌트는 부모로부터 받은 '참조(Reference)'를 이용해 Data Store에서 직접 필요한 데이터 조각을 읽어옵니다.
4. Rendering: 자식 컴포넌트는 Store에서 읽어온 데이터를 바탕으로 화면을 렌더링하며, 동시에 해당 데이터에 대한 **구독(Subscription)**을 설정합니다.

### Mutation

1. Mutation (업데이트): 자식 컴포넌트가 직접 서버에 데이터 변경 요청(Mutation)을 보냅니다.
2. 서버 응답이 오면 Relay가 Data Store의 값을 갱신합니다.
3. 변경된 데이터를 구독하고 있던 자식 컴포넌트가 자동으로 감지하고 리렌더링 됩니다.

이러한 방식은 Observer 패턴을 사용한 것으로 이해하였습니다.

## 질문?

카닥에서는 TanStack Query도 사용하고 있다고 JD에 명시되어 있는데, Relay와 TanStack Query의 역할 분담이 어떻게 될지 궁금증이 생겼습니다.

## 추가

총 소요 시간은: 2.44시간 소요가 되었습니다.
AI 툴 사용: Gemini와 Antigravity를 사용하였습니다.
