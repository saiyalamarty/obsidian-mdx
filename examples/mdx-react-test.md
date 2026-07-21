---
mdx: true
---

# MDX React Test

This remains native Obsidian Markdown with a link to [[Example note]].

export function Counter({ initial = 0 }) {
  const [count, setCount] = useState(initial)

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        onClick={() => setCount((value) => value - 1)}
      >
        Decrease
      </Button>
      <output className="min-w-10 text-center font-medium" aria-live="polite">
        {count}
      </output>
      <Button onClick={() => setCount((value) => value + 1)}>
        Increase
      </Button>
    </div>
  )
}

<Card>
  <CardHeader>
    <CardTitle>Interactive test</CardTitle>
    <CardDescription>This card is rendered by React.</CardDescription>
  </CardHeader>
  <CardContent>
    <Counter />
  </CardContent>
</Card>
