import { CreateBoardButton } from "@/features/create-board";

export default function HomePage() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Kanban Dashboard</h1>
        <CreateBoardButton className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90" />
      </div>
      <p className="max-w-xl text-sm text-muted-foreground">
        Публичная доска будет отображаться здесь. На данном этапе EPIC-01 мы
        настраиваем только инфраструктуру, layout и базовую страницу.
      </p>
    </section>
  );
}

