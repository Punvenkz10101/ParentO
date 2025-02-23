// Add this to your socket.io setup
socket.on('join_classroom', (classCode) => {
  socket.join(classCode);
});

// When a new announcement is created
io.to(classCode).emit('new_announcement', announcement); 