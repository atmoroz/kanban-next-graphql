Refactor the CreateTaskModal component to better follow Feature-Sliced Design (FSD) without changing behavior.

Important rules:

- Do NOT split the main modal component.
- Do NOT move UI JSX into many small components.
- Only extract pure logic utilities.

Steps:

1. Extract the function `areArraysEqual` from CreateTaskModal into a shared utility.

Create a new file:
shared/lib/array/are-arrays-equal.ts

Implementation:

export function areArraysEqual(a: string[], b: string[]) {
if (a.length !== b.length) return false;

const sortedA = [...a].sort();
const sortedB = [...b].sort();

return sortedA.every((value, index) => value.trim() === sortedB[index].trim());
}

Then import it inside CreateTaskModal.

---

2. Extract the pristine form check logic into the feature model layer.

Create file:
features/task-form/model/is-task-form-pristine.ts

Move this logic there:

export function isTaskFormPristine({
mode,
title,
description,
statusId,
priority,
selectedLabelIds,
dueDate,
initialTitle,
initialDescription,
initialStatusId,
initialPriority,
initialLabelIds,
initialDueDate,
}) {
if (mode !== "update") return false;

return (
title.trim() === initialTitle.trim() &&
description.trim() === initialDescription.trim() &&
statusId === initialStatusId &&
priority === initialPriority &&
areArraysEqual(selectedLabelIds, initialLabelIds) &&
dueDate === initialDueDate
);
}

Then replace the inline `isPristine` logic in CreateTaskModal with this function.

---

3. Keep the following inside CreateTaskModal:

- React state
- event handlers
- submit logic
- JSX
- hooks
- UI layout

Do NOT move JSX or React hooks to other files.

Goal:
Improve FSD structure while keeping the component readable and self-contained.
