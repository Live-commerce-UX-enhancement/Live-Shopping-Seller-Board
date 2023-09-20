const rooms = [];

const addRoom = ({ id, broadcastUrl, broadcastId }) => {

  const existingRoom = rooms.find((room) => room.id === id && room.broadcastId === broadcastId && room.broadcastUrl === broadcastUrl);

  if(!broadcastUrl || !broadcastId) return { error: 'broadcastUrl is required.' };
  if(existingRoom) return { error: 'broadcastUrl is taken.' };

  const room = { id, broadcastId, broadcastUrl };

  rooms.push(room);

  return { room };
}

const removeRoom = (id) => {
  const index = rooms.findIndex((room) => room.id === id);

  if(index !== -1) return rooms.splice(index, 1)[0];
}

const getRoomByBroadcastId = ({broadcastId}) => {
  const room = rooms.find((room) => room.broadcastId === broadcastId);

  console.log(broadcastId);

  if (!room) return {error: 'there is no room'};

  return {room};
};

const getRoom = (id) => rooms.find((room) => room.id === id);


module.exports = { addRoom, removeRoom, getRoom, getRoomByBroadcastId};