- use shadcn, zustand and dnd-kit to implement the following
- I want to implement a game called TimeChain
- In TimeChain, players are presented with a "chain" of historical events or inventions, and the objective is to correctly arrange them in chronological order. Think of it as a visual and interactive timeline-building game.
- store the json data fetched in the root page in a global store like zustand
- exaple of the event data returned [{
  year: randomYear,
  event: randomEvent.content,
  imageUrl: imageUrl,
  timeZone: timeZone,
  difficulty: difficulty,
  }]
- Then use the array of events and display a horizontally aligned cards that can be rearranged by dragging
- Make the imageUrl fit the card like a background and display the text of event, and timezone on top of the image centered in white text.
- add a border and a border color to the card that is being dragged and make the droppable array background color change when the card is dragged
