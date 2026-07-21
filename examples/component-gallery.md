---
title: MDX component gallery
mdx: true
---

# MDX component gallery

This note exercises every component module emitted by the shadcn `b0` catalog. Each top-level JSX group is an independent React root.

## Actions, status, and disclosure

<div className="flex flex-wrap items-center gap-3">
  <Button>Button</Button>
  <ButtonGroup><Button variant="outline">Left</Button><Button variant="outline">Right</Button></ButtonGroup>
  <Badge>Badge</Badge>
  <Toggle>Toggle</Toggle>
  <ToggleGroup defaultValue={["one"]}><ToggleGroupItem value="one">One</ToggleGroupItem><ToggleGroupItem value="two">Two</ToggleGroupItem></ToggleGroup>
  <Spinner />
</div>

<Accordion>
  <AccordionItem value="details">
    <AccordionTrigger>Accordion</AccordionTrigger>
    <AccordionContent>Expandable content.</AccordionContent>
  </AccordionItem>
</Accordion>

<Collapsible>
  <CollapsibleTrigger render={<Button variant="outline" />}>Collapsible</CollapsibleTrigger>
  <CollapsibleContent className="pt-2">Collapsible content.</CollapsibleContent>
</Collapsible>

<Alert>
  <AlertTitle>Alert</AlertTitle>
  <AlertDescription>Important local information.</AlertDescription>
</Alert>

## Cards, items, messages, and empty states

<div className="grid gap-4 md:grid-cols-2">
  <Card>
    <CardHeader><CardTitle>Card</CardTitle><CardDescription>Composed card anatomy.</CardDescription></CardHeader>
    <CardContent>Card content</CardContent>
    <CardFooter>Card footer</CardFooter>
  </Card>
  <Empty>
    <EmptyHeader><EmptyTitle>Empty state</EmptyTitle><EmptyDescription>Nothing here yet.</EmptyDescription></EmptyHeader>
    <EmptyContent><Button size="sm">Create</Button></EmptyContent>
  </Empty>
</div>

<ItemGroup>
  <Item><ItemContent><ItemTitle>Item</ItemTitle><ItemDescription>Structured list content.</ItemDescription></ItemContent><ItemActions><Button size="sm">Open</Button></ItemActions></Item>
  <ItemSeparator />
  <Item><ItemContent><ItemTitle>Second item</ItemTitle></ItemContent></Item>
</ItemGroup>

<BubbleGroup>
  <Bubble><BubbleContent>Bubble message</BubbleContent><BubbleReactions>👍 1</BubbleReactions></Bubble>
</BubbleGroup>

<MessageGroup>
  <Message><MessageAvatar fallback="SY" /><MessageContent>Message content</MessageContent><MessageFooter>Now</MessageFooter></Message>
</MessageGroup>

<MessageScrollerProvider>
  <MessageScroller className="h-32 rounded-lg border">
    <MessageScrollerViewport>
      <MessageScrollerContent>
        <MessageScrollerItem>Scrollable message one</MessageScrollerItem>
        <MessageScrollerItem>Scrollable message two</MessageScrollerItem>
      </MessageScrollerContent>
    </MessageScrollerViewport>
  </MessageScroller>
</MessageScrollerProvider>

## Forms

<FieldGroup>
  <Field><FieldLabel htmlFor="gallery-input">Input</FieldLabel><Input id="gallery-input" placeholder="Type here" /><FieldDescription>Standard input.</FieldDescription></Field>
  <Field><FieldLabel htmlFor="gallery-textarea">Textarea</FieldLabel><Textarea id="gallery-textarea" placeholder="Longer text" /></Field>
  <Field><FieldLabel>Checkbox</FieldLabel><Checkbox defaultChecked /></Field>
  <Field><FieldLabel>Switch</FieldLabel><Switch defaultChecked /></Field>
  <Field><FieldLabel>Slider</FieldLabel><Slider defaultValue={35} /></Field>
  <Field>
    <FieldLabel>Radio group</FieldLabel>
    <RadioGroup defaultValue="one"><div className="flex gap-3"><RadioGroupItem value="one" /> One <RadioGroupItem value="two" /> Two</div></RadioGroup>
  </Field>
</FieldGroup>

