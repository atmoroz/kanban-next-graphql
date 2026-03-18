/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "mutation CreateBoard($title: String!, $description: String, $visibility: BoardVisibility!) {\n  createBoard(title: $title, description: $description, visibility: $visibility) {\n    id\n    title\n    description\n    permissions {\n      createTask\n      updateTask\n      deleteTask\n      moveCard\n      moveColumn\n      createColumn\n      manageLabels\n      inviteMember\n      manageBoardMembers\n    }\n    visibility\n    createdAt\n    updatedAt\n  }\n}": typeof types.CreateBoardDocument,
    "mutation CreateColumn($boardId: ID!, $title: String!) {\n  createColumn(boardId: $boardId, title: $title) {\n    id\n    boardId\n    title\n    position\n    statusId\n    createdAt\n    updatedAt\n  }\n}": typeof types.CreateColumnDocument,
    "mutation CreateLabel($boardId: ID!, $name: String!, $color: String) {\n  createLabel(boardId: $boardId, name: $name, color: $color) {\n    id\n    boardId\n    name\n    color\n  }\n}": typeof types.CreateLabelDocument,
    "mutation CreateTask($columnId: ID!, $title: String!, $description: String, $priority: TaskPriority!, $labelIds: [ID!], $dueDate: DateTime, $assigneeId: ID) {\n  createTask(\n    columnId: $columnId\n    title: $title\n    description: $description\n    priority: $priority\n    labelIds: $labelIds\n    dueDate: $dueDate\n    assigneeId: $assigneeId\n  ) {\n    id\n    columnId\n    title\n    description\n    priority\n    statusId\n    labelIds\n    dueDate\n    assigneeId\n    position\n    createdAt\n    updatedAt\n  }\n}": typeof types.CreateTaskDocument,
    "mutation DeleteBoard($id: ID!) {\n  deleteBoard(id: $id)\n}": typeof types.DeleteBoardDocument,
    "mutation DeleteColumn($id: ID!) {\n  deleteColumn(id: $id)\n}": typeof types.DeleteColumnDocument,
    "mutation DeleteLabel($id: ID!) {\n  deleteLabel(id: $id)\n}": typeof types.DeleteLabelDocument,
    "mutation DeleteTask($id: ID!) {\n  deleteTask(id: $id)\n}": typeof types.DeleteTaskDocument,
    "mutation Login($email: String!, $password: String!) {\n  login(email: $email, password: $password) {\n    token\n    user {\n      id\n      email\n      name\n    }\n  }\n}": typeof types.LoginDocument,
    "mutation MoveTask($id: ID!, $columnId: ID!, $position: Int) {\n  moveTask(id: $id, columnId: $columnId, position: $position) {\n    id\n    columnId\n    position\n    statusId\n    updatedAt\n  }\n}": typeof types.MoveTaskDocument,
    "mutation Register($email: String!, $password: String!, $name: String) {\n  register(email: $email, password: $password, name: $name) {\n    token\n    user {\n      id\n      email\n      name\n      createdAt\n    }\n  }\n}": typeof types.RegisterDocument,
    "mutation UpdateBoard($id: ID!, $title: String, $description: String, $visibility: BoardVisibility) {\n  updateBoard(\n    id: $id\n    title: $title\n    description: $description\n    visibility: $visibility\n  ) {\n    id\n    title\n    description\n    visibility\n    createdAt\n    updatedAt\n  }\n}": typeof types.UpdateBoardDocument,
    "mutation UpdateColumn($id: ID!, $title: String!) {\n  updateColumn(id: $id, title: $title) {\n    id\n    boardId\n    title\n    position\n    statusId\n    createdAt\n    updatedAt\n  }\n}": typeof types.UpdateColumnDocument,
    "mutation UpdateLabel($id: ID!, $name: String, $color: String) {\n  updateLabel(id: $id, name: $name, color: $color) {\n    id\n    boardId\n    name\n    color\n  }\n}": typeof types.UpdateLabelDocument,
    "mutation UpdateTask($id: ID!, $title: String, $description: String, $priority: TaskPriority, $dueDate: DateTime, $assigneeId: ID) {\n  updateTask(\n    id: $id\n    title: $title\n    description: $description\n    priority: $priority\n    dueDate: $dueDate\n    assigneeId: $assigneeId\n  ) {\n    id\n    columnId\n    title\n    description\n    priority\n    statusId\n    labelIds\n    dueDate\n    assigneeId\n    position\n    createdAt\n    updatedAt\n  }\n}": typeof types.UpdateTaskDocument,
    "mutation UpdateTaskLabels($taskId: ID!, $labelIds: [ID!]!) {\n  updateTaskLabels(taskId: $taskId, labelIds: $labelIds) {\n    id\n    columnId\n    title\n    description\n    priority\n    statusId\n    labelIds\n    dueDate\n    assigneeId\n    position\n    createdAt\n    updatedAt\n  }\n}": typeof types.UpdateTaskLabelsDocument,
    "query Board($id: ID!) {\n  board(id: $id) {\n    id\n    title\n    description\n    permissions {\n      createTask\n      updateTask\n      deleteTask\n      moveCard\n      moveColumn\n      createColumn\n      manageLabels\n      inviteMember\n      manageBoardMembers\n    }\n    visibility\n    createdAt\n    updatedAt\n  }\n}": typeof types.BoardDocument,
    "query BoardLabels($boardId: ID!) {\n  boardLabels(boardId: $boardId) {\n    id\n    boardId\n    name\n    color\n  }\n}": typeof types.BoardLabelsDocument,
    "query Boards($first: Int, $after: String, $last: Int, $before: String, $visibility: BoardVisibility, $sortBy: BoardSortBy, $sortOrder: SortOrder) {\n  boards(\n    first: $first\n    after: $after\n    last: $last\n    before: $before\n    visibility: $visibility\n    sortBy: $sortBy\n    sortOrder: $sortOrder\n  ) {\n    edges {\n      cursor\n      node {\n        id\n        title\n        description\n        permissions {\n          createTask\n          updateTask\n          deleteTask\n          moveCard\n          moveColumn\n          createColumn\n          manageLabels\n          inviteMember\n          manageBoardMembers\n        }\n        visibility\n        createdAt\n        updatedAt\n      }\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}": typeof types.BoardsDocument,
    "query Columns($boardId: ID!) {\n  columns(boardId: $boardId) {\n    id\n    boardId\n    title\n    position\n    statusId\n    createdAt\n    updatedAt\n  }\n}": typeof types.ColumnsDocument,
    "query Me {\n  me {\n    id\n    email\n    name\n    createdAt\n  }\n}": typeof types.MeDocument,
    "query TaskActivities($taskId: ID!, $first: Int, $after: String) {\n  taskActivities(taskId: $taskId, first: $first, after: $after) {\n    edges {\n      node {\n        id\n        entityType\n        entityId\n        action\n        diff\n        createdAt\n        actor {\n          id\n          email\n        }\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}": typeof types.TaskActivitiesDocument,
    "query TasksByBoard($boardId: ID!, $query: String, $statusIds: [ID!], $priority: [TaskPriority!], $assigneeId: ID, $labelIds: [ID!], $dueFilter: DueFilter, $sortBy: TaskSortBy, $sortOrder: SortOrder, $first: Int, $after: String, $last: Int, $before: String) {\n  tasksByBoard(\n    boardId: $boardId\n    query: $query\n    statusIds: $statusIds\n    priority: $priority\n    assigneeId: $assigneeId\n    labelIds: $labelIds\n    dueFilter: $dueFilter\n    sortBy: $sortBy\n    sortOrder: $sortOrder\n    first: $first\n    after: $after\n    last: $last\n    before: $before\n  ) {\n    edges {\n      node {\n        id\n        columnId\n        title\n        description\n        priority\n        dueDate\n        assigneeId\n        position\n        statusId\n        labelIds\n        createdAt\n        updatedAt\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}": typeof types.TasksByBoardDocument,
    "query TasksByColumn($columnId: ID!, $first: Int) {\n  tasksByColumn(columnId: $columnId, first: $first) {\n    edges {\n      node {\n        id\n        columnId\n        title\n        description\n        priority\n        statusId\n        labelIds\n        dueDate\n        assigneeId\n        position\n        createdAt\n        updatedAt\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}": typeof types.TasksByColumnDocument,
};
const documents: Documents = {
    "mutation CreateBoard($title: String!, $description: String, $visibility: BoardVisibility!) {\n  createBoard(title: $title, description: $description, visibility: $visibility) {\n    id\n    title\n    description\n    permissions {\n      createTask\n      updateTask\n      deleteTask\n      moveCard\n      moveColumn\n      createColumn\n      manageLabels\n      inviteMember\n      manageBoardMembers\n    }\n    visibility\n    createdAt\n    updatedAt\n  }\n}": types.CreateBoardDocument,
    "mutation CreateColumn($boardId: ID!, $title: String!) {\n  createColumn(boardId: $boardId, title: $title) {\n    id\n    boardId\n    title\n    position\n    statusId\n    createdAt\n    updatedAt\n  }\n}": types.CreateColumnDocument,
    "mutation CreateLabel($boardId: ID!, $name: String!, $color: String) {\n  createLabel(boardId: $boardId, name: $name, color: $color) {\n    id\n    boardId\n    name\n    color\n  }\n}": types.CreateLabelDocument,
    "mutation CreateTask($columnId: ID!, $title: String!, $description: String, $priority: TaskPriority!, $labelIds: [ID!], $dueDate: DateTime, $assigneeId: ID) {\n  createTask(\n    columnId: $columnId\n    title: $title\n    description: $description\n    priority: $priority\n    labelIds: $labelIds\n    dueDate: $dueDate\n    assigneeId: $assigneeId\n  ) {\n    id\n    columnId\n    title\n    description\n    priority\n    statusId\n    labelIds\n    dueDate\n    assigneeId\n    position\n    createdAt\n    updatedAt\n  }\n}": types.CreateTaskDocument,
    "mutation DeleteBoard($id: ID!) {\n  deleteBoard(id: $id)\n}": types.DeleteBoardDocument,
    "mutation DeleteColumn($id: ID!) {\n  deleteColumn(id: $id)\n}": types.DeleteColumnDocument,
    "mutation DeleteLabel($id: ID!) {\n  deleteLabel(id: $id)\n}": types.DeleteLabelDocument,
    "mutation DeleteTask($id: ID!) {\n  deleteTask(id: $id)\n}": types.DeleteTaskDocument,
    "mutation Login($email: String!, $password: String!) {\n  login(email: $email, password: $password) {\n    token\n    user {\n      id\n      email\n      name\n    }\n  }\n}": types.LoginDocument,
    "mutation MoveTask($id: ID!, $columnId: ID!, $position: Int) {\n  moveTask(id: $id, columnId: $columnId, position: $position) {\n    id\n    columnId\n    position\n    statusId\n    updatedAt\n  }\n}": types.MoveTaskDocument,
    "mutation Register($email: String!, $password: String!, $name: String) {\n  register(email: $email, password: $password, name: $name) {\n    token\n    user {\n      id\n      email\n      name\n      createdAt\n    }\n  }\n}": types.RegisterDocument,
    "mutation UpdateBoard($id: ID!, $title: String, $description: String, $visibility: BoardVisibility) {\n  updateBoard(\n    id: $id\n    title: $title\n    description: $description\n    visibility: $visibility\n  ) {\n    id\n    title\n    description\n    visibility\n    createdAt\n    updatedAt\n  }\n}": types.UpdateBoardDocument,
    "mutation UpdateColumn($id: ID!, $title: String!) {\n  updateColumn(id: $id, title: $title) {\n    id\n    boardId\n    title\n    position\n    statusId\n    createdAt\n    updatedAt\n  }\n}": types.UpdateColumnDocument,
    "mutation UpdateLabel($id: ID!, $name: String, $color: String) {\n  updateLabel(id: $id, name: $name, color: $color) {\n    id\n    boardId\n    name\n    color\n  }\n}": types.UpdateLabelDocument,
    "mutation UpdateTask($id: ID!, $title: String, $description: String, $priority: TaskPriority, $dueDate: DateTime, $assigneeId: ID) {\n  updateTask(\n    id: $id\n    title: $title\n    description: $description\n    priority: $priority\n    dueDate: $dueDate\n    assigneeId: $assigneeId\n  ) {\n    id\n    columnId\n    title\n    description\n    priority\n    statusId\n    labelIds\n    dueDate\n    assigneeId\n    position\n    createdAt\n    updatedAt\n  }\n}": types.UpdateTaskDocument,
    "mutation UpdateTaskLabels($taskId: ID!, $labelIds: [ID!]!) {\n  updateTaskLabels(taskId: $taskId, labelIds: $labelIds) {\n    id\n    columnId\n    title\n    description\n    priority\n    statusId\n    labelIds\n    dueDate\n    assigneeId\n    position\n    createdAt\n    updatedAt\n  }\n}": types.UpdateTaskLabelsDocument,
    "query Board($id: ID!) {\n  board(id: $id) {\n    id\n    title\n    description\n    permissions {\n      createTask\n      updateTask\n      deleteTask\n      moveCard\n      moveColumn\n      createColumn\n      manageLabels\n      inviteMember\n      manageBoardMembers\n    }\n    visibility\n    createdAt\n    updatedAt\n  }\n}": types.BoardDocument,
    "query BoardLabels($boardId: ID!) {\n  boardLabels(boardId: $boardId) {\n    id\n    boardId\n    name\n    color\n  }\n}": types.BoardLabelsDocument,
    "query Boards($first: Int, $after: String, $last: Int, $before: String, $visibility: BoardVisibility, $sortBy: BoardSortBy, $sortOrder: SortOrder) {\n  boards(\n    first: $first\n    after: $after\n    last: $last\n    before: $before\n    visibility: $visibility\n    sortBy: $sortBy\n    sortOrder: $sortOrder\n  ) {\n    edges {\n      cursor\n      node {\n        id\n        title\n        description\n        permissions {\n          createTask\n          updateTask\n          deleteTask\n          moveCard\n          moveColumn\n          createColumn\n          manageLabels\n          inviteMember\n          manageBoardMembers\n        }\n        visibility\n        createdAt\n        updatedAt\n      }\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}": types.BoardsDocument,
    "query Columns($boardId: ID!) {\n  columns(boardId: $boardId) {\n    id\n    boardId\n    title\n    position\n    statusId\n    createdAt\n    updatedAt\n  }\n}": types.ColumnsDocument,
    "query Me {\n  me {\n    id\n    email\n    name\n    createdAt\n  }\n}": types.MeDocument,
    "query TaskActivities($taskId: ID!, $first: Int, $after: String) {\n  taskActivities(taskId: $taskId, first: $first, after: $after) {\n    edges {\n      node {\n        id\n        entityType\n        entityId\n        action\n        diff\n        createdAt\n        actor {\n          id\n          email\n        }\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}": types.TaskActivitiesDocument,
    "query TasksByBoard($boardId: ID!, $query: String, $statusIds: [ID!], $priority: [TaskPriority!], $assigneeId: ID, $labelIds: [ID!], $dueFilter: DueFilter, $sortBy: TaskSortBy, $sortOrder: SortOrder, $first: Int, $after: String, $last: Int, $before: String) {\n  tasksByBoard(\n    boardId: $boardId\n    query: $query\n    statusIds: $statusIds\n    priority: $priority\n    assigneeId: $assigneeId\n    labelIds: $labelIds\n    dueFilter: $dueFilter\n    sortBy: $sortBy\n    sortOrder: $sortOrder\n    first: $first\n    after: $after\n    last: $last\n    before: $before\n  ) {\n    edges {\n      node {\n        id\n        columnId\n        title\n        description\n        priority\n        dueDate\n        assigneeId\n        position\n        statusId\n        labelIds\n        createdAt\n        updatedAt\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}": types.TasksByBoardDocument,
    "query TasksByColumn($columnId: ID!, $first: Int) {\n  tasksByColumn(columnId: $columnId, first: $first) {\n    edges {\n      node {\n        id\n        columnId\n        title\n        description\n        priority\n        statusId\n        labelIds\n        dueDate\n        assigneeId\n        position\n        createdAt\n        updatedAt\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}": types.TasksByColumnDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation CreateBoard($title: String!, $description: String, $visibility: BoardVisibility!) {\n  createBoard(title: $title, description: $description, visibility: $visibility) {\n    id\n    title\n    description\n    permissions {\n      createTask\n      updateTask\n      deleteTask\n      moveCard\n      moveColumn\n      createColumn\n      manageLabels\n      inviteMember\n      manageBoardMembers\n    }\n    visibility\n    createdAt\n    updatedAt\n  }\n}"): (typeof documents)["mutation CreateBoard($title: String!, $description: String, $visibility: BoardVisibility!) {\n  createBoard(title: $title, description: $description, visibility: $visibility) {\n    id\n    title\n    description\n    permissions {\n      createTask\n      updateTask\n      deleteTask\n      moveCard\n      moveColumn\n      createColumn\n      manageLabels\n      inviteMember\n      manageBoardMembers\n    }\n    visibility\n    createdAt\n    updatedAt\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation CreateColumn($boardId: ID!, $title: String!) {\n  createColumn(boardId: $boardId, title: $title) {\n    id\n    boardId\n    title\n    position\n    statusId\n    createdAt\n    updatedAt\n  }\n}"): (typeof documents)["mutation CreateColumn($boardId: ID!, $title: String!) {\n  createColumn(boardId: $boardId, title: $title) {\n    id\n    boardId\n    title\n    position\n    statusId\n    createdAt\n    updatedAt\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation CreateLabel($boardId: ID!, $name: String!, $color: String) {\n  createLabel(boardId: $boardId, name: $name, color: $color) {\n    id\n    boardId\n    name\n    color\n  }\n}"): (typeof documents)["mutation CreateLabel($boardId: ID!, $name: String!, $color: String) {\n  createLabel(boardId: $boardId, name: $name, color: $color) {\n    id\n    boardId\n    name\n    color\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation CreateTask($columnId: ID!, $title: String!, $description: String, $priority: TaskPriority!, $labelIds: [ID!], $dueDate: DateTime, $assigneeId: ID) {\n  createTask(\n    columnId: $columnId\n    title: $title\n    description: $description\n    priority: $priority\n    labelIds: $labelIds\n    dueDate: $dueDate\n    assigneeId: $assigneeId\n  ) {\n    id\n    columnId\n    title\n    description\n    priority\n    statusId\n    labelIds\n    dueDate\n    assigneeId\n    position\n    createdAt\n    updatedAt\n  }\n}"): (typeof documents)["mutation CreateTask($columnId: ID!, $title: String!, $description: String, $priority: TaskPriority!, $labelIds: [ID!], $dueDate: DateTime, $assigneeId: ID) {\n  createTask(\n    columnId: $columnId\n    title: $title\n    description: $description\n    priority: $priority\n    labelIds: $labelIds\n    dueDate: $dueDate\n    assigneeId: $assigneeId\n  ) {\n    id\n    columnId\n    title\n    description\n    priority\n    statusId\n    labelIds\n    dueDate\n    assigneeId\n    position\n    createdAt\n    updatedAt\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation DeleteBoard($id: ID!) {\n  deleteBoard(id: $id)\n}"): (typeof documents)["mutation DeleteBoard($id: ID!) {\n  deleteBoard(id: $id)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation DeleteColumn($id: ID!) {\n  deleteColumn(id: $id)\n}"): (typeof documents)["mutation DeleteColumn($id: ID!) {\n  deleteColumn(id: $id)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation DeleteLabel($id: ID!) {\n  deleteLabel(id: $id)\n}"): (typeof documents)["mutation DeleteLabel($id: ID!) {\n  deleteLabel(id: $id)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation DeleteTask($id: ID!) {\n  deleteTask(id: $id)\n}"): (typeof documents)["mutation DeleteTask($id: ID!) {\n  deleteTask(id: $id)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation Login($email: String!, $password: String!) {\n  login(email: $email, password: $password) {\n    token\n    user {\n      id\n      email\n      name\n    }\n  }\n}"): (typeof documents)["mutation Login($email: String!, $password: String!) {\n  login(email: $email, password: $password) {\n    token\n    user {\n      id\n      email\n      name\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation MoveTask($id: ID!, $columnId: ID!, $position: Int) {\n  moveTask(id: $id, columnId: $columnId, position: $position) {\n    id\n    columnId\n    position\n    statusId\n    updatedAt\n  }\n}"): (typeof documents)["mutation MoveTask($id: ID!, $columnId: ID!, $position: Int) {\n  moveTask(id: $id, columnId: $columnId, position: $position) {\n    id\n    columnId\n    position\n    statusId\n    updatedAt\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation Register($email: String!, $password: String!, $name: String) {\n  register(email: $email, password: $password, name: $name) {\n    token\n    user {\n      id\n      email\n      name\n      createdAt\n    }\n  }\n}"): (typeof documents)["mutation Register($email: String!, $password: String!, $name: String) {\n  register(email: $email, password: $password, name: $name) {\n    token\n    user {\n      id\n      email\n      name\n      createdAt\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation UpdateBoard($id: ID!, $title: String, $description: String, $visibility: BoardVisibility) {\n  updateBoard(\n    id: $id\n    title: $title\n    description: $description\n    visibility: $visibility\n  ) {\n    id\n    title\n    description\n    visibility\n    createdAt\n    updatedAt\n  }\n}"): (typeof documents)["mutation UpdateBoard($id: ID!, $title: String, $description: String, $visibility: BoardVisibility) {\n  updateBoard(\n    id: $id\n    title: $title\n    description: $description\n    visibility: $visibility\n  ) {\n    id\n    title\n    description\n    visibility\n    createdAt\n    updatedAt\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation UpdateColumn($id: ID!, $title: String!) {\n  updateColumn(id: $id, title: $title) {\n    id\n    boardId\n    title\n    position\n    statusId\n    createdAt\n    updatedAt\n  }\n}"): (typeof documents)["mutation UpdateColumn($id: ID!, $title: String!) {\n  updateColumn(id: $id, title: $title) {\n    id\n    boardId\n    title\n    position\n    statusId\n    createdAt\n    updatedAt\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation UpdateLabel($id: ID!, $name: String, $color: String) {\n  updateLabel(id: $id, name: $name, color: $color) {\n    id\n    boardId\n    name\n    color\n  }\n}"): (typeof documents)["mutation UpdateLabel($id: ID!, $name: String, $color: String) {\n  updateLabel(id: $id, name: $name, color: $color) {\n    id\n    boardId\n    name\n    color\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation UpdateTask($id: ID!, $title: String, $description: String, $priority: TaskPriority, $dueDate: DateTime, $assigneeId: ID) {\n  updateTask(\n    id: $id\n    title: $title\n    description: $description\n    priority: $priority\n    dueDate: $dueDate\n    assigneeId: $assigneeId\n  ) {\n    id\n    columnId\n    title\n    description\n    priority\n    statusId\n    labelIds\n    dueDate\n    assigneeId\n    position\n    createdAt\n    updatedAt\n  }\n}"): (typeof documents)["mutation UpdateTask($id: ID!, $title: String, $description: String, $priority: TaskPriority, $dueDate: DateTime, $assigneeId: ID) {\n  updateTask(\n    id: $id\n    title: $title\n    description: $description\n    priority: $priority\n    dueDate: $dueDate\n    assigneeId: $assigneeId\n  ) {\n    id\n    columnId\n    title\n    description\n    priority\n    statusId\n    labelIds\n    dueDate\n    assigneeId\n    position\n    createdAt\n    updatedAt\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation UpdateTaskLabels($taskId: ID!, $labelIds: [ID!]!) {\n  updateTaskLabels(taskId: $taskId, labelIds: $labelIds) {\n    id\n    columnId\n    title\n    description\n    priority\n    statusId\n    labelIds\n    dueDate\n    assigneeId\n    position\n    createdAt\n    updatedAt\n  }\n}"): (typeof documents)["mutation UpdateTaskLabels($taskId: ID!, $labelIds: [ID!]!) {\n  updateTaskLabels(taskId: $taskId, labelIds: $labelIds) {\n    id\n    columnId\n    title\n    description\n    priority\n    statusId\n    labelIds\n    dueDate\n    assigneeId\n    position\n    createdAt\n    updatedAt\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query Board($id: ID!) {\n  board(id: $id) {\n    id\n    title\n    description\n    permissions {\n      createTask\n      updateTask\n      deleteTask\n      moveCard\n      moveColumn\n      createColumn\n      manageLabels\n      inviteMember\n      manageBoardMembers\n    }\n    visibility\n    createdAt\n    updatedAt\n  }\n}"): (typeof documents)["query Board($id: ID!) {\n  board(id: $id) {\n    id\n    title\n    description\n    permissions {\n      createTask\n      updateTask\n      deleteTask\n      moveCard\n      moveColumn\n      createColumn\n      manageLabels\n      inviteMember\n      manageBoardMembers\n    }\n    visibility\n    createdAt\n    updatedAt\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query BoardLabels($boardId: ID!) {\n  boardLabels(boardId: $boardId) {\n    id\n    boardId\n    name\n    color\n  }\n}"): (typeof documents)["query BoardLabels($boardId: ID!) {\n  boardLabels(boardId: $boardId) {\n    id\n    boardId\n    name\n    color\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query Boards($first: Int, $after: String, $last: Int, $before: String, $visibility: BoardVisibility, $sortBy: BoardSortBy, $sortOrder: SortOrder) {\n  boards(\n    first: $first\n    after: $after\n    last: $last\n    before: $before\n    visibility: $visibility\n    sortBy: $sortBy\n    sortOrder: $sortOrder\n  ) {\n    edges {\n      cursor\n      node {\n        id\n        title\n        description\n        permissions {\n          createTask\n          updateTask\n          deleteTask\n          moveCard\n          moveColumn\n          createColumn\n          manageLabels\n          inviteMember\n          manageBoardMembers\n        }\n        visibility\n        createdAt\n        updatedAt\n      }\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}"): (typeof documents)["query Boards($first: Int, $after: String, $last: Int, $before: String, $visibility: BoardVisibility, $sortBy: BoardSortBy, $sortOrder: SortOrder) {\n  boards(\n    first: $first\n    after: $after\n    last: $last\n    before: $before\n    visibility: $visibility\n    sortBy: $sortBy\n    sortOrder: $sortOrder\n  ) {\n    edges {\n      cursor\n      node {\n        id\n        title\n        description\n        permissions {\n          createTask\n          updateTask\n          deleteTask\n          moveCard\n          moveColumn\n          createColumn\n          manageLabels\n          inviteMember\n          manageBoardMembers\n        }\n        visibility\n        createdAt\n        updatedAt\n      }\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query Columns($boardId: ID!) {\n  columns(boardId: $boardId) {\n    id\n    boardId\n    title\n    position\n    statusId\n    createdAt\n    updatedAt\n  }\n}"): (typeof documents)["query Columns($boardId: ID!) {\n  columns(boardId: $boardId) {\n    id\n    boardId\n    title\n    position\n    statusId\n    createdAt\n    updatedAt\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query Me {\n  me {\n    id\n    email\n    name\n    createdAt\n  }\n}"): (typeof documents)["query Me {\n  me {\n    id\n    email\n    name\n    createdAt\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query TaskActivities($taskId: ID!, $first: Int, $after: String) {\n  taskActivities(taskId: $taskId, first: $first, after: $after) {\n    edges {\n      node {\n        id\n        entityType\n        entityId\n        action\n        diff\n        createdAt\n        actor {\n          id\n          email\n        }\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}"): (typeof documents)["query TaskActivities($taskId: ID!, $first: Int, $after: String) {\n  taskActivities(taskId: $taskId, first: $first, after: $after) {\n    edges {\n      node {\n        id\n        entityType\n        entityId\n        action\n        diff\n        createdAt\n        actor {\n          id\n          email\n        }\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query TasksByBoard($boardId: ID!, $query: String, $statusIds: [ID!], $priority: [TaskPriority!], $assigneeId: ID, $labelIds: [ID!], $dueFilter: DueFilter, $sortBy: TaskSortBy, $sortOrder: SortOrder, $first: Int, $after: String, $last: Int, $before: String) {\n  tasksByBoard(\n    boardId: $boardId\n    query: $query\n    statusIds: $statusIds\n    priority: $priority\n    assigneeId: $assigneeId\n    labelIds: $labelIds\n    dueFilter: $dueFilter\n    sortBy: $sortBy\n    sortOrder: $sortOrder\n    first: $first\n    after: $after\n    last: $last\n    before: $before\n  ) {\n    edges {\n      node {\n        id\n        columnId\n        title\n        description\n        priority\n        dueDate\n        assigneeId\n        position\n        statusId\n        labelIds\n        createdAt\n        updatedAt\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}"): (typeof documents)["query TasksByBoard($boardId: ID!, $query: String, $statusIds: [ID!], $priority: [TaskPriority!], $assigneeId: ID, $labelIds: [ID!], $dueFilter: DueFilter, $sortBy: TaskSortBy, $sortOrder: SortOrder, $first: Int, $after: String, $last: Int, $before: String) {\n  tasksByBoard(\n    boardId: $boardId\n    query: $query\n    statusIds: $statusIds\n    priority: $priority\n    assigneeId: $assigneeId\n    labelIds: $labelIds\n    dueFilter: $dueFilter\n    sortBy: $sortBy\n    sortOrder: $sortOrder\n    first: $first\n    after: $after\n    last: $last\n    before: $before\n  ) {\n    edges {\n      node {\n        id\n        columnId\n        title\n        description\n        priority\n        dueDate\n        assigneeId\n        position\n        statusId\n        labelIds\n        createdAt\n        updatedAt\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query TasksByColumn($columnId: ID!, $first: Int) {\n  tasksByColumn(columnId: $columnId, first: $first) {\n    edges {\n      node {\n        id\n        columnId\n        title\n        description\n        priority\n        statusId\n        labelIds\n        dueDate\n        assigneeId\n        position\n        createdAt\n        updatedAt\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}"): (typeof documents)["query TasksByColumn($columnId: ID!, $first: Int) {\n  tasksByColumn(columnId: $columnId, first: $first) {\n    edges {\n      node {\n        id\n        columnId\n        title\n        description\n        priority\n        statusId\n        labelIds\n        dueDate\n        assigneeId\n        position\n        createdAt\n        updatedAt\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;