export default function HomePage() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-6 py-10">
      <h1 className="text-2xl font-semibold">Kanban Dashboard</h1>
      <p className="max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
        Публичная доска будет отображаться здесь. На данном этапе EPIC-01 мы
        настраиваем только инфраструктуру, layout и базовую страницу.
      </p>
    </section>
  );
}