<InputGroup>
  <InputGroupAddon><InputGroupText>$</InputGroupText></InputGroupAddon>
  <InputGroupInput placeholder="Amount" />
  <InputGroupAddon align="inline-end"><InputGroupButton>Send</InputGroupButton></InputGroupAddon>
</InputGroup>

<InputOTP maxLength={6}>
  <InputOTPGroup><InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} /></InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup><InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} /></InputOTPGroup>
</InputOTP>

<div className="flex flex-wrap gap-3">
  <NativeSelect defaultValue="one"><NativeSelectOption value="one">Native select</NativeSelectOption><NativeSelectOption value="two">Second</NativeSelectOption></NativeSelect>
  <Select defaultValue="one"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectGroup><SelectLabel>Options</SelectLabel><SelectItem value="one">Select one</SelectItem><SelectItem value="two">Select two</SelectItem></SelectGroup></SelectContent></Select>
  <Combobox items={["One", "Two", "Three"]}><ComboboxInput placeholder="Combobox" /><ComboboxContent><ComboboxList><ComboboxEmpty>No results.</ComboboxEmpty><ComboboxCollection>{(item) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}</ComboboxCollection></ComboboxList></ComboboxContent></Combobox>
</div>

## Navigation

<Tabs defaultValue="one"><TabsList><TabsTrigger value="one">One</TabsTrigger><TabsTrigger value="two">Two</TabsTrigger></TabsList><TabsContent value="one">First tab</TabsContent><TabsContent value="two">Second tab</TabsContent></Tabs>

<Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>Gallery</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>

<Pagination><PaginationContent><PaginationItem><PaginationPrevious href="#" /></PaginationItem><PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem><PaginationItem><PaginationEllipsis /></PaginationItem><PaginationItem><PaginationNext href="#" /></PaginationItem></PaginationContent></Pagination>

<NavigationMenu><NavigationMenuList><NavigationMenuItem><NavigationMenuTrigger>Explore</NavigationMenuTrigger><NavigationMenuContent><NavigationMenuLink href="#">Navigation menu link</NavigationMenuLink></NavigationMenuContent></NavigationMenuItem></NavigationMenuList></NavigationMenu>

<Menubar><MenubarMenu><MenubarTrigger>File</MenubarTrigger><MenubarContent><MenubarGroup><MenubarItem>New note<MenubarShortcut>⌘N</MenubarShortcut></MenubarItem></MenubarGroup></MenubarContent></MenubarMenu></Menubar>

<Command><CommandInput placeholder="Command search" /><CommandList><CommandEmpty>No results.</CommandEmpty><CommandGroup heading="Suggestions"><CommandItem>Open note</CommandItem><CommandItem>Search vault</CommandItem></CommandGroup></CommandList></Command>

## Overlays and menus

<div className="flex flex-wrap gap-3">
  <Dialog><DialogTrigger render={<Button variant="outline" />}>Dialog</DialogTrigger><DialogContent><DialogHeader><DialogTitle>Dialog title</DialogTitle><DialogDescription>Dialog description.</DialogDescription></DialogHeader></DialogContent></Dialog>
  <AlertDialog><AlertDialogTrigger render={<Button variant="outline" />}>Alert dialog</AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Continue?</AlertDialogTitle><AlertDialogDescription>This demonstrates a confirmation dialog.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction>Continue</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
  <Sheet><SheetTrigger render={<Button variant="outline" />}>Sheet</SheetTrigger><SheetContent><SheetHeader><SheetTitle>Sheet title</SheetTitle><SheetDescription>Side panel content.</SheetDescription></SheetHeader></SheetContent></Sheet>
  <Drawer><DrawerTrigger render={<Button variant="outline" />}>Drawer</DrawerTrigger><DrawerContent><DrawerHeader><DrawerTitle>Drawer title</DrawerTitle><DrawerDescription>Drawer content.</DrawerDescription></DrawerHeader></DrawerContent></Drawer>
  <Popover><PopoverTrigger render={<Button variant="outline" />}>Popover</PopoverTrigger><PopoverContent><PopoverHeader><PopoverTitle>Popover</PopoverTitle><PopoverDescription>Popover content.</PopoverDescription></PopoverHeader></PopoverContent></Popover>
  <HoverCard><HoverCardTrigger render={<Button variant="outline" />}>Hover card</HoverCardTrigger><HoverCardContent>Hover card content.</HoverCardContent></HoverCard>
  <Tooltip><TooltipTrigger render={<Button variant="outline" />}>Tooltip</TooltipTrigger><TooltipContent>Helpful tooltip</TooltipContent></Tooltip>
