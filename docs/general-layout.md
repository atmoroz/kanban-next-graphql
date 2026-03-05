# General Layout View (Jira-style)

## Goal

The application layout should behave similar to **Jira Kanban board layout**.

The interface must use the **entire screen width and height** without artificial containers or fixed-width wrappers.

---

# Global Layout Structure

```
App
 ├── Header (fixed width: 100vw)
 ├── Content (flex container)
 │    ├── Left Sidebar
 │    └── Main Board
 └── Footer (fixed width: 100vw)
```

---

# Header

**Width**

- `width: 100vw`

**Padding**

- `padding-left: 15px`
- `padding-right: 15px`

**Behavior**

- Always stretches across the entire screen.
- No max-width container.

---

# Footer

Same behavior as Header.

**Width**

```
width: 100vw
padding-left: 15px
padding-right: 15px
```

---

# Content Area

The content area sits **between header and footer**.

```
height: 100%
width: 100%
display: flex
overflow: hidden
```

Important:

- It must **fill all remaining height**.
- It **must not scroll globally**.

Scrolling should exist **only inside specific areas**.

---

# Left Sidebar

Used for boards navigation.

### Width

Example:

```
width: 260px
flex-shrink: 0
```

### Scroll

Sidebar may scroll **vertically only**.

```
overflow-y: auto
overflow-x: hidden
```

### Behavior

- Sidebar **can collapse / slide left**.
- When it collapses, **main content expands automatically**.

Example collapsed state:

```
transform: translateX(-100%)
```

The main board must **move together with it**.

---

# Main Board

This is the Kanban board area.

### Width

```
flex: 1
min-width: 0
height: 100%
```

No margins from screen edges.

---

# Board Container

The board itself must:

- Take **full available width**
- Have **internal padding only**
- Have **no outer margins**
- Have **no borders on the right side**

Example:

```
width: 100%
height: 100%
padding: 24px
```

---

# Scroll Behavior (Important)

### Allowed scroll areas

| Area         | Scroll type           |
| ------------ | --------------------- |
| Left Sidebar | Vertical only         |
| Main Board   | Vertical + Horizontal |

### Forbidden

- No page scroll
- No body scroll
- No scroll on content wrapper

---

# Main Board Scroll

```
overflow: auto
```

The board must support:

- **horizontal scroll** (columns overflow)
- **vertical scroll** (many cards)

Similar to Jira Kanban board.

---

# Board Columns

Columns should expand horizontally.

```
display: flex
gap: 16px
height: 100%
```

Columns overflow horizontally → main board scrolls.

---

# Key Principles

1. **No fixed width containers**
2. **Use full screen width**
3. **Header/Footer = 100vw**
4. **Content fills remaining height**
5. **Sidebar scroll = vertical only**
6. **Board scroll = vertical + horizontal**
7. **Board has no outer margins**
8. **Sidebar collapse moves board**

---

# Visual Reference

Layout must behave like:

- Jira
- Linear
- Trello (fullscreen mode)

Full width application with internal scroll areas only.
