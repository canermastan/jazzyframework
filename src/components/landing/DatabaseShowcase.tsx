import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  Database,
  FileCode2,
  Leaf,
  Play,
  Server,
} from "lucide-react";

type StepId = "config" | "migration" | "model" | "query";

type DatabaseStep = {
  id: StepId;
  label: string;
  file: string;
  detail: string;
  code: string;
  accent: string;
};

const steps: DatabaseStep[] = [
  {
    id: "config",
    label: "Configure",
    file: ".env",
    detail: "One driver switch. No connection boilerplate.",
    accent: "bg-chart-3 text-black",
    code: `DB_CONNECTION=postgres
DATABASE_URL=postgresql://jazzy:•••@db:5432/app
DB_POOL_MIN=1
DB_POOL_MAX=1`,
  },
  {
    id: "migration",
    label: "Migrate",
    file: "m2026_create_tasks.nim",
    detail: "Versioned schema, transactional on both drivers.",
    accent: "bg-chart-4 text-white",
    code: `migration "20260917143000_create_tasks":
  up:
    await createTable("tasks")
      .increments("id")
      .string("title")
      .boolean("completed", default = false)
      .timestamps().execute()`,
  },
  {
    id: "model",
    label: "Model",
    file: "models/task.nim",
    detail: "One Nim block becomes a typed, awaited API.",
    accent: "bg-chart-5 text-white",
    code: `model Task:
  table "tasks"
  id int64
  title string
  completed bool
  timestamps()`,
  },
  {
    id: "query",
    label: "Ship",
    file: "controllers/task_controller.nim",
    detail: "ORM and query builder share one async database layer.",
    accent: "bg-chart-1 text-white",
    code: `let tasks = await Task
  .where("completed", false)
  .orderBy("id", "DESC")
  .get()`,
  },
];

const highlightCode = (code: string) => {
  const strings: string[] = [];
  const masked = code.replace(/"(.*?)"/g, (match) => {
    strings.push(match);
    return `__STRING_${strings.length - 1}__`;
  });

  // Apply punctuation before inserting span elements. Otherwise the regex
  // would also touch the HTML attributes we insert for the other tokens.
  let output = masked
    .replace(/(\{|\}|\(|\)|:|\.|=|,)/g, '<span class="text-gray-400">$1</span>')
    .replace(
      /\b(await|let|model|migration|up|true|false)\b/g,
      '<span class="text-chart-3 font-bold">$1</span>',
    )
    .replace(
      /\b(Task|DB_CONNECTION|DATABASE_URL|createTable|increments|string|boolean|timestamps|where|orderBy|get)\b/g,
      '<span class="text-chart-2">$1</span>',
    )
    .replace(/\b(1|false|true)\b/g, '<span class="text-chart-5">$1</span>');

  strings.forEach((value, index) => {
    output = output.replace(
      `__STRING_${index}__`,
      `<span class="text-chart-1">${value}</span>`,
    );
  });

  return output;
};

const DatabaseShowcase = () => {
  const [active, setActive] = useState<StepId>("config");
  const activeIndex = steps.findIndex((step) => step.id === active);
  const current = steps[activeIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((value) => {
        const index = steps.findIndex((step) => step.id === value);
        return steps[(index + 1) % steps.length].id;
      });
    }, 4200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="overflow-hidden rounded-base border-2 border-border bg-secondary-background/50 shadow-shadow">
      <div className="flex flex-col gap-4 border-b-2 border-border bg-background p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-base border-2 border-border bg-chart-3 shadow-sm">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <p className="font-mono text-[11px] font-bold tracking-[0.16em] text-foreground/55">
              THE DATABASE PATH
            </p>
            <h3 className="font-heading text-lg font-black">Config to production API</h3>
          </div>
        </div>
        <a
          href="/jazzyframework/en/database-quickstart/"
          className="inline-flex items-center gap-1.5 self-start font-bold text-main hover:underline md:self-auto"
        >
          Follow the guide <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      <div className="grid gap-0 lg:grid-cols-[0.7fr_1.3fr]">
        <nav className="flex gap-2 overflow-x-auto border-b-2 border-border bg-background p-4 lg:flex-col lg:border-b-0 lg:border-r-2">
          {steps.map((step, index) => {
            const selected = step.id === active;
            return (
              <button
                type="button"
                key={step.id}
                onClick={() => setActive(step.id)}
                className={`min-w-[10rem] border-2 border-border p-3 text-left transition-all lg:min-w-0 ${
                  selected
                    ? `${step.accent} translate-x-[2px] translate-y-[2px] shadow-none`
                    : "bg-background shadow-sm hover:-translate-x-[1px] hover:-translate-y-[1px]"
                }`}
              >
                <span className="font-mono text-[11px] font-bold opacity-70">0{index + 1}</span>
                <span className="mt-1 flex items-center gap-2 font-heading font-bold">
                  {step.id === "config" && <Server className="h-4 w-4" />}
                  {step.id === "migration" && <FileCode2 className="h-4 w-4" />}
                  {step.id === "model" && <Leaf className="h-4 w-4" />}
                  {step.id === "query" && <Play className="h-4 w-4" />}
                  {step.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="grid gap-5 p-5 md:grid-cols-[1.25fr_0.75fr]">
          <div className="relative min-h-[18rem] overflow-hidden rounded-base border-2 border-border bg-zinc-950 p-5 text-zinc-100 shadow-sm">
            <div className="mb-5 flex items-center justify-between font-mono text-xs">
              <span className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-300">
                {current.file}
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <Check className="h-3.5 w-3.5" /> ready
              </span>
            </div>
            <pre key={current.id} className="animate-in fade-in slide-in-from-bottom-2 overflow-x-auto font-mono text-sm leading-relaxed duration-300">
              <code dangerouslySetInnerHTML={{ __html: highlightCode(current.code) }} />
            </pre>
          </div>

          <div className="flex flex-col justify-between gap-5 rounded-base border-2 border-border bg-background p-5 shadow-sm">
            <div>
              <p className="font-mono text-[11px] font-bold tracking-[0.13em] text-foreground/55">
                STEP 0{activeIndex + 1}
              </p>
              <h4 className="mt-2 font-heading text-2xl font-black">{current.label}</h4>
              <p className="mt-2 text-sm font-medium leading-relaxed text-foreground/75">{current.detail}</p>
            </div>
            <div className="space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-foreground/60">Driver</span>
                <span className="font-bold">SQLite ↔ PostgreSQL</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-foreground/60">Public API</span>
                <span className="font-bold">await-first</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-foreground/60">Migrations</span>
                <span className="font-bold text-chart-4">transactional</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DatabaseShowcase;
