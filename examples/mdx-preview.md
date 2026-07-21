---
mdx: true
tags:
  - mdx
  - shadcn
---

# MDX Preview (with shadcn components)

This remains a native Obsidian note. Links such as [[Design systems]], [[React]], and [[Component testing]] remain indexable and navigable.

The two panels below are adapted from the official [shadcn Create](https://ui.shadcn.com/create?item=preview) previews and their MIT-licensed [`preview-02`](https://github.com/shadcn-ui/ui/tree/main/apps/v4/registry/bases/base/blocks/preview-02) and [`preview`](https://github.com/shadcn-ui/ui/tree/main/apps/v4/registry/bases/base/blocks/preview) source. They use only components already supplied by the MDX registry; the showcase itself is not bundled into the plugin.

export function SavingsTargets() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings targets</CardTitle>
        <CardDescription>Active milestones for this year</CardDescription>
        <CardAction><Button variant="outline" size="sm">New goal</Button></CardAction>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-3">
          <Item variant="muted" className="flex-col items-stretch">
            <ItemContent className="gap-3">
              <ItemDescription className="text-xs font-medium tracking-wider uppercase">Retirement</ItemDescription>
              <span className="text-3xl font-semibold tabular-nums">$420,000</span>
              <Progress value={65} />
            </ItemContent>
            <ItemFooter><span>65% achieved</span><span className="font-medium tabular-nums">$273,000</span></ItemFooter>
          </Item>
          <Item variant="muted" className="flex-col items-stretch">
            <ItemContent className="gap-3">
              <ItemDescription className="text-xs font-medium tracking-wider uppercase">Real estate</ItemDescription>
              <span className="text-3xl font-semibold tabular-nums">$85,000</span>
              <Progress value={32} />
            </ItemContent>
            <ItemFooter><span>32% achieved</span><span className="font-medium tabular-nums">$27,200</span></ItemFooter>
          </Item>
        </ItemGroup>
      </CardContent>
      <CardFooter><CardDescription>Two targets need attention this year.</CardDescription></CardFooter>
    </Card>
  )
}

