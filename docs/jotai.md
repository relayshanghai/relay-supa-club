# Jotai

Jotai is a state management library for React. It is based on the concept of atoms and selectors.

## When to use Global State

Global state is useful when you have data that needs to be shared across multiple components.
As a rule of thumb, to determine if you need global state, ask yourself the following questions:

- Does this data need to be shared across multiple components/pages?

- If I were using useState, Would I need to prop drill this data through multiple components that don't need it?

- Does it require more than 2 levels of prop drilling? (Parent -> Child -> Grandchild)

If you answered yes to 2/3 of these questions, you should use global state, i.e. Jotai Atom.

## Atoms

Atoms are units of state in Jotai. They are created with the `atom` function. Consider them nothing more than a variable that holds a value.

### Creating an atom

Conventionally, atoms are created in a separate file and exported for use in other components. For our project, we will create these atoms inside the `src/atoms` directory. Make sure each file is named like: 'x-x-atom.ts'.

```jsx
import { atom } from 'jotai'

export const countAtom = atom(0)
```

### Reading and Writing an Atom
Atoms can be read and written with the `useAtom` hook.

```jsx

import { useAtom } from 'jotai'

function Counter() {
  const [count, setCount] = useAtom(countAtom)

  return (
    <div>
      <div>{count}</div>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}
```

As you notice, it's exactly like useState. However, any atom that you create is actually accessible by all the components, anywhere at anytime if they want to read or write to it.

### ONLY Reading an Atom

If you want to read an atom but not write to it, you can use the `useAtomValue` hook.

```jsx
import { useAtomValue } from 'jotai'

function Counter() {
  const count = useAtomValue(countAtom)

  return (
    <div>
      <div>{count}</div>
    </div>
  )
}
```

### ONLY Writing an Atom

If you want to write to an atom but not read from it, you can use the `useSetAtom` hook.

```jsx
import { useSetAtom } from 'jotai'

function Counter() {
  const setCount = useSetAtom(countAtom)

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
    </div>
  )
}
```
