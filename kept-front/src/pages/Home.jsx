function Home({ onOpenMenu }) {
  return (
    <main>
      <header>
        <h1>Home</h1>

        <button type="button" aria-label="전체 메뉴 열기" onClick={onOpenMenu}>
          메뉴
        </button>
      </header>
    </main>
  );
}

export default Home;
