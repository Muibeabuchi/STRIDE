// // Example usage with dummy data
// // components/kanban/KanbanCardExample.tsx
// import React from "react";
// import KanbanCard from "./advanced-kanban-task-card";
// import { Card } from "./advanced-kanban-task-card";

// const dummyCards: Card[] = [
//   {
//     id: "1",
//     identifier: "DAC-8",
//     title: "Invite your teammates",
//     status: "in-progress",
//     priority: "urgent",
//     labels: [{ id: "1", name: "!", color: "orange" }],
//   },
//   {
//     id: "2",
//     identifier: "DAC-4",
//     title: "Connect GitHub or GitLab",
//     status: "in-progress",
//     priority: "urgent",
//     labels: [
//       { id: "1", name: "!", color: "orange" },
//       { id: "2", name: "Improvement", color: "blue" },
//     ],
//   },
//   {
//     id: "3",
//     identifier: "DAC-11",
//     title: "Child components refactor",
//     status: "in-progress",
//     priority: "urgent",
//     assignee: {
//       id: "1",
//       name: "John Doe",
//       avatar:
//         "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
//     },
//     dueDate: "2024-06-12",
//     labels: [
//       { id: "1", name: "!", color: "orange" },
//       { id: "2", name: "Improvement", color: "blue" },
//     ],
//   },
//   {
//     id: "4",
//     identifier: "DAC-6",
//     title: "Use Cycles to focus work over n-weeks",
//     status: "in-progress",
//     priority: "medium",
//     estimatePoints: 5,
//   },
//   {
//     id: "5",
//     identifier: "DAC-7",
//     title: "Use Projects to organize work for features or releases",
//     status: "in-progress",
//     priority: "medium",
//     labels: [{ id: "3", name: "Bug", color: "red" }],
//     estimatePoints: 3,
//   },
// ];

// const KanbanCardExample: React.FC = () => {
//   const handleCardClick = (card: Card) => {
//     console.log("Card clicked:", card);
//   };

//   const handleCardUpdate = (cardId: string, updates: Partial<Card>) => {
//     console.log("Card update:", cardId, updates);
//   };

//   return (
//     <div className="p-4 space-y-3 max-w-sm">
//       {dummyCards.map((card) => (
//         <KanbanCard
//           key={card.id}
//           card={card}
//           onCardClick={handleCardClick}
//           onCardUpdate={handleCardUpdate}
//         />
//       ))}
//     </div>
//   );
// };

// export default KanbanCardExample;