</div>

<DropdownMenu><DropdownMenuTrigger render={<Button variant="outline" />}>Dropdown menu</DropdownMenuTrigger><DropdownMenuContent><DropdownMenuGroup><DropdownMenuLabel>Actions</DropdownMenuLabel><DropdownMenuItem>Open</DropdownMenuItem><DropdownMenuItem>Duplicate</DropdownMenuItem></DropdownMenuGroup></DropdownMenuContent></DropdownMenu>

<ContextMenu><ContextMenuTrigger><div className="rounded-lg border p-4">Right-click for context menu</div></ContextMenuTrigger><ContextMenuContent><ContextMenuGroup><ContextMenuItem>Inspect</ContextMenuItem><ContextMenuItem>Copy</ContextMenuItem></ContextMenuGroup></ContextMenuContent></ContextMenu>

## Data and layout

<Table><TableCaption>Table caption</TableCaption><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>MDX</TableCell><TableCell>Active</TableCell></TableRow></TableBody></Table>

<div className="flex flex-col gap-3">
  <Progress value={65}><ProgressLabel>Progress</ProgressLabel><ProgressTrack><ProgressIndicator /></ProgressTrack><ProgressValue /></Progress>
  <Separator />
  <Skeleton className="h-8 w-full" />
</div>

<ScrollArea className="h-28 rounded-lg border p-3"><div className="h-64">Scroll area<br />with tall content.</div><ScrollBar /></ScrollArea>

<ResizablePanelGroup orientation="horizontal" className="min-h-24 rounded-lg border"><ResizablePanel defaultSize={50}><div className="p-4">Panel one</div></ResizablePanel><ResizableHandle withHandle /><ResizablePanel defaultSize={50}><div className="p-4">Panel two</div></ResizablePanel></ResizablePanelGroup>

<AspectRatio ratio={16 / 9}><div className="flex size-full items-center justify-center rounded-lg bg-muted">Aspect ratio</div></AspectRatio>

<Carousel><CarouselContent><CarouselItem><Card><CardContent>Carousel one</CardContent></Card></CarouselItem><CarouselItem><Card><CardContent>Carousel two</CardContent></Card></CarouselItem></CarouselContent><CarouselPrevious /><CarouselNext /></Carousel>

<ChartContainer config={{value: {label: "Value", color: "var(--interactive-accent)"}}} className="h-32"><div className="flex size-full items-center justify-center rounded-lg border">Chart container and style context</div></ChartContainer>

<Calendar mode="single" />

## Media, identity, and utilities

<div className="flex flex-wrap items-center gap-4">
  <Avatar><AvatarFallback>SY</AvatarFallback><AvatarBadge /></Avatar>
  <AvatarGroup><Avatar><AvatarFallback>A</AvatarFallback></Avatar><Avatar><AvatarFallback>B</AvatarFallback></Avatar><AvatarGroupCount>+2</AvatarGroupCount></AvatarGroup>
  <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>
  <Marker><MarkerIcon>•</MarkerIcon><MarkerContent>Marker</MarkerContent></Marker>
</div>

<AttachmentGroup><Attachment><AttachmentMedia>📄</AttachmentMedia><AttachmentContent><AttachmentTitle>Attachment</AttachmentTitle><AttachmentDescription>Local file metadata</AttachmentDescription></AttachmentContent><AttachmentActions><AttachmentAction>Open</AttachmentAction></AttachmentActions></Attachment></AttachmentGroup>

<DirectionProvider direction="ltr"><div className="rounded-lg border p-3">Direction provider</div></DirectionProvider>

<SidebarProvider defaultOpen={false}><Sidebar><SidebarHeader>Sidebar</SidebarHeader><SidebarContent><SidebarGroup><SidebarGroupLabel>Group</SidebarGroupLabel><SidebarGroupContent><SidebarMenu><SidebarMenuItem><SidebarMenuButton>Menu item</SidebarMenuButton></SidebarMenuItem></SidebarMenu></SidebarGroupContent></SidebarGroup></SidebarContent></Sidebar><SidebarInset><SidebarTrigger /><div className="p-3">Sidebar inset</div></SidebarInset></SidebarProvider>

<Toaster />
