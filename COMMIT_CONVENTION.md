# 커밋 메시지 컨벤션

## 포맷

```
<type>(<scope>): <subject>
```

## type

| type       | 설명                                                |
| ---------- | --------------------------------------------------- |
| `feat`     | 새로운 기능 추가                                    |
| `fix`      | 버그 수정                                           |
| `design`   | UI/스타일 변경 (Tailwind 클래스, 레이아웃, 색상 등) |
| `refactor` | 기능 변화 없는 코드 구조 개선                       |
| `chore`    | 빌드, 패키지, 설정 파일 등                          |
| `docs`     | 문서 수정                                           |

## scope

컴포넌트/페이지 단위로 작성 (예: `header`, `cart`, `login`)

## 규칙

- 제목 50자 이내, 마침표 없이 끝내기
- 로직 변경(`feat`/`fix`)과 스타일 변경(`design`)은 커밋 분리
- `style`은 코드 포맷팅 전용, Tailwind 스타일 변경은 `design` 사용

## 예시

```
feat(cart): 수량 선택 드롭다운 추가
fix(login): 비밀번호 유효성 검사 오류 수정
design(header): 모바일 메뉴 아이콘 크기 조정
refactor(hooks): useDebounce 훅 분리
chore(deps): tailwindcss 업데이트
```