export function PreferencesCard() {
  const currencies = [
    { label: "USD — United States dollar", value: "usd" },
    { label: "EUR — Euro", value: "eur" },
    { label: "GBP — British pound", value: "gbp" },
    { label: "JPY — Japanese yen", value: "jpy" },
  ]

  return (
    <Card>
      <CardHeader><CardTitle>Preferences</CardTitle><CardDescription>Manage account and notification settings.</CardDescription></CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="preview-currency">Default currency</FieldLabel>
            <Select items={currencies} defaultValue="usd">
              <SelectTrigger id="preview-currency" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent><SelectGroup>{currencies.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent>
            </Select>
          </Field>
          <FieldSeparator />
          <Field orientation="horizontal">
            <FieldContent><FieldLabel htmlFor="preview-stats">Public statistics</FieldLabel><FieldDescription>Share listening activity with collaborators.</FieldDescription></FieldContent>
            <Switch id="preview-stats" defaultChecked />
          </Field>
          <FieldSeparator />
          <Field orientation="horizontal">
            <FieldContent><FieldLabel htmlFor="preview-email">Email notifications</FieldLabel><FieldDescription>Receive monthly reports and updates.</FieldDescription></FieldContent>
            <Switch id="preview-email" defaultChecked />
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter><Button variant="outline">Reset</Button><Button className="ml-auto">Save preferences</Button></CardFooter>
    </Card>
  )
}

export function ActivityTable() {
  const rows = [
    ["Coffee shop", "Today", "-$8.40", "Completed"],
    ["Brokerage transfer", "Yesterday", "+$1,200.00", "Completed"],
    ["Electric utility", "Jul 18", "-$142.18", "Pending"],
    ["Payroll", "Jul 15", "+$4,850.00", "Completed"],
  ]

  return (
    <Card>
      <CardHeader><CardTitle>Recent transactions</CardTitle><CardDescription>Latest activity across linked accounts.</CardDescription></CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Description</TableHead><TableHead>Date</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>{rows.map((row) => <TableRow key={row[0]}>{row.map((cell, index) => <TableCell key={cell}>{index === 3 ? <Badge variant={cell === "Pending" ? "outline" : "secondary"}>{cell}</Badge> : cell}</TableCell>)}</TableRow>)}</TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export function SupportFaq() {
  const questions = [
    ["How is account data protected?", "Connections use read-only access and encrypted storage."],
    ["Can I export reports?", "Yes. Reports can be exported as CSV or PDF for any selected period."],
    ["Can I track multiple goals?", "Yes. Each goal can have its own amount, deadline, and contribution schedule."],
  ]

  return (
    <Card>
      <CardHeader><CardTitle>Frequently asked questions</CardTitle><CardDescription>Common account and reporting questions.</CardDescription></CardHeader>
      <CardContent>
        <Accordion defaultValue={[0]}>{questions.map((item, index) => <AccordionItem key={item[0]} value={index}><AccordionTrigger>{item[0]}</AccordionTrigger><AccordionContent>{item[1]}</AccordionContent></AccordionItem>)}</Accordion>
      </CardContent>
      <CardFooter><Button variant="outline" className="w-full">Contact support</Button></CardFooter>
    </Card>
  )
}

export function ClaimableBalance() {
  return (
    <Card>
      <CardHeader><CardDescription>Claimable balance</CardDescription><CardTitle className="text-5xl tabular-nums">$2,847.20</CardTitle><CardAction><Badge variant="secondary">Ready</Badge></CardAction></CardHeader>
      <CardContent><Item variant="muted" className="flex-col items-stretch"><ItemContent className="gap-3"><div className="flex justify-between"><span className="text-muted-foreground">Net royalties</span><span>$2,861.51</span></div><Separator /><div className="flex justify-between"><span className="text-muted-foreground">Processing fee</span><span>-$14.31</span></div><Separator /><div className="flex justify-between font-medium"><span>Ready to claim</span><span>$2,847.20 USD</span></div></ItemContent></Item></CardContent>
      <CardFooter><Button className="w-full"><Icon name="landmark" data-icon="inline-start" />Claim balance</Button></CardFooter>
    </Card>
  )
}

export function TransferFunds() {
  const fromAccounts = [{ label: "Main checking ··8402 — $12,450", value: "checking" }, { label: "Business ··7731 — $8,920", value: "business" }]
  const toAccounts = [{ label: "High-yield savings ··1192 — $42,100", value: "savings" }, { label: "Investment ··3349 — $18,200", value: "investment" }]
  return (
    <Card>
      <CardHeader><CardTitle>Transfer funds</CardTitle><CardDescription>Move money between connected accounts.</CardDescription></CardHeader>
      <CardContent><FieldGroup>
        <Field><FieldLabel htmlFor="transfer-amount">Amount</FieldLabel><InputGroup><InputGroupAddon><InputGroupText>$</InputGroupText></InputGroupAddon><InputGroupInput id="transfer-amount" defaultValue="1,200.00" /></InputGroup></Field>
        <Field><FieldLabel htmlFor="transfer-from">From account</FieldLabel><Select items={fromAccounts} defaultValue="checking"><SelectTrigger id="transfer-from" className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{fromAccounts.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent></Select></Field>
        <Field><FieldLabel htmlFor="transfer-to">To account</FieldLabel><Select items={toAccounts} defaultValue="savings"><SelectTrigger id="transfer-to" className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{toAccounts.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent></Select></Field>
        <Item variant="muted"><ItemContent><ItemDescription>Estimated arrival</ItemDescription><ItemTitle>Today · No fee</ItemTitle></ItemContent><Badge variant="outline">$1,200</Badge></Item>
      </FieldGroup></CardContent>
      <CardFooter><Button className="w-full">Confirm transfer</Button></CardFooter>
    </Card>
  )
}

export function RollerShades() {
  const [position, setPosition] = useState(50)
  const preset = position <= 10 ? "open" : position >= 90 ? "closed" : "half"
  return (
    <Card>
      <CardHeader><CardTitle>Living room</CardTitle><CardDescription>Roller shades</CardDescription></CardHeader>
      <CardContent className="flex flex-col gap-4"><div className="flex h-32 flex-col overflow-hidden rounded-lg border bg-muted"><div className="bg-muted-foreground transition-all duration-300" style={{ height: `${position}%` }} /></div><div className="flex items-center gap-3"><span className="text-xs text-muted-foreground uppercase">Open</span><Slider value={position} onValueChange={setPosition} max={100} className="flex-1" /><span className="text-xs text-muted-foreground uppercase">Close</span></div></CardContent>
      <CardFooter><ToggleGroup value={[preset]} onValueChange={(value) => { const next = value[0]; if (next === "open") setPosition(0); if (next === "half") setPosition(50); if (next === "closed") setPosition(100) }} variant="outline" spacing={1} className="w-full"><ToggleGroupItem value="open" className="flex-1">Open</ToggleGroupItem><ToggleGroupItem value="half" className="flex-1">Half</ToggleGroupItem><ToggleGroupItem value="closed" className="flex-1">Closed</ToggleGroupItem></ToggleGroup></CardFooter>
    </Card>
  )
}

export function NotificationSettings() {
  const options = [{ id: "transactions", label: "Transaction alerts", description: "Deposits, withdrawals, and transfers." }, { id: "security", label: "Security alerts", description: "Login attempts and account changes." }, { id: "goals", label: "Goal milestones", description: "Updates at 25%, 50%, 75%, and 100%." }, { id: "market", label: "Market updates", description: "Portfolio summaries and price alerts." }]
  const [checked, setChecked] = useState({ transactions: true, security: true, goals: false, market: false })
  return (
    <Card>
      <CardHeader><CardTitle>Notifications</CardTitle><CardDescription>Choose what you want to hear about.</CardDescription></CardHeader>
      <CardContent><FieldGroup>{options.map((option) => <Field key={option.id} orientation="horizontal"><Checkbox id={`notify-${option.id}`} checked={checked[option.id]} onCheckedChange={(value) => setChecked({ ...checked, [option.id]: Boolean(value) })} /><FieldContent><FieldLabel htmlFor={`notify-${option.id}`}>{option.label}</FieldLabel><FieldDescription>{option.description}</FieldDescription></FieldContent></Field>)}</FieldGroup></CardContent>
      <CardFooter><Button className="w-full">Save notifications</Button></CardFooter>
    </Card>
  )
}

export function UpcomingPayments() {
  const [date, setDate] = useState(new Date())
  const payments = [["Streaming subscription", "Apr 15", "$19.99"], ["Rent payment", "Apr 1", "$2,400"], ["Auto insurance", "Apr 22", "$186"]]
  return (
    <Card>
      <CardHeader><CardTitle>Upcoming payments</CardTitle><CardDescription>Select a date to inspect the schedule.</CardDescription></CardHeader>
      <CardContent className="flex flex-col gap-4"><Item variant="outline" className="justify-center"><Calendar mode="single" selected={date} onSelect={(value) => value && setDate(value)} className="w-full" /></Item><ItemGroup>{payments.map((payment) => <Item key={payment[0]} variant="muted"><ItemContent><ItemTitle>{payment[0]}</ItemTitle><ItemDescription>{payment[1]}</ItemDescription></ItemContent><Badge variant="secondary">{payment[2]}</Badge></Item>)}</ItemGroup></CardContent>
    </Card>
  )
}

export function AccountAccess() {
  return (
    <Card>
      <CardHeader><CardTitle>Account access</CardTitle><CardDescription>Update credentials or re-authenticate.</CardDescription></CardHeader>
      <CardContent><FieldGroup><Field><FieldLabel htmlFor="access-email">Email address</FieldLabel><Input id="access-email" type="email" defaultValue="artist@studio.inc" /></Field><Field><FieldLabel htmlFor="access-password">Current password</FieldLabel><Input id="access-password" type="password" defaultValue="password123" /></Field></FieldGroup></CardContent>
      <CardFooter className="flex-col gap-3"><Button className="w-full"><Icon name="lock-keyhole" data-icon="inline-start" />Update security</Button><Item variant="muted" className="w-full"><ItemMedia variant="icon"><Icon name="circle-alert" className="text-destructive" /></ItemMedia><ItemContent><ItemTitle>Danger zone</ItemTitle><ItemDescription>Archive account and remove catalog.</ItemDescription></ItemContent><Icon name="arrow-right" /></Item></CardFooter>
    </Card>
  )
}

export function SocialLinks() {
  const links = [["Spotify artist URL", "circle-plus", "spotify.com/artist/3j...2k"], ["Instagram handle", "camera", "@julianduryea_music"], ["SoundCloud URL", "cloud", "soundcloud.com/username"], ["Website", "globe", "https://yoursite.com"]]
  return (
    <Card>
      <CardHeader><CardTitle>Social links</CardTitle><CardDescription>Connect public profiles and destinations.</CardDescription></CardHeader>
      <CardContent><FieldGroup>{links.map((link, index) => <Field key={link[0]}><FieldLabel htmlFor={`social-${index}`}>{link[0]}</FieldLabel><InputGroup><InputGroupAddon><Icon name={link[1]} /></InputGroupAddon><InputGroupInput id={`social-${index}`} defaultValue={link[2]} /></InputGroup></Field>)}</FieldGroup></CardContent>
      <CardFooter><Button variant="secondary">Discard</Button><Button className="ml-auto">Save changes</Button></CardFooter>
    </Card>
  )
}

export function NewMilestone() {
  return (
    <Card>
      <CardHeader><CardTitle>Set a new milestone</CardTitle><CardDescription>Define a target and pace your savings.</CardDescription></CardHeader>
      <CardContent><FieldGroup><Field><FieldLabel htmlFor="goal-name">Goal name</FieldLabel><Input id="goal-name" placeholder="New car or home downpayment" /></Field><div className="grid grid-cols-2 gap-3"><Field><FieldLabel htmlFor="goal-amount">Target amount</FieldLabel><Input id="goal-amount" defaultValue="$15,000" /></Field><Field><FieldLabel htmlFor="goal-date">Target date</FieldLabel><Input id="goal-date" defaultValue="Dec 2026" /></Field></div></FieldGroup></CardContent>
      <CardFooter className="flex-col gap-2"><Button className="w-full">Create goal</Button><Button variant="outline" className="w-full">Cancel</Button></CardFooter>
    </Card>
  )
}

export function UiElements() {
  const [slider, setSlider] = useState(500)

  return (
    <Card>
      <CardHeader><CardTitle>UI elements</CardTitle><CardDescription>Controls from the active shadcn preset.</CardDescription></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-2"><Button>Primary</Button><Button variant="secondary">Secondary</Button><Button variant="outline">Outline</Button><Button variant="ghost">Ghost</Button></div>
        <Item variant="outline"><ItemContent><ItemTitle>Two-factor authentication</ItemTitle><ItemDescription>Verify through email or an authenticator.</ItemDescription></ItemContent><ItemActions><Button size="sm" variant="secondary">Enable</Button></ItemActions></Item>
        <div className="flex items-center justify-between gap-3"><span className="text-sm text-muted-foreground">Monthly usage</span><Badge variant="outline">{slider}</Badge></div>
        <Slider value={slider} onValueChange={setSlider} max={1000} min={0} step={10} aria-label="Monthly usage" />
        <FieldGroup><Field><Input placeholder="Name" /></Field><Field><Textarea placeholder="Message" /></Field></FieldGroup>
        <div className="flex flex-wrap items-center gap-3"><Badge>Badge</Badge><Badge variant="secondary">Secondary</Badge><Badge variant="outline">Outline</Badge><Checkbox defaultChecked /><Checkbox /><Switch defaultChecked /></div>
        <div className="flex flex-wrap gap-3">
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="outline" />}>Alert dialog</AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader><AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle><AlertDialogDescription>Allow this accessory to access the current device?</AlertDialogDescription></AlertDialogHeader>
              <AlertDialogFooter><AlertDialogCancel>Don&apos;t allow</AlertDialogCancel><AlertDialogAction>Allow</AlertDialogAction></AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>Quick actions</DropdownMenuTrigger>
            <DropdownMenuContent align="start"><DropdownMenuGroup><DropdownMenuLabel>Conversation</DropdownMenuLabel><DropdownMenuItem>Mark as read</DropdownMenuItem><DropdownMenuItem>Share</DropdownMenuItem><DropdownMenuItem>Archive</DropdownMenuItem></DropdownMenuGroup><DropdownMenuSeparator /><DropdownMenuGroup><DropdownMenuItem variant="destructive">Delete</DropdownMenuItem></DropdownMenuGroup></DropdownMenuContent>
          </DropdownMenu>
          <Popover><PopoverTrigger render={<Button variant="outline" />}>Details</PopoverTrigger><PopoverContent><PopoverHeader><PopoverTitle>Current value</PopoverTitle><PopoverDescription>The slider is set to {slider}.</PopoverDescription></PopoverHeader></PopoverContent></Popover>
        </div>
      </CardContent>
    </Card>
  )
}

export function FeedbackCard() {
  return (
    <Card>
      <CardHeader><CardTitle>Share feedback</CardTitle><CardDescription>Tell us about the component experience.</CardDescription></CardHeader>
      <CardContent>
        <FieldGroup>
          <Field><FieldLabel htmlFor="preview-topic">Topic</FieldLabel><NativeSelect id="preview-topic" defaultValue="interface"><NativeSelectOption value="interface">Interface</NativeSelectOption><NativeSelectOption value="accessibility">Accessibility</NativeSelectOption><NativeSelectOption value="performance">Performance</NativeSelectOption></NativeSelect></Field>
          <Field><FieldLabel htmlFor="preview-feedback">Feedback</FieldLabel><Textarea id="preview-feedback" placeholder="Your feedback helps us improve..." /></Field>
        </FieldGroup>
      </CardContent>
      <CardFooter><Button>Submit</Button></CardFooter>
    </Card>
  )
}

export function TypographyCard() {
  const tokens = [
    ["background", "bg-background"],
    ["foreground", "bg-foreground"],
    ["primary", "bg-primary"],
    ["secondary", "bg-secondary"],
    ["muted", "bg-muted"],
    ["accent", "bg-accent"],
  ]

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="text-xs font-medium text-muted-foreground uppercase">Nova · Obsidian interface font</div>
        <p className="text-2xl font-medium">Designing with rhythm and hierarchy.</p>
        <p className="text-sm leading-relaxed text-muted-foreground">A strong body style keeps long-form content readable and balances the visual weight of headings.</p>
        <div className="grid grid-cols-6 gap-3">{tokens.map(([name, className]) => <div key={name} className="flex flex-col items-center gap-2"><div className={`aspect-square w-full rounded-lg ${className}`} /><span className="text-xs text-muted-foreground">{name}</span></div>)}</div>
      </CardContent>
    </Card>
  )
}

export function LucideIconsCard() {
  const icons = ["sparkles", "book-open", "chart-pie", "database", "house", "wand-sparkles", "SearchIcon", "CirclePlusIcon"]

  return (
    <Card>
      <CardHeader><CardTitle>Dynamic Lucide icons</CardTitle><CardDescription>Every bundled icon is available by kebab-case or shadcn-style name.</CardDescription></CardHeader>
      <CardContent className="grid grid-cols-4 gap-4">
        {icons.map((name) => <div key={name} className="flex flex-col items-center gap-2 rounded-lg border p-3"><Icon name={name} aria-label={name} /><span className="text-xs text-muted-foreground">{name}</span></div>)}
      </CardContent>
      <CardFooter><Button><Icon name="sparkles" data-icon="inline-start" />Illustrate this note</Button></CardFooter>
    </Card>
  )
}

export function AnomalyAlert() {
  return <Card><CardContent><Empty className="h-48"><EmptyHeader><EmptyMedia variant="icon"><Icon name="scan-search" /></EmptyMedia><EmptyTitle>Get alerted for anomalies</EmptyTitle><EmptyDescription>Monitor projects automatically and receive useful notifications.</EmptyDescription></EmptyHeader><EmptyContent><Button>Upgrade observability</Button></EmptyContent></Empty></CardContent></Card>
}

export function EnvironmentVariables() {
  const variables = [{ key: "DATABASE_URL", value: "••••••••" }, { key: "NEXT_PUBLIC_API", value: "https://api.example.com" }, { key: "STRIPE_SECRET", value: "••••••••" }]
  return (
    <Card>
      <CardHeader><CardTitle>Environment variables</CardTitle><CardDescription>Production · 8 variables</CardDescription></CardHeader>
      <CardContent className="flex flex-col gap-2">{variables.map((variable) => <div key={variable.key} className="flex items-center gap-2 rounded-md px-2.5 py-2 font-mono text-xs ring ring-border"><span className="font-medium">{variable.key}</span><span className="ml-auto text-muted-foreground">{variable.value}</span></div>)}</CardContent>
      <CardFooter><Button variant="outline">Edit</Button><Button className="ml-auto"><Icon name="rocket" data-icon="inline-start" />Deploy</Button></CardFooter>
    </Card>
  )
}

export function NotFoundCard() {
  return (
    <Card><CardContent><Empty className="h-72"><EmptyHeader><EmptyMedia variant="icon"><Icon name="file-question" /></EmptyMedia><EmptyTitle>404 · Not found</EmptyTitle><EmptyDescription>The page does not exist. Try searching below.</EmptyDescription></EmptyHeader><EmptyContent><InputGroup className="w-3/4"><InputGroupAddon><Icon name="search" /></InputGroupAddon><InputGroupInput placeholder="Search pages..." /><InputGroupAddon align="inline-end"><Kbd>/</Kbd></InputGroupAddon></InputGroup><Button variant="link">Go to homepage</Button></EmptyContent></Empty></CardContent></Card>
  )
}

export function KeyboardShortcuts() {
  const shortcuts = [["Search", ["⌘", "K"]], ["Quick actions", ["⌘", "J"]], ["New file", ["⌘", "N"]], ["Save", ["⌘", "S"]], ["Toggle sidebar", ["⌘", "B"]]]
  return (
    <Card><CardHeader><CardTitle>Keyboard shortcuts</CardTitle><CardDescription>Common workspace commands.</CardDescription></CardHeader><CardContent><ItemGroup>{shortcuts.map((shortcut) => <Item key={shortcut[0]} size="xs"><ItemContent><ItemTitle>{shortcut[0]}</ItemTitle></ItemContent><ItemActions><div className="flex gap-1">{shortcut[1].map((key) => <Kbd key={key}>{key}</Kbd>)}</div></ItemActions></Item>)}</ItemGroup></CardContent></Card>
  )
}

export function BookAppointment() {
  const times = ["9:00 AM", "10:30 AM", "11:00 AM", "1:30 PM"]
  return (
    <Card>
      <CardHeader><CardTitle>Book appointment</CardTitle><CardDescription>Dr. Sarah Chen · Cardiology</CardDescription></CardHeader>
      <CardContent className="flex flex-col gap-4"><Field><FieldLabel>Available on March 18</FieldLabel><ToggleGroup spacing={2} defaultValue={["slot-0"]}>{times.map((time, index) => <ToggleGroupItem key={time} value={`slot-${index}`}>{time}</ToggleGroupItem>)}</ToggleGroup></Field><Alert><AlertTitle>New patient?</AlertTitle><AlertDescription>Please arrive 15 minutes early.</AlertDescription></Alert></CardContent>
      <CardFooter><Button className="w-full"><Icon name="calendar-check" data-icon="inline-start" />Book appointment</Button></CardFooter>
    </Card>
  )
}

export function ContributorsCard() {
  const contributors = ["CN", "ML", "ER", "VR", "TW", "TS", "ES", "PR", "BB", "VT", "RC", "AN"]
  return (
    <Card><CardHeader><CardTitle>Contributors <Badge variant="secondary">312</Badge></CardTitle><CardDescription>Local fallbacks avoid remote avatar requests.</CardDescription></CardHeader><CardContent><div className="flex flex-wrap gap-2">{contributors.map((initials) => <Avatar key={initials}><AvatarFallback>{initials}</AvatarFallback></Avatar>)}</div></CardContent><CardFooter><Button variant="link">View all contributors</Button></CardFooter></Card>
  )
}

export function InvoiceCard() {
  const items = [{ item: "Design system license", qty: 1, rate: 499 }, { item: "Priority support", qty: 12, rate: 99 }, { item: "Custom components", qty: 3, rate: 250 }]
  const money = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)
  const total = items.reduce((sum, item) => sum + item.qty * item.rate, 0)
  return (
    <Card>
      <CardHeader><CardTitle>Invoice #INV-2847</CardTitle><CardDescription>Due March 30</CardDescription><CardAction><Badge variant="secondary">Pending</Badge></CardAction></CardHeader>
      <CardContent><Table><TableHeader><TableRow><TableHead>Item</TableHead><TableHead>Qty</TableHead><TableHead>Rate</TableHead><TableHead>Amount</TableHead></TableRow></TableHeader><TableBody>{items.map((item) => <TableRow key={item.item}><TableCell>{item.item}</TableCell><TableCell>{item.qty}</TableCell><TableCell>{money(item.rate)}</TableCell><TableCell>{money(item.qty * item.rate)}</TableCell></TableRow>)}</TableBody><TableFooter><TableRow><TableCell colSpan={3}>Total due</TableCell><TableCell>{money(total)}</TableCell></TableRow></TableFooter></Table></CardContent>
      <CardFooter><Button variant="outline"><Icon name="download" data-icon="inline-start" />Download PDF</Button><Button className="ml-auto">Pay now</Button></CardFooter>
    </Card>
  )
}

export function InviteTeam() {
  const roles = [{ label: "Admin", value: "admin" }, { label: "Editor", value: "editor" }, { label: "Viewer", value: "viewer" }]
  const invites = [["alex@example.com", "editor"], ["sam@example.com", "viewer"]]
  return (
    <Card>
      <CardHeader><CardTitle>Invite team</CardTitle><CardDescription>Add members to your workspace.</CardDescription></CardHeader>
      <CardContent className="flex flex-col gap-4">{invites.map((invite) => <div key={invite[0]} className="flex items-center gap-2"><Input defaultValue={invite[0]} className="flex-1" /><Select items={roles} defaultValue={invite[1]}><SelectTrigger className="w-28"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{roles.map((role) => <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>)}</SelectGroup></SelectContent></Select></div>)}<Button variant="outline"><Icon name="plus" data-icon="inline-start" />Add another</Button><Separator /><Field><FieldLabel htmlFor="invite-link">Share invite link</FieldLabel><InputGroup><InputGroupInput id="invite-link" defaultValue="https://app.co/invite/x8f2k" readOnly /><InputGroupAddon align="inline-end"><InputGroupButton size="icon-xs" aria-label="Copy link"><Icon name="copy" /></InputGroupButton></InputGroupAddon></InputGroup></Field></CardContent>
      <CardFooter><Button className="w-full">Send invites</Button></CardFooter>
    </Card>
  )
}

export function ReportBug() {
  const severities = ["Critical", "High", "Medium", "Low"].map((label) => ({ label, value: label.toLowerCase() }))
  return (
    <Card>
      <CardHeader><CardTitle>Report bug</CardTitle><CardDescription>Help resolve issues faster.</CardDescription></CardHeader>
      <CardContent><FieldGroup><Field><FieldLabel htmlFor="bug-title">Title</FieldLabel><Input id="bug-title" placeholder="Brief description" /></Field><Field><FieldLabel htmlFor="bug-severity">Severity</FieldLabel><Select items={severities} defaultValue="medium"><SelectTrigger id="bug-severity" className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{severities.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent></Select></Field><Field><FieldLabel htmlFor="bug-steps">Steps to reproduce</FieldLabel><Textarea id="bug-steps" placeholder="1. Open the note&#10;2. Select the component&#10;3. Observe..." className="min-h-24 resize-none" /></Field></FieldGroup></CardContent>
      <CardFooter><Button variant="outline">Attach file</Button><Button className="ml-auto">Submit bug</Button></CardFooter>
    </Card>
  )
}

export function EmptyTeam() {
  return (
    <Card><CardContent><Empty className="h-56"><EmptyHeader><EmptyMedia><AvatarGroup><Avatar size="lg"><AvatarFallback>CN</AvatarFallback></Avatar><Avatar size="lg"><AvatarFallback>ML</AvatarFallback></Avatar><Avatar size="lg"><AvatarFallback>ER</AvatarFallback></Avatar></AvatarGroup></EmptyMedia><EmptyTitle>No team members</EmptyTitle><EmptyDescription>Invite your team to collaborate on this project.</EmptyDescription></EmptyHeader><EmptyContent><Button size="sm">Invite members</Button></EmptyContent></Empty></CardContent></Card>
  )
}

export function VisitorsBarChart() {
  const { Bar, BarChart, CartesianGrid, XAxis } = Recharts
  const data = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ]
  const config = {
    desktop: { label: "Desktop", color: "var(--chart-1)" },
    mobile: { label: "Mobile", color: "var(--chart-2)" },
  }

  return (
    <Card>
      <CardHeader><CardTitle>Visitors by device</CardTitle><CardDescription>January–June 2026</CardDescription><CardAction><Badge variant="secondary">+12.5%</Badge></CardAction></CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-56 w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter><CardDescription>Hover a bar to inspect its exact value.</CardDescription></CardFooter>
    </Card>
  )
}

export function RevenueAreaChart() {
  const { Area, AreaChart, CartesianGrid, XAxis } = Recharts
  const data = [
    { month: "Jan", subscription: 3200, services: 1800 },
    { month: "Feb", subscription: 3600, services: 2100 },
    { month: "Mar", subscription: 4100, services: 1950 },
    { month: "Apr", subscription: 4600, services: 2400 },
    { month: "May", subscription: 5200, services: 2800 },
    { month: "Jun", subscription: 5900, services: 3100 },
  ]
  const config = {
    subscription: { label: "Subscription", color: "var(--chart-1)" },
    services: { label: "Services", color: "var(--chart-3)" },
  }

  return (
    <Card>
      <CardHeader><CardTitle>Revenue mix</CardTitle><CardDescription>Stacked monthly revenue</CardDescription></CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-56 w-full">
          <AreaChart accessibilityLayer data={data} margin={{ left: 8, right: 8 }}>
            <defs>
              <linearGradient id="fillSubscription" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--color-subscription)" stopOpacity={0.8} /><stop offset="95%" stopColor="var(--color-subscription)" stopOpacity={0.1} /></linearGradient>
              <linearGradient id="fillServices" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--color-services)" stopOpacity={0.8} /><stop offset="95%" stopColor="var(--color-services)" stopOpacity={0.1} /></linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Area dataKey="services" type="natural" fill="url(#fillServices)" fillOpacity={0.4} stroke="var(--color-services)" stackId="a" />
            <Area dataKey="subscription" type="natural" fill="url(#fillSubscription)" fillOpacity={0.4} stroke="var(--color-subscription)" stackId="a" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter><CardDescription>Recurring revenue continues to lead growth.</CardDescription></CardFooter>
    </Card>
  )
}

export function PortfolioLineChart() {
  const { CartesianGrid, Line, LineChart, XAxis } = Recharts
  const data = [
    { month: "Jan", portfolio: 100, benchmark: 100 },
    { month: "Feb", portfolio: 104, benchmark: 102 },
    { month: "Mar", portfolio: 102, benchmark: 103 },
    { month: "Apr", portfolio: 109, benchmark: 106 },
    { month: "May", portfolio: 114, benchmark: 108 },
    { month: "Jun", portfolio: 121, benchmark: 111 },
  ]
  const config = {
    portfolio: { label: "Portfolio", color: "var(--chart-1)" },
    benchmark: { label: "Benchmark", color: "var(--chart-4)" },
  }

  return (
    <Card>
      <CardHeader><CardTitle>Portfolio performance</CardTitle><CardDescription>Indexed to 100 in January</CardDescription><CardAction><Badge variant="outline">YTD</Badge></CardAction></CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-56 w-full">
          <LineChart accessibilityLayer data={data} margin={{ left: 8, right: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line dataKey="portfolio" type="monotone" stroke="var(--color-portfolio)" strokeWidth={2} dot={false} />
            <Line dataKey="benchmark" type="monotone" stroke="var(--color-benchmark)" strokeWidth={2} strokeDasharray="4 4" dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter><CardDescription>Portfolio outperformed the benchmark by 10 points.</CardDescription></CardFooter>
    </Card>
  )
}

export function AllocationDonutChart() {
  const { Pie, PieChart } = Recharts
  const data = [
    { asset: "equities", allocation: 55, fill: "var(--color-equities)" },
    { asset: "bonds", allocation: 25, fill: "var(--color-bonds)" },
    { asset: "realEstate", allocation: 12, fill: "var(--color-realEstate)" },
    { asset: "cash", allocation: 8, fill: "var(--color-cash)" },
  ]
  const config = {
    allocation: { label: "Allocation" },
    equities: { label: "Equities", color: "var(--chart-1)" },
    bonds: { label: "Bonds", color: "var(--chart-2)" },
    realEstate: { label: "Real estate", color: "var(--chart-3)" },
    cash: { label: "Cash", color: "var(--chart-4)" },
  }

  return (
    <Card>
      <CardHeader><CardTitle>Asset allocation</CardTitle><CardDescription>Current portfolio distribution</CardDescription></CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-56 w-full">
          <PieChart accessibilityLayer>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="asset" />} />
            <Pie data={data} dataKey="allocation" nameKey="asset" innerRadius={52} outerRadius={82} strokeWidth={4} />
          </PieChart>
        </ChartContainer>
        <ItemGroup className="grid grid-cols-2 gap-2">{data.map((item) => <Item key={item.asset} size="xs" variant="muted"><ItemContent><ItemTitle>{config[item.asset].label}</ItemTitle></ItemContent><ItemActions><Badge variant="outline">{item.allocation}%</Badge></ItemActions></Item>)}</ItemGroup>
      </CardContent>
    </Card>
  )
}

export function CreatePreviewShowcase() {
  return (
    <Tabs defaultValue="01" className="w-full min-w-0">
      <TabsList aria-label="Shadcn Create preview"><TabsTrigger value="01">01</TabsTrigger><TabsTrigger value="02">02</TabsTrigger></TabsList>
      <TabsContent value="01" className="pt-4">
        <div className="grid items-start gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <div className="flex flex-col gap-4"><SavingsTargets /><ClaimableBalance /><NotificationSettings /><NewMilestone /></div>
          <div className="flex flex-col gap-4"><PreferencesCard /><TransferFunds /><RollerShades /><SocialLinks /></div>
          <div className="flex flex-col gap-4"><ActivityTable /><UpcomingPayments /><AccountAccess /><SupportFaq /></div>
        </div>
      </TabsContent>
      <TabsContent value="02" className="pt-4">
        <div className="mb-4 grid items-start gap-4 lg:grid-cols-2"><VisitorsBarChart /><RevenueAreaChart /><PortfolioLineChart /><AllocationDonutChart /></div>
        <div className="grid items-start gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <div className="flex flex-col gap-4"><TypographyCard /><LucideIconsCard /><EnvironmentVariables /><KeyboardShortcuts /><AnomalyAlert /></div>
          <div className="flex flex-col gap-4"><UiElements /><InviteTeam /><BookAppointment /><ReportBug /></div>
          <div className="flex flex-col gap-4"><InvoiceCard /><ContributorsCard /><EmptyTeam /><NotFoundCard /><FeedbackCard /><Card><CardHeader><CardTitle>Loading state</CardTitle><CardDescription>Skeleton primitives remain theme-aware.</CardDescription></CardHeader><CardContent className="flex flex-col gap-3"><Skeleton className="h-5 w-2/3" /><Skeleton className="h-24 w-full" /><Skeleton className="h-8 w-1/3" /></CardContent></Card></div>
        </div>
      </TabsContent>
    </Tabs>
  )
}

<CreatePreviewShowcase />

## Native Markdown after the showcase

The remainder of the note is ordinary Markdown, including [[wikilinks]], callouts, Properties, backlinks, and embeds.

> [!note]
> Edit the local component declarations above in Live Preview; move the cursor outside the JSX region to render the showcase again.
